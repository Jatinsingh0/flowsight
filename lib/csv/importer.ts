import { prisma } from "../prisma";
import { ParsedCSVRow } from "./parser";
import { OrderStatus, SubscriptionStatus, Role } from "@prisma/client";
import { getOrCreateUserWorkspace, enableRealDataMode } from "../workspace";

export interface ImportResult {
  success: boolean;
  imported: number;
  skipped: number;
  errors: string[];
}

/**
 * Import Users from CSV
 */
export async function importUsers(
  rows: ParsedCSVRow[],
  workspaceId: string
): Promise<ImportResult> {
  const result: ImportResult = {
    success: true,
    imported: 0,
    skipped: 0,
    errors: [],
  };

  const workspace = await prisma.workspace.findUnique({
    where: { id: workspaceId },
  });

  if (!workspace) {
    result.success = false;
    result.errors.push("Workspace not found");
    return result;
  }

  for (const row of rows) {
    try {
      const email = row.email.trim().toLowerCase();
      const name = row.name.trim();
      const role = (row.role || "USER") as Role;
      const createdAt = row.created_at ? new Date(row.created_at) : new Date();

      // Check if user exists in this workspace
      const existingUser = await prisma.user.findFirst({
        where: {
          email,
          workspaceId,
        },
      });

      if (existingUser) {
        // Update existing user
        await prisma.user.update({
          where: { id: existingUser.id },
          data: {
            name,
            role,
            createdAt,
          },
        });
        result.imported++;
      } else {
        // Create new user (password will be set to a default, user should change it)
        // In production, you might want to generate a random password and email it
        const hashedPassword = "$2a$10$defaultpasswordhash"; // Placeholder
        await prisma.user.create({
          data: {
            email,
            name,
            password: hashedPassword,
            role,
            workspaceId,
            createdAt,
          },
        });
        result.imported++;
      }
    } catch (error: any) {
      result.skipped++;
      result.errors.push(`Row ${rows.indexOf(row) + 1}: ${error.message || "Unknown error"}`);
    }
  }

  return result;
}

/**
 * Import Orders from CSV
 */
export async function importOrders(
  rows: ParsedCSVRow[],
  workspaceId: string
): Promise<ImportResult> {
  const result: ImportResult = {
    success: true,
    imported: 0,
    skipped: 0,
    errors: [],
  };

  const workspace = await prisma.workspace.findUnique({
    where: { id: workspaceId },
  });

  if (!workspace) {
    result.success = false;
    result.errors.push("Workspace not found");
    return result;
  }

  for (const row of rows) {
    try {
      const email = row.email.trim().toLowerCase();
      const amount = parseFloat(row.amount);
      const status = row.status as OrderStatus;
      const createdAt = new Date(row.created_at);

      // Find or create user
      let user = await prisma.user.findFirst({
        where: {
          email,
          workspaceId,
        },
      });

      if (!user) {
        // Create user if doesn't exist
        const hashedPassword = "$2a$10$defaultpasswordhash";
        user = await prisma.user.create({
          data: {
            email,
            name: email.split("@")[0], // Use email prefix as name
            password: hashedPassword,
            role: Role.USER,
            workspaceId,
          },
        });
      }

      // Create order
      await prisma.order.create({
        data: {
          userId: user.id,
          workspaceId,
          amount,
          status,
          createdAt,
        },
      });

      result.imported++;
    } catch (error: any) {
      result.skipped++;
      result.errors.push(`Row ${rows.indexOf(row) + 1}: ${error.message || "Unknown error"}`);
    }
  }

  // Enable real data mode after successful import
  if (result.imported > 0) {
    await enableRealDataMode(workspaceId);
  }

  return result;
}

/**
 * Import Subscriptions from CSV
 */
export async function importSubscriptions(
  rows: ParsedCSVRow[],
  workspaceId: string
): Promise<ImportResult> {
  const result: ImportResult = {
    success: true,
    imported: 0,
    skipped: 0,
    errors: [],
  };

  const workspace = await prisma.workspace.findUnique({
    where: { id: workspaceId },
  });

  if (!workspace) {
    result.success = false;
    result.errors.push("Workspace not found");
    return result;
  }

  for (const row of rows) {
    try {
      const email = row.email.trim().toLowerCase();
      const plan = row.plan.trim();
      const status = row.status as SubscriptionStatus;
      const startDate = new Date(row.start_date);
      const endDate = row.end_date && row.end_date.trim() !== "" 
        ? new Date(row.end_date) 
        : null;

      // Find user (must exist)
      const user = await prisma.user.findFirst({
        where: {
          email,
          workspaceId,
        },
      });

      if (!user) {
        result.skipped++;
        result.errors.push(`Row ${rows.indexOf(row) + 1}: User with email ${email} not found. Import users first.`);
        continue;
      }

      // Create subscription
      await prisma.subscription.create({
        data: {
          userId: user.id,
          workspaceId,
          plan,
          status,
          startDate,
          endDate,
        },
      });

      result.imported++;
    } catch (error: any) {
      result.skipped++;
      result.errors.push(`Row ${rows.indexOf(row) + 1}: ${error.message || "Unknown error"}`);
    }
  }

  // Enable real data mode after successful import
  if (result.imported > 0) {
    await enableRealDataMode(workspaceId);
  }

  return result;
}

