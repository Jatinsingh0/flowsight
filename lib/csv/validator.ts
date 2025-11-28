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
 * Validate Users CSV
 */
export function validateUsersCSV(
  rows: ParsedCSVRow[],
  headers: string[]
): ValidationResult {
  const errors: ValidationError[] = [];
  const warnings: ValidationError[] = [];
  const validRows: ParsedCSVRow[] = [];

  const requiredFields = ["email", "name", "role"];
  const missingFields = requiredFields.filter((field) => !headers.includes(field));

  if (missingFields.length > 0) {
    errors.push({
      row: 0,
      field: "headers",
      message: `Missing required columns: ${missingFields.join(", ")}`,
    });
    return { valid: false, errors, warnings, validRows };
  }

  rows.forEach((row, index) => {
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

    // Validate role
    if (!row.role || !Object.values(Role).includes(row.role as Role)) {
      errors.push({
        row: rowNum,
        field: "role",
        message: `Role must be one of: ${Object.values(Role).join(", ")}`,
      });
      rowValid = false;
    }

    // Validate created_at if provided
    if (row.created_at && !isValidDate(row.created_at)) {
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

  const requiredFields = ["email", "amount", "status", "created_at"];
  const missingFields = requiredFields.filter((field) => !headers.includes(field));

  if (missingFields.length > 0) {
    errors.push({
      row: 0,
      field: "headers",
      message: `Missing required columns: ${missingFields.join(", ")}`,
    });
    return { valid: false, errors, warnings, validRows };
  }

  rows.forEach((row, index) => {
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

    // Validate status
    if (!row.status || !Object.values(OrderStatus).includes(row.status as OrderStatus)) {
      errors.push({
        row: rowNum,
        field: "status",
        message: `Status must be one of: ${Object.values(OrderStatus).join(", ")}`,
      });
      rowValid = false;
    }

    // Validate created_at
    if (!row.created_at || !isValidDate(row.created_at)) {
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

  const requiredFields = ["email", "plan", "status", "start_date"];
  const missingFields = requiredFields.filter((field) => !headers.includes(field));

  if (missingFields.length > 0) {
    errors.push({
      row: 0,
      field: "headers",
      message: `Missing required columns: ${missingFields.join(", ")}`,
    });
    return { valid: false, errors, warnings, validRows };
  }

  rows.forEach((row, index) => {
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
    if (!row.start_date || !isValidDate(row.start_date)) {
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
 * Helper: Validate date format (ISO 8601)
 */
function isValidDate(dateString: string): boolean {
  const date = new Date(dateString);
  return !isNaN(date.getTime());
}

