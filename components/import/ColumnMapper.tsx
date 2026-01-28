'use client';

import React from 'react';
import { Select } from '@/components/ui/Select';
import { ColumnMatcher } from '@/lib/services/column-matcher';
import { Button } from '@/components/ui/Button';
import type { ColumnMapping } from '@/lib/services/column-matcher';

interface ColumnMapperProps {
  headers: string[];
  mappings: ColumnMapping[];
  sampleRows: string[][];
  onMappingChange: (mappings: ColumnMapping[]) => void;
}

export function ColumnMapper({ headers, mappings, sampleRows, onMappingChange }: ColumnMapperProps) {
  const availableFields = ColumnMatcher.getAvailableFields();

  const handleFieldChange = (csvColumn: string, guestField: string) => {
    const newMappings = mappings.map(mapping => {
      if (mapping.csvColumn === csvColumn) {
        return {
          ...mapping,
          guestField: guestField === 'ignore' ? null : guestField,
          required: guestField === 'first_name' || guestField === 'last_name' || guestField === 'email',
        };
      }
      return mapping;
    });
    onMappingChange(newMappings);
  };

  const handleToggleColumn = (csvColumn: string) => {
    const newMappings = mappings.map(mapping => {
      if (mapping.csvColumn === csvColumn) {
        return {
          ...mapping,
          enabled: !mapping.enabled,
        };
      }
      return mapping;
    });
    onMappingChange(newMappings);
  };

  const handleRematch = () => {
    const rematched = ColumnMatcher.autoMatch(headers, sampleRows);
    onMappingChange(rematched);
  };

  const enabledCount = mappings.filter(m => m.enabled).length;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-[var(--color-text)]">Map Columns</h3>
          <p className="text-sm text-[var(--color-text-muted)] mt-1">
            Match your CSV columns to guest fields. Required fields are marked with *
            {enabledCount < mappings.length && (
              <span className="block mt-1">
                {mappings.length - enabledCount} column(s) disabled
              </span>
            )}
          </p>
        </div>
        <Button variant="secondary" size="sm" onClick={handleRematch}>
          Auto-Match Again
        </Button>
      </div>

      <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg overflow-hidden">
        <div className="divide-y divide-[var(--color-border)]">
          {mappings.map((mapping, index) => (
            <div 
              key={index} 
              className={`
                p-4 transition-colors
                ${!mapping.enabled ? 'opacity-50 bg-[var(--color-background-alt)]' : 'hover:bg-[var(--color-surface-hover)]'}
              `}
            >
              <div className="flex items-start gap-4">
                {/* Enable/Disable Checkbox */}
                <div className="pt-2">
                  <input
                    type="checkbox"
                    checked={mapping.enabled}
                    onChange={() => handleToggleColumn(mapping.csvColumn)}
                    className="w-4 h-4 text-[var(--color-accent)] rounded focus:ring-[var(--color-accent)]"
                  />
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <label className="block text-sm font-medium text-[var(--color-text)]">
                      CSV Column {index + 1}: <span className="font-mono text-[var(--color-text-muted)]">{mapping.csvColumn}</span>
                    </label>
                    {mapping.required && mapping.enabled && (
                      <span className="text-red-500 text-xs">*</span>
                    )}
                    {!mapping.enabled && (
                      <span className="text-xs text-[var(--color-text-muted)] bg-[var(--color-background-alt)] px-2 py-0.5 rounded">
                        Disabled
                      </span>
                    )}
                  </div>
                  
                  {/* Show sample data */}
                  {sampleRows.length > 0 && sampleRows[0][index] && (
                    <p className="text-xs text-[var(--color-text-light)] mb-2 font-mono">
                      Sample: "{sampleRows[0][index].substring(0, 50)}{sampleRows[0][index].length > 50 ? '...' : ''}"
                    </p>
                  )}

                  <Select
                    value={mapping.guestField || 'ignore'}
                    onChange={(e) => handleFieldChange(mapping.csvColumn, e.target.value)}
                    options={availableFields}
                    className="w-full"
                    disabled={!mapping.enabled}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
