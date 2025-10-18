import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    // Check database connectivity
    await db.$queryRaw`SELECT 1`;
    
    return NextResponse.json({ 
      status: "healthy",
      message: "Good!",
      database: "connected",
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error("Health check failed:", error);
    return NextResponse.json(
      { 
        status: "unhealthy",
        message: "Database connection failed",
        error: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString()
      },
      { status: 503 }
    );
  }
}