'use client';

import React from 'react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import type { ParsedFile } from '@/lib/services/file-parser';

interface HeaderSelectorProps {
  parsedFile: ParsedFile;
  headerRowIndex: number;
  startColumnIndex: number;
  onHeaderRowChange: (index: number) => void;
  onStartColumnChange: (index: number) => void;
  onApply: () => void;
}

export function HeaderSelector({
  parsedFile,
  headerRowIndex,
  startColumnIndex,
  onHeaderRowChange,
  onStartColumnChange,
  onApply,
}: HeaderSelectorProps) {
  const previewRows = parsedFile.allRows.slice(0, Math.min(10, parsedFile.allRows.length));

  return (
    <div className="space-y-4">
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
          Adjust Header Detection
        </h3>
        <p className="text-sm text-blue-700 dark:text-blue-300">
          If the system detected the wrong headers, manually specify which row contains headers and which column data starts from.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
            Header Row (0-based index)
          </label>
          <Input
            type="number"
            min="0"
            max={parsedFile.allRows.length - 1}
            value={headerRowIndex}
            onChange={(e) => onHeaderRowChange(parseInt(e.target.value) || 0)}
          />
          <p className="text-xs text-[var(--color-text-muted)] mt-1">
            Row {headerRowIndex + 1} of {parsedFile.allRows.length}
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
            Starting Column (0-based index)
          </label>
          <Input
            type="number"
            min="0"
            value={startColumnIndex}
            onChange={(e) => onStartColumnChange(parseInt(e.target.value) || 0)}
          />
          <p className="text-xs text-[var(--color-text-muted)] mt-1">
            Column {startColumnIndex + 1}
          </p>
        </div>
      </div>

      {/* Preview Table */}
      <div className="border border-[var(--color-border)] rounded-lg overflow-hidden">
        <div className="bg-[var(--color-background-alt)] px-6 py-3 border-b border-[var(--color-border)]">
          <h3 className="font-semibold text-[var(--color-text)]">Preview (First 10 rows)</h3>
        </div>
        <div className="overflow-x-auto max-h-64 overflow-y-auto">
          <table className="w-full text-xs">
            <thead className="bg-[var(--color-background-alt)] sticky top-0">
              <tr>
                <th className="px-2 py-1 text-left text-[var(--color-text-muted)] w-12">Row</th>
                {parsedFile.allRows[0]?.map((_, colIdx) => (
                  <th
                    key={colIdx}
                    className={`
                      px-2 py-1 text-left text-[var(--color-text-muted)] border-l border-[var(--color-border)]
                      ${colIdx === startColumnIndex ? 'bg-blue-100 dark:bg-blue-900/30' : ''}
                    `}
                  >
                    Col {colIdx + 1}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border)]">
              {previewRows.map((row, rowIdx) => (
                <tr
                  key={rowIdx}
                  className={`
                    ${rowIdx === headerRowIndex ? 'bg-yellow-50 dark:bg-yellow-900/20 font-semibold' : ''}
                    hover:bg-[var(--color-surface-hover)]
                  `}
                >
                  <td className="px-2 py-1 text-[var(--color-text-muted)]">
                    {rowIdx + 1}
                    {rowIdx === headerRowIndex && (
                      <span className="ml-1 text-yellow-600 dark:text-yellow-400">(Header)</span>
                    )}
                  </td>
                  {row.map((cell, colIdx) => (
                    <td
                      key={colIdx}
                      className={`
                        px-2 py-1 text-[var(--color-text)] border-l border-[var(--color-border)]
                        ${colIdx === startColumnIndex ? 'bg-blue-100 dark:bg-blue-900/30' : ''}
                        ${rowIdx === headerRowIndex && colIdx >= startColumnIndex ? 'text-[var(--color-accent)]' : ''}
                      `}
                      title={cell}
                    >
                      {cell.substring(0, 30)}{cell.length > 30 ? '...' : ''}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex justify-end">
        <Button onClick={onApply}>Apply Changes</Button>
      </div>
    </div>
  );
}
