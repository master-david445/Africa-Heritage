import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const supabase = await createClient()

    // Test basic connection
    const { data: connectionTest, error: connectionError } = await supabase
      .from("proverbs")
      .select("count", { count: "exact", head: true })

    if (connectionError) {
      return NextResponse.json({
        success: false,
        error: connectionError.message,
        details: "Database connection failed or proverbs table doesn't exist"
      }, { status: 500 })
    }

    // Check if tables exist by trying to query them
    const tables = ["proverbs", "profiles", "comments", "likes", "answers"]
    const tableStatus: Record<string, { exists: boolean; count: number; error?: string }> = {}

    for (const table of tables) {
      try {
        const { count, error } = await supabase
          .from(table)
          .select("*", { count: "exact", head: true })

        tableStatus[table] = {
          exists: !error,
          count: count || 0,
          error: error?.message
        }
      } catch (err) {
        tableStatus[table] = {
          exists: false,
          count: 0,
          error: err instanceof Error ? err.message : "Unknown error"
        }
      }
    }

    return NextResponse.json({
      success: true,
      connection: "OK",
      tables: tableStatus,
      totalProverbs: connectionTest
    })

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
      details: "Failed to connect to database"
    }, { status: 500 })
  }
}