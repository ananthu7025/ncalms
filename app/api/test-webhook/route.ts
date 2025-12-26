import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { purchases } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

/**
 * TEST ENDPOINT - DO NOT USE IN PRODUCTION
 * This endpoint helps verify webhook processing by showing purchase records
 */
export async function GET(request: NextRequest) {
  // Only allow in development
  if (process.env.NODE_ENV !== "development") {
    return NextResponse.json(
      { error: "This endpoint is only available in development" },
      { status: 403 }
    );
  }

  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get("session_id");

    if (!sessionId) {
      return NextResponse.json(
        { error: "session_id parameter is required" },
        { status: 400 }
      );
    }

    // Check if purchase exists for this session
    const purchase = await db
      .select()
      .from(purchases)
      .where(eq(purchases.stripeSessionId, sessionId));

    if (purchase.length === 0) {
      return NextResponse.json({
        processed: false,
        message: "No purchase found for this session ID",
        sessionId,
      });
    }

    return NextResponse.json({
      processed: true,
      message: "Purchase was processed",
      sessionId,
      purchases: purchase,
    });
  } catch (error) {
    console.error("Test webhook error:", error);
    return NextResponse.json(
      {
        error: "Failed to check purchase status",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
