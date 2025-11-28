import { NextRequest, NextResponse } from "next/server";
import { generateCSVTemplate } from "@/lib/csv/parser";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const type = searchParams.get("type") as "users" | "orders" | "subscriptions";

  if (!type || !["users", "orders", "subscriptions"].includes(type)) {
    return NextResponse.json({ error: "Invalid type" }, { status: 400 });
  }

  const template = generateCSVTemplate(type);
  const filename = `${type}.csv`;

  return new NextResponse(template, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}

