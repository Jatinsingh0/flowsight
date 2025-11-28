import { NextRequest, NextResponse } from "next/server";
import { explainChart } from "@/lib/ai";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { revenueData, totalRevenue } = body;

    if (!revenueData || !Array.isArray(revenueData) || totalRevenue === undefined) {
      return NextResponse.json(
        { error: "Invalid request data" },
        { status: 400 }
      );
    }

    const explanation = await explainChart(revenueData, totalRevenue);

    return NextResponse.json({ explanation });
  } catch (error) {
    console.error("Chart explanation error:", error);
    return NextResponse.json(
      { error: "Failed to generate explanation" },
      { status: 500 }
    );
  }
}

