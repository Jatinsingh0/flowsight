import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { getCurrentUserWorkspace } from "@/lib/workspace";
import { parseCSV } from "@/lib/csv/parser";
import {
  validateUsersCSV,
  validateOrdersCSV,
  validateSubscriptionsCSV,
} from "@/lib/csv/validator";
import {
  importUsers,
  importOrders,
  importSubscriptions,
} from "@/lib/csv/importer";

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("file") as File;
    const type = formData.get("type") as "users" | "orders" | "subscriptions";

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (!type || !["users", "orders", "subscriptions"].includes(type)) {
      return NextResponse.json({ error: "Invalid import type" }, { status: 400 });
    }

    // Get user's workspace
    const workspace = await getCurrentUserWorkspace(user.userId);
    if (!workspace) {
      return NextResponse.json({ error: "Workspace not found" }, { status: 404 });
    }

    // Read and parse CSV
    const text = await file.text();
    const parsed = parseCSV(text);

    if (parsed.errors.length > 0) {
      return NextResponse.json(
        {
          error: "CSV parsing failed",
          details: parsed.errors,
        },
        { status: 400 }
      );
    }

    // Validate
    let validation;
    switch (type) {
      case "users":
        validation = validateUsersCSV(parsed.rows, parsed.headers);
        break;
      case "orders":
        validation = validateOrdersCSV(parsed.rows, parsed.headers);
        break;
      case "subscriptions":
        validation = validateSubscriptionsCSV(parsed.rows, parsed.headers);
        break;
    }

    if (!validation.valid) {
      return NextResponse.json(
        {
          error: "Validation failed",
          validation,
        },
        { status: 400 }
      );
    }

    // Import data
    let importResult;
    switch (type) {
      case "users":
        importResult = await importUsers(validation.validRows, workspace.id);
        break;
      case "orders":
        importResult = await importOrders(validation.validRows, workspace.id);
        break;
      case "subscriptions":
        importResult = await importSubscriptions(validation.validRows, workspace.id);
        break;
    }

    return NextResponse.json({
      success: true,
      result: importResult,
      message: `Successfully imported ${importResult.imported} ${type}`,
    });
  } catch (error: any) {
    console.error("Import error:", error);
    return NextResponse.json(
      { error: error.message || "Import failed" },
      { status: 500 }
    );
  }
}

