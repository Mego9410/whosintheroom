'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { FileUpload } from '@/components/import/FileUpload';
import { ColumnMapper } from '@/components/import/ColumnMapper';
import { ImportPreview } from '@/components/import/ImportPreview';
import { HeaderSelector } from '@/components/import/HeaderSelector';
import { EventAssignment } from '@/components/import/EventAssignment';
import { FileParser } from '@/lib/services/file-parser';
import { ColumnMatcher } from '@/lib/services/column-matcher';
import { DataValidator } from '@/lib/services/data-validator';
import { createGuest, getGuestByEmail } from '@/lib/data/guests';
import { getEvents, createEvent } from '@/lib/data/events';
import { bulkAssignGuestsToEvent } from '@/lib/data/event-guests';
import type { ParsedFile } from '@/lib/services/file-parser';
import type { ColumnMapping } from '@/lib/services/column-matcher';
import type { ValidatedRow } from '@/lib/services/data-validator';
import type { Event } from '@/lib/types';

type ImportStep = 'upload' | 'map' | 'preview' | 'importing' | 'complete';

const DEFAULT_ORG_ID = 'org_default';
const DEFAULT_USER_ID = 'user_default';

export default function ImportPage() {
  const router = useRouter();
  const [step, setStep] = useState<ImportStep>('upload');
  const [file, setFile] = useState<File | null>(null);
  const [parsedFile, setParsedFile] = useState<ParsedFile | null>(null);
  const [columnMappings, setColumnMappings] = useState<ColumnMapping[]>([]);
  const [validationResult, setValidationResult] = useState<{
    validRows: ValidatedRow[];
    invalidRows: ValidatedRow[];
    totalErrors: number;
  } | null>(null);
  const [selectedRows, setSelectedRows] = useState<ValidatedRow[]>([]);
  const [importProgress, setImportProgress] = useState(0);
  const [importedCount, setImportedCount] = useState(0);
  const [failedCount, setFailedCount] = useState(0);
  const [existingCount, setExistingCount] = useState(0);
  const [importErrors, setImportErrors] = useState<Array<{ rowIndex: number; email: string; error: string }>>([]);
  const [headerRowIndex, setHeaderRowIndex] = useState<number>(0);
  const [startColumnIndex, setStartColumnIndex] = useState<number>(0);
  const [showHeaderSelector, setShowHeaderSelector] = useState(false);
  const [events, setEvents] = useState<Event[]>([]);
  const [targetEventId, setTargetEventId] = useState<string | null>(null);
  const [isAssigning, setIsAssigning] = useState(false);

  const handleFileSelect = async (selectedFile: File) => {
    try {
      setFile(selectedFile);
      const parsed = await FileParser.parseFile(selectedFile);
      setParsedFile(parsed);
      
      // Set initial header row and column indices
      setHeaderRowIndex(parsed.headerRowIndex || 0);
      setStartColumnIndex(parsed.startColumnIndex || 0);

      // Auto-match columns using headers AND sample data
      const sampleRows = parsed.rows.slice(0, 10); // Use first 10 rows for analysis
      const mappings = ColumnMatcher.autoMatch(parsed.headers, sampleRows);
      setColumnMappings(mappings);

      setStep('map');
    } catch (error) {
      console.error('Error parsing file:', error);
      alert(error instanceof Error ? error.message : 'Failed to parse file');
    }
  };

  const handleHeaderAdjust = async () => {
    if (!file || !parsedFile) return;

    try {
      // Re-parse file with new header settings
      const content = await file.text();
      const delimiter = FileParser.detectDelimiter(content);
      const parsed = FileParser.parseCSV(content, {
        delimiter,
        headerRowIndex,
        startColumnIndex,
      });
      
      setParsedFile(parsed);
      setHeaderRowIndex(parsed.headerRowIndex || headerRowIndex);
      setStartColumnIndex(parsed.startColumnIndex || startColumnIndex);

      // Re-match columns with new headers
      const sampleRows = parsed.rows.slice(0, 10);
      const mappings = ColumnMatcher.autoMatch(parsed.headers, sampleRows);
      setColumnMappings(mappings);
      
      setShowHeaderSelector(false);
    } catch (error) {
      console.error('Error re-parsing file:', error);
      alert('Failed to re-parse file with new settings');
    }
  };

  const handleMappingComplete = async () => {
    if (!parsedFile) return;

    // Filter out disabled columns from mappings
    const enabledMappings = columnMappings.filter(m => m.enabled);
    
    // Validate data with current mappings
    const result = DataValidator.validate(parsedFile.rows, enabledMappings);
    setValidationResult(result);
    // Select all valid rows by default
    setSelectedRows([...result.validRows]);
    
    // Load events for assignment
    try {
      const allEvents = await getEvents();
      setEvents(allEvents);
    } catch (error) {
      console.error('Error loading events:', error);
    }
    
    setStep('preview');
  };

  const handleImport = async () => {
    // Use selected rows if any, otherwise use all valid rows
    const rowsToImport = selectedRows.length > 0 ? selectedRows : validationResult?.validRows || [];
    
    if (rowsToImport.length === 0) {
      alert('No rows selected for import');
      return;
    }

    setStep('importing');
    setImportProgress(0);
    setImportedCount(0);
    setFailedCount(0);
    setExistingCount(0);
    setImportErrors([]);

    let imported = 0;
    let failed = 0;
    let existing = 0;
    const importedGuestIds: string[] = [];
    const errors: Array<{ rowIndex: number; email: string; error: string }> = [];

    // Import guests
    for (let i = 0; i < rowsToImport.length; i++) {
      const row = rowsToImport[i];
      const normalizedData = DataValidator.normalize(row.data);

      try {
        const guest = await createGuest({
          organization_id: DEFAULT_ORG_ID,
          first_name: normalizedData.first_name,
          last_name: normalizedData.last_name,
          email: normalizedData.email,
          company: normalizedData.company || undefined,
          job_title: normalizedData.job_title || undefined,
          phone: normalizedData.phone || undefined,
          address: normalizedData.address || undefined,
          notes: normalizedData.notes || undefined,
          created_by: DEFAULT_USER_ID,
        });
        importedGuestIds.push(guest.id);
        imported++;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        
        // Handle duplicate emails - find existing guest and add to assignment list
        if (errorMessage.includes('already exists') || errorMessage.includes('duplicate')) {
          try {
            const existingGuest = await getGuestByEmail(normalizedData.email, DEFAULT_ORG_ID);
            if (existingGuest) {
              // Guest already exists - add them to the assignment list
              importedGuestIds.push(existingGuest.id);
              existing++;
              // Don't count this as a failure
              continue;
            }
          } catch (lookupError) {
            console.error(`Error looking up existing guest for ${normalizedData.email}:`, lookupError);
          }
        }
        
        // If we get here, it's a real error
        console.error(`Error importing row ${row.rowIndex}:`, error);
        failed++;
        
        // Track error details
        let userFriendlyError = errorMessage;
        
        // Provide user-friendly error messages
        if (errorMessage.includes('required')) {
          userFriendlyError = 'Missing required fields';
        } else if (errorMessage.includes('invalid')) {
          userFriendlyError = 'Invalid data format';
        } else {
          userFriendlyError = 'Failed to import guest';
        }
        
        errors.push({
          rowIndex: row.rowIndex,
          email: normalizedData.email || 'Unknown',
          error: userFriendlyError,
        });
      }

      setImportProgress(Math.round(((i + 1) / rowsToImport.length) * 100));
      setImportedCount(imported);
      setFailedCount(failed);
      setExistingCount(existing);
      setImportErrors([...errors]);
    }

    // Assign guests to event if one was selected
    if (targetEventId && importedGuestIds.length > 0) {
      try {
        setIsAssigning(true);
        await bulkAssignGuestsToEvent(targetEventId, importedGuestIds, DEFAULT_USER_ID);
      } catch (error) {
        console.error('Error assigning guests to event:', error);
        // Don't fail the import, just log the error
      } finally {
        setIsAssigning(false);
      }
    }

    setStep('complete');
  };

  const handleAssignToExisting = (eventId: string) => {
    setTargetEventId(eventId);
  };

  const handleCreateAndAssign = async (eventData: { name: string; date: string; location: string; description?: string }) => {
    try {
      setIsAssigning(true);
      const newEvent = await createEvent({
        organization_id: DEFAULT_ORG_ID,
        name: eventData.name,
        date: eventData.date,
        location: eventData.location,
        description: eventData.description,
        status: 'draft',
        created_by: DEFAULT_USER_ID,
      });
      setTargetEventId(newEvent.id);
      // Refresh events list
      const allEvents = await getEvents();
      setEvents(allEvents);
      alert(`Event "${newEvent.name}" created! Guests will be assigned when you import.`);
    } catch (error) {
      console.error('Error creating event:', error);
      alert('Failed to create event. Please try again.');
    } finally {
      setIsAssigning(false);
    }
  };

  const handleReset = () => {
    setStep('upload');
    setFile(null);
    setParsedFile(null);
    setColumnMappings([]);
    setValidationResult(null);
    setSelectedRows([]);
    setImportProgress(0);
    setImportedCount(0);
    setFailedCount(0);
    setHeaderRowIndex(0);
    setStartColumnIndex(0);
    setShowHeaderSelector(false);
    setEvents([]);
    setTargetEventId(null);
    setIsAssigning(false);
    setImportErrors([]);
    setExistingCount(0);
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <Link
          href="/guests"
          className="text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors mb-4 inline-block"
        >
          ← Back to Guests
        </Link>
        <h1 className="text-2xl font-bold text-[var(--color-text)]">Import Guests</h1>
        <p className="text-sm text-[var(--color-text-muted)] mt-1">
          Import guests from a CSV or TSV file
        </p>
      </div>

      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {(['upload', 'map', 'preview'] as ImportStep[]).map((stepName, index) => {
            const isActive = step === stepName;
            const isCompleted = ['map', 'preview', 'importing', 'complete'].includes(step) && index < ['upload', 'map', 'preview'].indexOf(step);
            
            return (
              <React.Fragment key={stepName}>
                <div className="flex items-center">
                  <div
                    className={`
                      w-10 h-10 rounded-full flex items-center justify-center font-semibold
                      ${isActive ? 'bg-[var(--color-accent)] text-white' : ''}
                      ${isCompleted ? 'bg-green-500 text-white' : ''}
                      ${!isActive && !isCompleted ? 'bg-[var(--color-surface-hover)] text-[var(--color-text-muted)]' : ''}
                    `}
                  >
                    {isCompleted ? '✓' : index + 1}
                  </div>
                  <span className={`ml-2 text-sm font-medium ${isActive ? 'text-[var(--color-text)]' : 'text-[var(--color-text-muted)]'}`}>
                    {stepName === 'upload' ? 'Upload' : stepName === 'map' ? 'Map Columns' : 'Preview'}
                  </span>
                </div>
                {index < 2 && (
                  <div className={`flex-1 h-1 mx-4 ${isCompleted ? 'bg-green-500' : 'bg-[var(--color-border)]'}`} />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Step Content */}
      <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg p-6">
        {step === 'upload' && (
          <div>
            <h2 className="text-xl font-semibold text-[var(--color-text)] mb-4">Step 1: Upload File</h2>
            <FileUpload onFileSelect={handleFileSelect} />
          </div>
        )}

        {step === 'map' && parsedFile && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-[var(--color-text)] mb-2">Step 2: Map Columns</h2>
                <p className="text-sm text-[var(--color-text-muted)]">
                  File: <span className="font-mono">{file?.name}</span> ({parsedFile.totalRows} rows)
                </p>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setShowHeaderSelector(!showHeaderSelector)}
              >
                {showHeaderSelector ? 'Hide' : 'Adjust'} Header Detection
              </Button>
            </div>

            {showHeaderSelector && (
              <HeaderSelector
                parsedFile={parsedFile}
                headerRowIndex={headerRowIndex}
                startColumnIndex={startColumnIndex}
                onHeaderRowChange={setHeaderRowIndex}
                onStartColumnChange={setStartColumnIndex}
                onApply={handleHeaderAdjust}
              />
            )}

            <ColumnMapper
              headers={parsedFile.headers}
              mappings={columnMappings}
              sampleRows={parsedFile.rows.slice(0, 10)}
              onMappingChange={setColumnMappings}
            />
            <div className="flex justify-end gap-4">
              <Button variant="outline" onClick={() => setStep('upload')}>
                Back
              </Button>
              <Button onClick={handleMappingComplete}>
                Continue to Preview
              </Button>
            </div>
          </div>
        )}

        {step === 'preview' && validationResult && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-[var(--color-text)] mb-2">Step 3: Preview & Validate</h2>
              <p className="text-sm text-[var(--color-text-muted)]">
                Review the data before importing. {validationResult.validRows.length} rows are ready to import.
              </p>
            </div>
            <ImportPreview
              validRows={validationResult.validRows}
              invalidRows={validationResult.invalidRows}
              totalRows={parsedFile?.totalRows || 0}
              onRowsChange={setSelectedRows}
            />
            
            {/* Event Assignment */}
            <EventAssignment
              events={events}
              onAssignToExisting={handleAssignToExisting}
              onCreateAndAssign={handleCreateAndAssign}
              isLoading={isAssigning}
            />

            {targetEventId && (
              <div className="bg-white dark:bg-[var(--color-surface)] border-2 border-green-500 dark:border-green-400 rounded-lg p-4 shadow-sm">
                <p className="text-sm text-[var(--color-text)] dark:text-[var(--color-text)] font-medium">
                  ✓ Guests will be assigned to: <strong className="text-green-600 dark:text-green-400">{events.find(e => e.id === targetEventId)?.name || 'Selected event'}</strong>
                </p>
              </div>
            )}

            <div className="flex justify-end gap-4">
              <Button variant="outline" onClick={() => setStep('map')}>
                Back
              </Button>
              {selectedRows.length > 0 || validationResult.validRows.length > 0 ? (
                <Button onClick={handleImport} disabled={isAssigning}>
                  Import {selectedRows.length > 0 ? selectedRows.length : validationResult.validRows.length} {selectedRows.length === 1 ? 'Guest' : 'Guests'}
                  {targetEventId && ' & Assign to Event'}
                </Button>
              ) : (
                <Button disabled>
                  No Valid Rows to Import
                </Button>
              )}
            </div>
          </div>
        )}

        {step === 'importing' && (
          <div className="text-center py-12">
            <div className="mb-4">
              <div className="w-full bg-[var(--color-border)] rounded-full h-4 mb-2">
                <div
                  className="bg-[var(--color-accent)] h-4 rounded-full transition-all duration-300"
                  style={{ width: `${importProgress}%` }}
                />
              </div>
              <p className="text-sm text-[var(--color-text-muted)]">
                {importProgress}% complete
              </p>
            </div>
            <p className="text-[var(--color-text)] mb-2">
              {isAssigning ? 'Assigning guests to event...' : 'Importing guests...'}
            </p>
            <p className="text-sm text-[var(--color-text-muted)]">
              {importedCount} new, {existingCount} existing, {failedCount} failed
              {targetEventId && !isAssigning && ', assigning to event...'}
            </p>
          </div>
        )}

        {step === 'complete' && (
          <div className="space-y-6">
            <div className="text-center py-6">
              <div className="mb-4">
                {importedCount > 0 ? (
                  <svg
                    className="mx-auto h-16 w-16 text-green-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                ) : (
                  <svg
                    className="mx-auto h-16 w-16 text-red-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                )}
              </div>
              <h2 className="text-2xl font-bold text-[var(--color-text)] mb-2">
                Import Complete!
              </h2>
              <p className="text-[var(--color-text-muted)] mb-6">
                {importedCount > 0 && (
                  <span>
                    Successfully imported {importedCount} new {importedCount === 1 ? 'guest' : 'guests'}
                  </span>
                )}
                {existingCount > 0 && (
                  <span>
                    {importedCount > 0 && ', '}
                    Linked {existingCount} existing {existingCount === 1 ? 'guest' : 'guests'}
                  </span>
                )}
                {failedCount > 0 && (
                  <span className="text-red-600 dark:text-red-400">
                    {' '}({failedCount} failed)
                  </span>
                )}
                {targetEventId && (importedCount > 0 || existingCount > 0) && (
                  <span className="block mt-2 text-[var(--color-text-muted)]">
                    {importedCount + existingCount} {importedCount + existingCount === 1 ? 'guest has' : 'guests have'} been assigned to: <strong className="text-[var(--color-text)]">{events.find(e => e.id === targetEventId)?.name || 'the selected event'}</strong>
                  </span>
                )}
              </p>
            </div>

            {/* Error Details */}
            {importErrors.length > 0 && (
              <div className="bg-red-50 dark:bg-red-900/20 border-2 border-red-500 dark:border-red-400 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-red-800 dark:text-red-200 mb-4">
                  Import Errors ({importErrors.length})
                </h3>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {importErrors.slice(0, 20).map((err, idx) => (
                    <div key={idx} className="bg-white dark:bg-[var(--color-surface)] border border-red-200 dark:border-red-800 rounded p-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="text-sm font-medium text-[var(--color-text)]">
                            Row {err.rowIndex}: {err.email}
                          </p>
                          <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                            {err.error}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                  {importErrors.length > 20 && (
                    <p className="text-sm text-[var(--color-text-muted)] text-center pt-2">
                      ... and {importErrors.length - 20} more errors
                    </p>
                  )}
                </div>
                <div className="mt-4 pt-4 border-t border-red-200 dark:border-red-800">
                  <p className="text-sm text-red-700 dark:text-red-300">
                    <strong>Common causes:</strong> Duplicate email addresses, missing required fields, or invalid data formats.
                  </p>
                </div>
              </div>
            )}

            <div className="flex justify-center gap-4">
              <Button variant="outline" onClick={handleReset}>
                Import Another File
              </Button>
              {targetEventId ? (
                <>
                  <Button onClick={() => {
                    router.push(`/events/${targetEventId}`);
                    router.refresh(); // Refresh the page data
                  }}>
                    View Event
                  </Button>
                  {(importedCount > 0 || existingCount > 0) && (
                    <Button variant="secondary" onClick={() => router.push('/guests')}>
                      View Guests
                    </Button>
                  )}
                </>
              ) : (
                <Button onClick={() => router.push('/guests')}>
                  View Guests
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
