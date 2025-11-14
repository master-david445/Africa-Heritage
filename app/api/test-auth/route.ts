import { createServerClient } from "@supabase/ssr"
import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll()
          },
          setAll() {
            // No-op for testing
          },
        },
      },
    )

    const { data: { session }, error } = await supabase.auth.getSession()

    if (error) {
      return NextResponse.json({
        success: false,
        error: error.message,
        hasSession: false,
        session: null
      }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      hasSession: !!session,
      userId: session?.user?.id || null,
      userEmail: session?.user?.email || null,
      sessionExpiry: session?.expires_at || null
    })

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
      details: "Auth check failed"
    }, { status: 500 })
  }
}