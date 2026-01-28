// Data validation service for imported guest data

export interface ValidationError {
  row: number;
  field: string;
  message: string;
}

export interface ValidatedRow {
  rowIndex: number;
  data: Record<string, string>;
  errors: ValidationError[];
  valid: boolean;
}

export interface ValidationResult {
  validRows: ValidatedRow[];
  invalidRows: ValidatedRow[];
  totalErrors: number;
}

export class DataValidator {
  /**
   * Validate imported guest data
   */
  static validate(
    rows: string[][],
    columnMapping: Array<{ csvColumn: string; guestField: string | null; enabled?: boolean }>
  ): ValidationResult {
    // Filter to only enabled mappings
    const enabledMappings = columnMapping.filter(m => m.enabled !== false);
    const validRows: ValidatedRow[] = [];
    const invalidRows: ValidatedRow[] = [];
    let totalErrors = 0;

    rows.forEach((row, rowIndex) => {
      const mappedData: Record<string, string> = {};
      const errors: ValidationError[] = [];

      // Map CSV columns to guest fields (only enabled columns)
      enabledMappings.forEach((mapping, mappingIndex) => {
        // Find the actual column index in the original CSV
        const originalColumnIndex = columnMapping.findIndex(m => m.csvColumn === mapping.csvColumn);
        if (originalColumnIndex >= 0 && mapping.guestField && mapping.guestField !== 'ignore') {
          mappedData[mapping.guestField] = row[originalColumnIndex]?.trim() || '';
        }
      });

      // Handle full_name field - split into first_name and last_name
      if (mappedData.full_name && !mappedData.first_name && !mappedData.last_name) {
        const nameParts = this.splitFullName(mappedData.full_name);
        mappedData.first_name = nameParts.firstName;
        mappedData.last_name = nameParts.lastName;
      }

      // Validate required fields
      // Accept either (first_name + last_name) OR full_name
      const hasFirstName = mappedData.first_name?.trim();
      const hasLastName = mappedData.last_name?.trim();
      const hasFullName = mappedData.full_name?.trim();

      if (!hasFirstName && !hasFullName) {
        errors.push({
          row: rowIndex + 2, // +2 because row 0 is header, and we're 0-indexed
          field: 'first_name',
          message: 'First name or full name is required',
        });
      }

      if (!hasLastName && !hasFullName) {
        errors.push({
          row: rowIndex + 2,
          field: 'last_name',
          message: 'Last name or full name is required',
        });
      }

      if (!mappedData.email?.trim()) {
        errors.push({
          row: rowIndex + 2,
          field: 'email',
          message: 'Email is required',
        });
      } else if (!this.isValidEmail(mappedData.email)) {
        errors.push({
          row: rowIndex + 2,
          field: 'email',
          message: 'Invalid email format',
        });
      }

      // Validate phone format if provided
      if (mappedData.phone && !this.isValidPhone(mappedData.phone)) {
        errors.push({
          row: rowIndex + 2,
          field: 'phone',
          message: 'Invalid phone format',
        });
      }

      const validatedRow: ValidatedRow = {
        rowIndex: rowIndex + 2,
        data: mappedData,
        errors,
        valid: errors.length === 0,
      };

      if (errors.length === 0) {
        validRows.push(validatedRow);
      } else {
        invalidRows.push(validatedRow);
        totalErrors += errors.length;
      }
    });

    return {
      validRows,
      invalidRows,
      totalErrors,
    };
  }

  /**
   * Validate email format
   */
  private static isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Validate phone format (basic validation)
   */
  private static isValidPhone(phone: string): boolean {
    // Remove common phone formatting characters
    const cleaned = phone.replace(/[\s\-\(\)\+]/g, '');
    // Check if it's all digits and has reasonable length
    return /^\d{7,15}$/.test(cleaned);
  }

  /**
   * Split full name into first and last name
   */
  private static splitFullName(fullName: string): { firstName: string; lastName: string } {
    const trimmed = fullName.trim();
    const parts = trimmed.split(/\s+/).filter(p => p.length > 0);

    if (parts.length === 0) {
      return { firstName: '', lastName: '' };
    } else if (parts.length === 1) {
      return { firstName: parts[0], lastName: '' };
    } else {
      // Take first part as first name, rest as last name
      const firstName = parts[0];
      const lastName = parts.slice(1).join(' ');
      return { firstName, lastName };
    }
  }

  /**
   * Normalize data (trim, lowercase email, handle full_name splitting, etc.)
   */
  static normalize(data: Record<string, string>): Record<string, string> {
    const normalized: Record<string, string> = {};

    // Handle full_name first - split it if present
    if (data.full_name && !data.first_name && !data.last_name) {
      const nameParts = this.splitFullName(data.full_name);
      normalized.first_name = nameParts.firstName;
      normalized.last_name = nameParts.lastName;
    } else {
      normalized.first_name = data.first_name?.trim() || '';
      normalized.last_name = data.last_name?.trim() || '';
    }

    // Normalize other fields
    Object.entries(data).forEach(([key, value]) => {
      if (key === 'email') {
        normalized[key] = value.trim().toLowerCase();
      } else if (key !== 'full_name' && key !== 'first_name' && key !== 'last_name') {
        normalized[key] = value.trim();
      }
    });

    return normalized;
  }
}
