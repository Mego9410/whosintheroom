// Intelligent column matching service

export interface ColumnMapping {
  csvColumn: string;
  guestField: string | null;
  required: boolean;
  enabled: boolean; // Whether this column is included in import
}

export type GuestField = 
  | 'first_name'
  | 'last_name'
  | 'full_name'
  | 'email'
  | 'company'
  | 'job_title'
  | 'phone'
  | 'address'
  | 'notes'
  | 'ignore';

const FIELD_PATTERNS: Record<GuestField, string[]> = {
  first_name: ['first name', 'firstname', 'fname', 'given name', 'forename'],
  last_name: ['last name', 'lastname', 'lname', 'surname', 'family name'],
  full_name: ['full name', 'fullname', 'name', 'attendee name', 'guest name', 'person name'],
  email: ['email', 'e-mail', 'email address', 'e mail', 'mail'],
  company: ['company', 'organization', 'org', 'employer', 'business', 'firm'],
  job_title: ['job title', 'jobtitle', 'title', 'position', 'role', 'occupation'],
  phone: ['phone', 'telephone', 'tel', 'mobile', 'cell', 'contact number'],
  address: ['address', 'street', 'location', 'city', 'state', 'zip', 'postal'],
  notes: ['notes', 'note', 'comments', 'comment', 'remarks', 'remarks'],
  ignore: [],
};

export class ColumnMatcher {
  /**
   * Auto-match CSV columns to guest fields using header names AND data analysis
   */
  static autoMatch(headers: string[], sampleRows: string[][] = []): ColumnMapping[] {
    // First, try matching by header names
    const headerMatches = headers.map((header, index) => {
      const matchedField = this.matchColumn(header);
      return {
        csvColumn: header,
        guestField: matchedField,
        required: matchedField === 'first_name' || matchedField === 'last_name' || matchedField === 'full_name' || matchedField === 'email',
        enabled: true,
        columnIndex: index,
      };
    });

    // Then, analyze data values to improve matching
    if (sampleRows.length > 0) {
      return this.analyzeDataValues(headerMatches, sampleRows);
    }

    return headerMatches.map(({ columnIndex, ...rest }) => rest);
  }

  /**
   * Analyze actual data values to detect email and name columns
   */
  private static analyzeDataValues(
    headerMatches: Array<ColumnMapping & { columnIndex: number }>,
    sampleRows: string[][]
  ): ColumnMapping[] {
    const columnScores: Record<number, { email: number; firstName: number; lastName: number; fullName: number }> = {};

    // Analyze first 10 rows for patterns
    const rowsToAnalyze = sampleRows.slice(0, Math.min(10, sampleRows.length));

    rowsToAnalyze.forEach(row => {
      headerMatches.forEach(({ columnIndex }) => {
        const value = row[columnIndex]?.trim() || '';
        
        if (!columnScores[columnIndex]) {
          columnScores[columnIndex] = { email: 0, firstName: 0, lastName: 0, fullName: 0 };
        }

        // Check for email pattern
        if (this.isEmailPattern(value)) {
          columnScores[columnIndex].email++;
        }

        // Check for name patterns
        if (this.isFirstNamePattern(value)) {
          columnScores[columnIndex].firstName++;
        }

        if (this.isLastNamePattern(value)) {
          columnScores[columnIndex].lastName++;
        }

        // Check for full name pattern (multiple words, starts with capital)
        if (this.isFullNamePattern(value)) {
          columnScores[columnIndex].fullName++;
        }
      });
    });

    // Update matches based on data analysis
    return headerMatches.map(({ columnIndex, guestField, ...rest }) => {
      const scores = columnScores[columnIndex];
      let bestMatch = guestField;

      if (scores) {
        // If header didn't match but data strongly suggests email
        if (!guestField && scores.email >= rowsToAnalyze.length * 0.7) {
          bestMatch = 'email';
        }
        // If header didn't match but data suggests full name
        else if (!guestField && scores.fullName >= rowsToAnalyze.length * 0.6) {
          bestMatch = 'full_name';
        }
        // If header didn't match but data suggests first name
        else if (!guestField && scores.firstName >= rowsToAnalyze.length * 0.5) {
          bestMatch = 'first_name';
        }
        // If header didn't match but data suggests last name
        else if (!guestField && scores.lastName >= rowsToAnalyze.length * 0.5) {
          bestMatch = 'last_name';
        }
        // If header matched but data contradicts, trust the data
        else if (guestField === 'email' && scores.email < rowsToAnalyze.length * 0.3) {
          bestMatch = null; // Header said email but data doesn't look like emails
        }
      }

      return {
        ...rest,
        guestField: bestMatch,
        required: bestMatch === 'first_name' || bestMatch === 'last_name' || bestMatch === 'full_name' || bestMatch === 'email',
      };
    });
  }

