import { ParsedCSVRow } from "./parser";
import { OrderStatus, SubscriptionStatus, Role } from "@prisma/client";

export interface ValidationError {
  row: number;
  field: string;
  message: string;
}

export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
  warnings: ValidationError[];
  validRows: ParsedCSVRow[];
}

/**
 * Normalize headers and rows to handle different naming conventions
 */
function normalizeHeadersAndRows(
  headers: string[],
  rows: ParsedCSVRow[]
): { normalizedHeaders: string[]; normalizedRows: ParsedCSVRow[] } {
  // Helper to convert camelCase to snake_case
  function camelToSnake(str: string): string {
    return str.replace(/([A-Z])/g, "_$1").toLowerCase();
  }

  // Mapping from various column name formats to standard format
  const getNormalizedHeader = (header: string): string => {
    const trimmed = header.trim();
    const lower = trimmed.toLowerCase();
    const camelSnake = camelToSnake(trimmed);

    // Direct mappings (case-insensitive and format variations)
    const mappings: Record<string, string> = {
      // Email variations
      email: "email",
      useremail: "email",
      "user email": "email",
      user_email: "email",
      // Name variations
      name: "name",
      // Role variations
      role: "role",
      // Date variations
      created_at: "created_at",
      createdat: "created_at",
      "created at": "created_at",
      // Order fields
      amount: "amount",
      status: "status",
      // Subscription fields
      plan: "plan",
      start_date: "start_date",
      startdate: "start_date",
      "start date": "start_date",
      end_date: "end_date",
      enddate: "end_date",
      "end date": "end_date",
    };

    // Check direct mappings (lowercase and camelCase-to-snake_case)
    if (mappings[lower]) return mappings[lower];
    if (mappings[camelSnake]) return mappings[camelSnake];

    // Return as-is if no mapping found
    return lower;
  };

  // Normalize headers
  const normalizedHeaders = headers.map(getNormalizedHeader);

  // Normalize rows - map original headers to normalized headers
  const normalizedRows = rows.map((row) => {
    const normalized: ParsedCSVRow = {};
    headers.forEach((originalHeader, index) => {
      const normalizedHeader = normalizedHeaders[index];
      // Try to get value from original header (case-insensitive)
      const originalKey = Object.keys(row).find(
        (key) => key.trim().toLowerCase() === originalHeader.trim().toLowerCase()
      );
      const value = originalKey ? (row[originalKey] || "") : "";
      normalized[normalizedHeader] = value;
    });
    return normalized;
  });

  return { normalizedHeaders, normalizedRows };
}

/**
 * Validate Users CSV
 */
export function validateUsersCSV(
  rows: ParsedCSVRow[],
  headers: string[]
): ValidationResult {
  const errors: ValidationError[] = [];
  const warnings: ValidationError[] = [];
  const validRows: ParsedCSVRow[] = [];

  // Normalize headers and rows
  const { normalizedHeaders, normalizedRows } = normalizeHeadersAndRows(headers, rows);

  const requiredFields = ["email", "name"];
  const missingFields = requiredFields.filter((field) => !normalizedHeaders.includes(field));

  if (missingFields.length > 0) {
    errors.push({
      row: 0,
      field: "headers",
      message: `Missing required columns: ${missingFields.join(", ")}`,
    });
    return { valid: false, errors, warnings, validRows };
  }

  normalizedRows.forEach((row, index) => {
    const rowNum = index + 2; // +2 because row 1 is headers
    let rowValid = true;

    // Validate email
    if (!row.email || !isValidEmail(row.email)) {
      errors.push({
        row: rowNum,
        field: "email",
        message: "Invalid or missing email address",
      });
      rowValid = false;
    }

    // Validate name
    if (!row.name || row.name.trim().length === 0) {
      errors.push({
        row: rowNum,
        field: "name",
        message: "Name is required",
      });
      rowValid = false;
    }

    // Validate role (optional, default to USER)
    if (row.role && !Object.values(Role).includes(row.role as Role)) {
      errors.push({
        row: rowNum,
        field: "role",
        message: `Role must be one of: ${Object.values(Role).join(", ")}`,
      });
      rowValid = false;
    } else if (!row.role) {
      // Set default role if not provided
      row.role = "USER";
    }

    // Validate created_at if provided
    if (row.created_at && row.created_at.trim() !== "" && !isValidDate(row.created_at)) {
      warnings.push({
        row: rowNum,
        field: "created_at",
        message: "Invalid date format, using current date",
      });
    }

    if (rowValid) {
      validRows.push(row);
    }
  });

  return {
    valid: errors.length === 0,
    errors,
    warnings,
    validRows,
  };
}

/**
 * Validate Orders CSV
 */
