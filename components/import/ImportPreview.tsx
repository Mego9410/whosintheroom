'use client';

import React, { useState, useMemo } from 'react';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import type { ValidatedRow } from '@/lib/services/data-validator';

interface ImportPreviewProps {
  validRows: ValidatedRow[];
  invalidRows: ValidatedRow[];
  totalRows: number;
  onRowsChange?: (selectedRows: ValidatedRow[]) => void;
}

export function ImportPreview({ validRows, invalidRows, totalRows, onRowsChange }: ImportPreviewProps) {
  const [selectedRowIndices, setSelectedRowIndices] = useState<Set<number>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const [showOnlyValid, setShowOnlyValid] = useState(true);

  // Filter rows based on search
  const filteredValidRows = useMemo(() => {
    if (!searchQuery.trim()) return validRows;
    const query = searchQuery.toLowerCase();
    return validRows.filter(row =>
      row.data.first_name?.toLowerCase().includes(query) ||
      row.data.last_name?.toLowerCase().includes(query) ||
      row.data.email?.toLowerCase().includes(query) ||
      row.data.company?.toLowerCase().includes(query)
    );
  }, [validRows, searchQuery]);

  const filteredInvalidRows = useMemo(() => {
    if (!searchQuery.trim()) return invalidRows;
    const query = searchQuery.toLowerCase();
    return invalidRows.filter(row =>
      row.data.first_name?.toLowerCase().includes(query) ||
      row.data.last_name?.toLowerCase().includes(query) ||
      row.data.email?.toLowerCase().includes(query) ||
      row.data.company?.toLowerCase().includes(query)
    );
  }, [invalidRows, searchQuery]);

  const displayRows = showOnlyValid ? filteredValidRows : [...filteredValidRows, ...filteredInvalidRows];
  const previewRows = displayRows.slice(0, 20);

  const handleRowToggle = (row: ValidatedRow) => {
    const rowIndexInValid = filteredValidRows.findIndex(r => r.rowIndex === row.rowIndex);
    if (rowIndexInValid === -1) return; // Row not in valid rows
    
    const newSelected = new Set(selectedRowIndices);
    if (newSelected.has(rowIndexInValid)) {
      newSelected.delete(rowIndexInValid);
    } else {
      newSelected.add(rowIndexInValid);
    }
    setSelectedRowIndices(newSelected);

    // Notify parent of selected rows
    if (onRowsChange) {
      const selectedRows = filteredValidRows.filter((_, idx) => newSelected.has(idx));
      onRowsChange(selectedRows);
    }
  };

  const handleSelectAll = () => {
    if (selectedRowIndices.size === filteredValidRows.length && filteredValidRows.length > 0) {
      setSelectedRowIndices(new Set());
      if (onRowsChange) onRowsChange([]);
    } else {
      const allIndices = new Set(filteredValidRows.map((_, idx) => idx));
      setSelectedRowIndices(allIndices);
      if (onRowsChange) onRowsChange(filteredValidRows);
    }
  };

  return (
    <div className="space-y-4">
      {/* Summary */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white dark:bg-[var(--color-surface)] border-2 border-green-500 dark:border-green-400 rounded-lg p-4 shadow-sm">
          <div className="text-2xl font-bold text-green-600 dark:text-green-400">
            {validRows.length}
          </div>
          <div className="text-sm font-semibold text-[var(--color-text)] dark:text-[var(--color-text)] mt-1">Valid Rows</div>
        </div>
        <div className="bg-white dark:bg-[var(--color-surface)] border-2 border-red-500 dark:border-red-400 rounded-lg p-4 shadow-sm">
          <div className="text-2xl font-bold text-red-600 dark:text-red-400">
            {invalidRows.length}
          </div>
          <div className="text-sm font-semibold text-[var(--color-text)] dark:text-[var(--color-text)] mt-1">Invalid Rows</div>
        </div>
        <div className="bg-white dark:bg-[var(--color-surface)] border-2 border-blue-500 dark:border-blue-400 rounded-lg p-4 shadow-sm">
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            {totalRows}
          </div>
          <div className="text-sm font-semibold text-[var(--color-text)] dark:text-[var(--color-text)] mt-1">Total Rows</div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex items-center gap-4">
        <div className="flex-1">
          <Input
            placeholder="Search rows..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <label className="flex items-center gap-2 text-sm text-[var(--color-text-muted)]">
          <input
            type="checkbox"
            checked={showOnlyValid}
            onChange={(e) => setShowOnlyValid(e.target.checked)}
            className="w-4 h-4 text-[var(--color-accent)] rounded"
          />
          Show only valid rows
        </label>
      </div>

      {/* Preview Table */}
      <div className="border border-[var(--color-border)] rounded-lg overflow-hidden">
        <div className="bg-[var(--color-background-alt)] px-6 py-3 border-b border-[var(--color-border)] flex items-center justify-between">
          <h3 className="font-semibold text-[var(--color-text)]">
            Preview ({displayRows.length} {displayRows.length === 1 ? 'row' : 'rows'})
          </h3>
          {filteredValidRows.length > 0 && (
            <button
              onClick={handleSelectAll}
              className="text-sm text-[var(--color-accent)] hover:underline"
            >
              {selectedRowIndices.size === filteredValidRows.length ? 'Deselect All' : 'Select All Valid'}
            </button>
          )}
        </div>
        <div className="overflow-x-auto max-h-96 overflow-y-auto">
          <table className="w-full">
            <thead className="bg-[var(--color-background-alt)] sticky top-0">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-[var(--color-text-muted)] w-12">
                  <input
                    type="checkbox"
                    checked={selectedRowIndices.size === filteredValidRows.length && filteredValidRows.length > 0}
                    onChange={handleSelectAll}
                    className="w-4 h-4 text-[var(--color-accent)] rounded"
                  />
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-[var(--color-text-muted)]">Row</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-[var(--color-text-muted)]">First Name</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-[var(--color-text-muted)]">Last Name</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-[var(--color-text-muted)]">Email</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-[var(--color-text-muted)]">Company</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-[var(--color-text-muted)]">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border)]">
              {previewRows.map((row, idx) => {
                const rowIndexInValid = filteredValidRows.findIndex(r => r.rowIndex === row.rowIndex);
                const isSelected = rowIndexInValid >= 0 && selectedRowIndices.has(rowIndexInValid);
                const isRowValid = row.valid;
                
                return (
                  <tr
                    key={row.rowIndex}
                    className={`
                      ${isRowValid ? '' : 'bg-red-50 dark:bg-red-900/10'}
                      ${isSelected ? 'bg-[var(--color-accent)]/10' : ''}
                      hover:bg-[var(--color-surface-hover)]
                    `}
                  >
                    <td className="px-4 py-2">
                      {isRowValid && (
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleRowToggle(row)}
                          className="w-4 h-4 text-[var(--color-accent)] rounded"
                        />
                      )}
                    </td>
                    <td className="px-4 py-2 text-sm text-[var(--color-text-muted)]">
                      {row.rowIndex}
                    </td>
                    <td className="px-4 py-2 text-sm text-[var(--color-text)]">
                      {row.data.first_name || '-'}
                    </td>
                    <td className="px-4 py-2 text-sm text-[var(--color-text)]">
                      {row.data.last_name || '-'}
                    </td>
                    <td className="px-4 py-2 text-sm text-[var(--color-text)]">
                      {row.data.email || '-'}
                    </td>
                    <td className="px-4 py-2 text-sm text-[var(--color-text)]">
                      {row.data.company || '-'}
                    </td>
                    <td className="px-4 py-2">
                      {isRowValid ? (
                        <Badge variant="success">Valid</Badge>
                      ) : (
                        <Badge variant="danger">
                          {row.errors.length} {row.errors.length === 1 ? 'error' : 'errors'}
                        </Badge>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {previewRows.length === 0 && (
          <div className="text-center py-8 text-[var(--color-text-muted)]">
            No rows match your search criteria
          </div>
        )}
      </div>

      {/* Selection Summary */}
      {selectedRowIndices.size > 0 && (
        <div className="bg-white dark:bg-[var(--color-surface)] border-2 border-blue-500 dark:border-blue-400 rounded-lg p-4 shadow-sm">
          <p className="text-sm text-[var(--color-text)] dark:text-[var(--color-text)] font-medium">
            {selectedRowIndices.size} {selectedRowIndices.size === 1 ? 'row' : 'rows'} selected for import
          </p>
        </div>
      )}

      {/* Error Details */}
      {invalidRows.length > 0 && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <h4 className="font-semibold text-red-600 dark:text-red-400 mb-2">Errors Found:</h4>
          <div className="space-y-1 max-h-40 overflow-y-auto">
            {invalidRows.slice(0, 10).map((row) =>
              row.errors.map((error, idx) => (
                <p key={idx} className="text-sm text-red-600 dark:text-red-400">
                  Row {error.row}: {error.message}
                </p>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
