// File parsing service for CSV and Excel files

export interface ParsedFile {
  headers: string[];
  rows: string[][];
  totalRows: number;
  allRows: string[][]; // All rows including header row(s) for preview
  headerRowIndex?: number; // Which row contains headers
  startColumnIndex?: number; // Which column data starts from
}

export interface ParseOptions {
  delimiter?: string;
  encoding?: string;
  headerRowIndex?: number; // 0-based index of header row
  startColumnIndex?: number; // 0-based index of starting column
}

export class FileParser {
  /**
   * Parse CSV file content with flexible header detection
   */
  static parseCSV(content: string, options: ParseOptions = {}): ParsedFile {
    const delimiter = options.delimiter || this.detectDelimiter(content);
    const lines = content.split(/\r?\n/).filter(line => line.trim());
    
    if (lines.length === 0) {
      return { headers: [], rows: [], totalRows: 0, allRows: [] };
    }

    // Parse all lines first
    const allRows = lines.map(line => this.parseCSVLine(line, delimiter));
    
    // Determine header row (default to 0, or use provided index)
    const headerRowIndex = options.headerRowIndex !== undefined 
      ? options.headerRowIndex 
      : this.detectHeaderRow(allRows);
    
    // Determine starting column (default to 0, or use provided index)
    const startColumnIndex = options.startColumnIndex !== undefined 
      ? options.startColumnIndex 
      : this.detectStartColumn(allRows[headerRowIndex] || []);

    // Extract headers from the detected header row, starting from startColumnIndex
    const rawHeaders = allRows[headerRowIndex] || [];
    const headers = rawHeaders.slice(startColumnIndex);

    // Extract data rows (skip header row and any rows before it)
    const rows: string[][] = [];
    for (let i = headerRowIndex + 1; i < allRows.length; i++) {
      const row = allRows[i];
      if (row.length > startColumnIndex) {
        // Extract columns starting from startColumnIndex
        const dataRow = row.slice(startColumnIndex);
        if (dataRow.some(cell => cell.trim())) { // Only add non-empty rows
          rows.push(dataRow);
        }
      }
    }

    return {
      headers,
      rows,
      totalRows: rows.length,
      allRows,
      headerRowIndex,
      startColumnIndex,
    };
  }

  /**
   * Detect which row contains headers by analyzing patterns
   */
  private static detectHeaderRow(allRows: string[][]): number {
    if (allRows.length === 0) return 0;

    // Check first 10 rows for header-like patterns
    const rowsToCheck = Math.min(10, allRows.length);
    let bestScore = 0;
    let bestRow = 0;

    for (let i = 0; i < rowsToCheck; i++) {
      const row = allRows[i];
      let score = 0;

      // Headers typically:
      // - Have text values (not dates/timestamps)
      // - Don't contain email addresses
      // - Don't contain phone numbers
      // - Are shorter/more consistent in length
      // - Contain common field names

      const hasEmails = row.some(cell => /@/.test(cell));
      const hasDates = row.some(cell => /\d{4}-\d{2}-\d{2}/.test(cell) || /\d{2}\/\d{2}\/\d{4}/.test(cell));
      const hasTimestamps = row.some(cell => /\d{4}-\d{2}-\d{2}\s+\d{2}:\d{2}:\d{2}/.test(cell));
      const hasPhoneNumbers = row.some(cell => /\d{3}[-.\s]?\d{3}[-.\s]?\d{4}/.test(cell));
      
      // Penalize rows with data-like patterns
      if (hasEmails || hasPhoneNumbers) score -= 10;
      if (hasTimestamps) score -= 5;
      if (hasDates && !hasTimestamps) score -= 2;

      // Reward rows with header-like patterns
      const lowerRow = row.map(c => c.toLowerCase());
      const commonHeaders = ['name', 'email', 'first', 'last', 'company', 'phone', 'title', 'address'];
      commonHeaders.forEach(header => {
        if (lowerRow.some(cell => cell.includes(header))) score += 2;
      });

      // Reward consistent non-empty cells
      const nonEmptyCount = row.filter(c => c.trim()).length;
      if (nonEmptyCount > 2 && nonEmptyCount === row.length) score += 1;

      if (score > bestScore) {
        bestScore = score;
        bestRow = i;
      }
    }

    return bestRow;
  }

  /**
   * Detect which column data starts from
   */
  private static detectStartColumn(headerRow: string[]): number {
    if (headerRow.length === 0) return 0;

    // Find first column that looks like a header (not empty, not a timestamp/date)
    for (let i = 0; i < headerRow.length; i++) {
      const cell = headerRow[i].trim();
      if (!cell) continue; // Skip empty columns
      
      // Skip columns that look like timestamps or dates
      if (/\d{4}-\d{2}-\d{2}\s+\d{2}:\d{2}:\d{2}/.test(cell)) continue;
      if (/^\d{4}-\d{2}-\d{2}$/.test(cell)) continue;
      
      // If it looks like a header (contains letters), start here
      if (/[a-zA-Z]/.test(cell)) {
        return i;
      }
    }

    return 0;
  }

  /**
   * Parse CSV line handling quoted fields
   */
  private static parseCSVLine(line: string, delimiter: string): string[] {
    const result: string[] = [];
    let current = '';
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      const nextChar = line[i + 1];

      if (char === '"') {
        if (inQuotes && nextChar === '"') {
          // Escaped quote
          current += '"';
          i++; // Skip next quote
        } else {
          // Toggle quote state
          inQuotes = !inQuotes;
        }
      } else if (char === delimiter && !inQuotes) {
        result.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }

    // Add last field
    result.push(current.trim());

    return result;
  }

  /**
   * Detect CSV delimiter (comma, tab, semicolon)
   */
  static detectDelimiter(content: string): string {
    const firstLine = content.split(/\r?\n/)[0];
    const delimiters = [',', '\t', ';'];
    let maxCount = 0;
    let detectedDelimiter = ',';

    for (const delim of delimiters) {
      const count = (firstLine.match(new RegExp(`\\${delim}`, 'g')) || []).length;
      if (count > maxCount) {
        maxCount = count;
        detectedDelimiter = delim;
      }
    }

    return detectedDelimiter;
  }

  /**
   * Parse file from File object
   */
  static async parseFile(file: File): Promise<ParsedFile> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (e) => {
        try {
          const content = e.target?.result as string;
          
          if (file.name.endsWith('.csv') || file.name.endsWith('.tsv')) {
            const parsed = this.parseCSV(content);
            resolve(parsed);
          } else {
            reject(new Error('Unsupported file type. Please upload a CSV or TSV file.'));
          }
        } catch (error) {
          reject(error);
        }
      };

      reader.onerror = () => {
        reject(new Error('Failed to read file'));
      };

      reader.readAsText(file, 'UTF-8');
    });
  }

  /**
   * Validate file before parsing
   */
  static validateFile(file: File): { valid: boolean; error?: string } {
    const maxSize = 10 * 1024 * 1024; // 10MB
    const allowedTypes = [
      'text/csv',
      'text/plain',
      'application/vnd.ms-excel',
      'application/csv',
    ];
    const allowedExtensions = ['.csv', '.tsv'];

    // Check file size
    if (file.size > maxSize) {
      return { valid: false, error: 'File size exceeds 10MB limit' };
    }

    // Check extension
    const hasValidExtension = allowedExtensions.some(ext => 
      file.name.toLowerCase().endsWith(ext)
    );

    if (!hasValidExtension && !allowedTypes.includes(file.type)) {
      return { 
        valid: false, 
        error: 'Invalid file type. Please upload a CSV or TSV file.' 
      };
    }

    return { valid: true };
  }
}
