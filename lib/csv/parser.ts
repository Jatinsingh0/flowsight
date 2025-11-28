/**
 * CSV Parser Utilities
 * Handles parsing and basic validation of CSV files
 */

export interface ParsedCSVRow {
  [key: string]: string;
}

export interface ParsedCSV {
  headers: string[];
  rows: ParsedCSVRow[];
  errors: string[];
}

/**
 * Parse CSV string into structured data
 */
export function parseCSV(csvContent: string): ParsedCSV {
  const errors: string[] = [];
  const lines = csvContent.split("\n").filter((line) => line.trim());

  if (lines.length === 0) {
    errors.push("CSV file is empty");
    return { headers: [], rows: [], errors };
  }

  // Parse headers
  const headers = parseCSVLine(lines[0]);
  if (headers.length === 0) {
    errors.push("CSV file has no headers");
    return { headers: [], rows: [], errors };
  }

  // Parse rows
  const rows: ParsedCSVRow[] = [];
  for (let i = 1; i < lines.length; i++) {
    const values = parseCSVLine(lines[i]);
    if (values.length !== headers.length) {
      errors.push(`Row ${i + 1}: Column count mismatch (expected ${headers.length}, got ${values.length})`);
      continue;
    }

    const row: ParsedCSVRow = {};
    headers.forEach((header, index) => {
      row[header.trim()] = values[index]?.trim() || "";
    });
    rows.push(row);
  }

  return { headers, rows, errors };
}

/**
 * Parse a single CSV line, handling quoted values
 */
function parseCSVLine(line: string): string[] {
  const values: string[] = [];
  let current = "";
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
    } else if (char === "," && !inQuotes) {
      // End of field
      values.push(current);
      current = "";
    } else {
      current += char;
    }
  }

  // Add last field
  values.push(current);

  return values;
}

/**
 * Generate CSV template for a given type
 */
export function generateCSVTemplate(type: "users" | "orders" | "subscriptions"): string {
  switch (type) {
    case "users":
      return `email,name,role,created_at
admin@example.com,John Admin,ADMIN,2024-01-01T00:00:00Z
manager@example.com,Jane Manager,MANAGER,2024-01-05T10:00:00Z
user@example.com,Bob User,USER,2024-01-10T15:30:00Z`;

    case "orders":
      return `email,amount,status,created_at
john@example.com,99.00,COMPLETED,2024-01-15T10:30:00Z
jane@example.com,149.00,COMPLETED,2024-01-16T14:20:00Z
bob@example.com,49.00,PENDING,2024-01-17T09:15:00Z`;

    case "subscriptions":
      return `email,plan,status,start_date,end_date
john@example.com,Pro,ACTIVE,2024-01-01T00:00:00Z,2024-12-31T23:59:59Z
jane@example.com,Basic,ACTIVE,2024-01-15T00:00:00Z,
bob@example.com,Enterprise,CANCELLED,2024-01-10T00:00:00Z,2024-02-10T00:00:00Z`;

    default:
      return "";
  }
}

