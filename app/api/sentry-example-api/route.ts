import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// API route for testing - Sentry error disabled
export function GET() {
  // Error disabled for deployment
  // throw new Error("Sentry Example API Route Error");
  return NextResponse.json({ data: "Testing API Route - Sentry monitoring disabled" });
}
