import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { parseCSV } from "@/lib/csv/parser";
import {
  validateUsersCSV,
  validateOrdersCSV,
  validateSubscriptionsCSV,
} from "@/lib/csv/validator";

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

    // Read file content
    const text = await file.text();

    // Parse CSV
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

    // Validate based on type
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

    return NextResponse.json({
      success: true,
      validation,
      preview: parsed.rows.slice(0, 5), // First 5 rows for preview
      totalRows: parsed.rows.length,
    });
  } catch (error: any) {
    console.error("Validation error:", error);
    return NextResponse.json(
      { error: error.message || "Validation failed" },
      { status: 500 }
    );
  }
}

