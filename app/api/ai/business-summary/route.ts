import { NextRequest, NextResponse } from "next/server";
import { generateBusinessSummary } from "@/lib/ai";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const metrics = body;

    // Validate required fields
    const requiredFields = [
      "totalRevenue",
      "revenueLast30Days",
      "totalUsers",
      "newUsersThisMonth",
      "activeSubscriptions",
      "canceledSubscriptions",
      "totalOrders",
      "paidOrders",
      "activityLast7Days",
    ];

    for (const field of requiredFields) {
      if (metrics[field] === undefined) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    const summary = await generateBusinessSummary(metrics);

    return NextResponse.json(summary);
  } catch (error) {
    console.error("Business summary error:", error);
    return NextResponse.json(
      { error: "Failed to generate summary" },
      { status: 500 }
    );
  }
}