  /**
   * Check if value matches email pattern
   */
  private static isEmailPattern(value: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value);
  }

  /**
   * Check if value looks like a first name
   */
  private static isFirstNamePattern(value: string): boolean {
    // First names are typically:
    // - 2-20 characters
    // - Start with capital letter
    // - Mostly letters
    // - Not numbers or special chars (except hyphens/apostrophes)
    if (value.length < 2 || value.length > 20) return false;
    if (!/^[A-Z]/.test(value)) return false;
    if (/^\d+$/.test(value)) return false; // Not all numbers
    if (/@/.test(value)) return false; // Not an email
    if (value.split(/\s+/).length > 1) return false; // Not multiple words
    
    // Check if it's mostly letters
    const letterCount = (value.match(/[a-zA-Z]/g) || []).length;
    return letterCount / value.length > 0.7;
  }

  /**
   * Check if value looks like a last name
   */
  private static isLastNamePattern(value: string): boolean {
    // Similar to first name but can be longer
    if (value.length < 2 || value.length > 30) return false;
    if (!/^[A-Z]/.test(value)) return false;
    if (/^\d+$/.test(value)) return false;
    if (/@/.test(value)) return false;
    if (value.split(/\s+/).length > 2) return false; // Not multiple words
    
    const letterCount = (value.match(/[a-zA-Z]/g) || []).length;
    return letterCount / value.length > 0.7;
  }

  /**
   * Check if value looks like a full name (multiple words)
   */
  private static isFullNamePattern(value: string): boolean {
    // Full names typically:
    // - Have 2+ words
    // - Start with capital letter
    // - Don't contain @ (not email)
    // - Don't start with numbers
    // - Mostly letters
    
    if (value.length < 3) return false;
    if (/@/.test(value)) return false; // Not an email
    if (/^\d+/.test(value)) return false; // Doesn't start with numbers
    
    const words = value.split(/\s+/).filter(w => w.length > 0);
    if (words.length < 2) return false; // Must have at least 2 words
    
    // Check if first word starts with capital
    if (!/^[A-Z]/.test(words[0])) return false;
    
    // Check if mostly letters
    const letterCount = (value.match(/[a-zA-Z]/g) || []).length;
    return letterCount / value.length > 0.7;
  }

  /**
   * Match a single column name to a guest field
   */
  static matchColumn(columnName: string): GuestField | null {
    const normalized = columnName.toLowerCase().trim().replace(/[^a-z0-9\s]/g, '');
    
    // Exact match first
    for (const [field, patterns] of Object.entries(FIELD_PATTERNS)) {
      if (field === 'ignore') continue;
      
      for (const pattern of patterns) {
        if (normalized === pattern || normalized.includes(pattern)) {
          return field as GuestField;
        }
      }
    }

    // Fuzzy match using Levenshtein distance
    let bestMatch: GuestField | null = null;
    let bestScore = Infinity;
    const threshold = 3; // Maximum edit distance

    for (const [field, patterns] of Object.entries(FIELD_PATTERNS)) {
      if (field === 'ignore') continue;
      
      for (const pattern of patterns) {
        const distance = this.levenshteinDistance(normalized, pattern);
        if (distance < bestScore && distance <= threshold) {
          bestScore = distance;
          bestMatch = field as GuestField;
        }
      }
    }

    return bestMatch;
  }

  /**
   * Calculate Levenshtein distance between two strings
   */
  private static levenshteinDistance(str1: string, str2: string): number {
    const matrix: number[][] = [];

    for (let i = 0; i <= str2.length; i++) {
      matrix[i] = [i];
    }

    for (let j = 0; j <= str1.length; j++) {
      matrix[0][j] = j;
    }

    for (let i = 1; i <= str2.length; i++) {
      for (let j = 1; j <= str1.length; j++) {
        if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j] + 1
          );
        }
      }
    }

    return matrix[str2.length][str1.length];
  }

  /**
   * Get available guest fields for mapping
   */
  static getAvailableFields(): Array<{ value: GuestField; label: string }> {
    return [
      { value: 'ignore', label: 'Ignore' },
      { value: 'full_name', label: 'Full Name' },
      { value: 'first_name', label: 'First Name' },
      { value: 'last_name', label: 'Last Name' },
      { value: 'email', label: 'Email' },
      { value: 'company', label: 'Company' },
      { value: 'job_title', label: 'Job Title' },
      { value: 'phone', label: 'Phone' },
      { value: 'address', label: 'Address' },
      { value: 'notes', label: 'Notes' },
    ];
  }
}