export function validateOrdersCSV(
  rows: ParsedCSVRow[],
  headers: string[]
): ValidationResult {
  const errors: ValidationError[] = [];
  const warnings: ValidationError[] = [];
  const validRows: ParsedCSVRow[] = [];

  // Normalize headers and rows
  const { normalizedHeaders, normalizedRows } = normalizeHeadersAndRows(headers, rows);

  const requiredFields = ["email", "amount", "status", "created_at"];
  const missingFields = requiredFields.filter((field) => !normalizedHeaders.includes(field));

  if (missingFields.length > 0) {
    errors.push({
      row: 0,
      field: "headers",
      message: `Missing required columns: ${missingFields.join(", ")}`,
    });
    return { valid: false, errors, warnings, validRows };
  }

  normalizedRows.forEach((row, index) => {
    const rowNum = index + 2;
    let rowValid = true;

    // Validate email
    if (!row.email || !isValidEmail(row.email)) {
      errors.push({
        row: rowNum,
        field: "email",
        message: "Invalid or missing email address",
      });
      rowValid = false;
    }

    // Validate amount
    const amount = parseFloat(row.amount);
    if (isNaN(amount) || amount <= 0) {
      errors.push({
        row: rowNum,
        field: "amount",
        message: "Amount must be a positive number",
      });
      rowValid = false;
    }

    // Validate and normalize status
    const statusMap: Record<string, OrderStatus> = {
      PAID: OrderStatus.COMPLETED,
      COMPLETED: OrderStatus.COMPLETED,
      PENDING: OrderStatus.PENDING,
      REFUNDED: OrderStatus.CANCELLED,
      CANCELLED: OrderStatus.CANCELLED,
    };
    
    const statusUpper = (row.status || "").toUpperCase().trim();
    const normalizedStatus = statusMap[statusUpper] || (Object.values(OrderStatus).includes(row.status as OrderStatus) ? (row.status as OrderStatus) : null);
    
    if (!normalizedStatus) {
      errors.push({
        row: rowNum,
        field: "status",
        message: `Status must be one of: PAID, COMPLETED, PENDING, REFUNDED, CANCELLED (mapped to: ${Object.values(OrderStatus).join(", ")})`,
      });
      rowValid = false;
    } else {
      // Update row with normalized status
      row.status = normalizedStatus;
    }

    // Validate created_at
    if (!row.created_at || row.created_at.trim() === "" || !isValidDate(row.created_at)) {
      errors.push({
        row: rowNum,
        field: "created_at",
        message: "Valid created_at date is required (ISO 8601 format)",
      });
      rowValid = false;
    }

    if (rowValid) {
      validRows.push(row);
    }
  });

  return {
    valid: errors.length === 0,
    errors,
    warnings,
    validRows,
  };
}

/**
 * Validate Subscriptions CSV
 */
export function validateSubscriptionsCSV(
  rows: ParsedCSVRow[],
  headers: string[]
): ValidationResult {
  const errors: ValidationError[] = [];
  const warnings: ValidationError[] = [];
  const validRows: ParsedCSVRow[] = [];

  // Normalize headers and rows
  const { normalizedHeaders, normalizedRows } = normalizeHeadersAndRows(headers, rows);

  const requiredFields = ["email", "plan", "status", "start_date"];
  const missingFields = requiredFields.filter((field) => !normalizedHeaders.includes(field));

  if (missingFields.length > 0) {
    errors.push({
      row: 0,
      field: "headers",
      message: `Missing required columns: ${missingFields.join(", ")}`,
    });
    return { valid: false, errors, warnings, validRows };
  }

  normalizedRows.forEach((row, index) => {
    const rowNum = index + 2;
    let rowValid = true;

    // Validate email
    if (!row.email || !isValidEmail(row.email)) {
      errors.push({
        row: rowNum,
        field: "email",
        message: "Invalid or missing email address",
      });
      rowValid = false;
    }

    // Validate plan
    if (!row.plan || row.plan.trim().length === 0) {
      errors.push({
        row: rowNum,
        field: "plan",
        message: "Plan name is required",
      });
      rowValid = false;
    }

    // Validate status
    if (!row.status || !Object.values(SubscriptionStatus).includes(row.status as SubscriptionStatus)) {
      errors.push({
        row: rowNum,
        field: "status",
        message: `Status must be one of: ${Object.values(SubscriptionStatus).join(", ")}`,
      });
      rowValid = false;
    }

    // Validate start_date
    if (!row.start_date || row.start_date.trim() === "" || !isValidDate(row.start_date)) {
      errors.push({
        row: rowNum,
        field: "start_date",
        message: "Valid start_date is required (ISO 8601 format)",
      });
      rowValid = false;
    }

    // Validate end_date if provided
    if (row.end_date && row.end_date.trim() !== "") {
      if (!isValidDate(row.end_date)) {
        warnings.push({
          row: rowNum,
          field: "end_date",
          message: "Invalid end_date format, will be set to null",
        });
      } else {
        // Check if end_date is after start_date
        const startDate = new Date(row.start_date);
        const endDate = new Date(row.end_date);
        if (endDate < startDate) {
          warnings.push({
            row: rowNum,
            field: "end_date",
            message: "end_date is before start_date",
          });
        }
      }
    }

    if (rowValid) {
      validRows.push(row);
    }
  });

  return {
    valid: errors.length === 0,
    errors,
    warnings,
    validRows,
  };
}

/**
 * Helper: Validate email format
 */
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Helper: Validate date format (ISO 8601 or YYYY-MM-DD)
 */
function isValidDate(dateString: string): boolean {
  if (!dateString || dateString.trim() === "") return false;
  const date = new Date(dateString);
  return !isNaN(date.getTime());
}

