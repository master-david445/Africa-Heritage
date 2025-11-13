import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@supabase/ssr"

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options = {} }) => {
            // Ensure cookies work on mobile Safari and other browsers
            const mobileOptions = {
              ...options,
              secure: true,
              sameSite: 'lax' as const,
              httpOnly: false, // Allow client-side access for auth
            }
            request.cookies.set(name, value)
            supabaseResponse = NextResponse.next({
              request,
            })
            supabaseResponse.cookies.set(name, value, mobileOptions)
          })
        },
      },
    },
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Define public routes that don't require authentication
  const publicRoutes = [
    "/",
    "/landing",
    "/auth/login",
    "/auth/sign-up",
    "/auth/sign-up-success"
  ]

  // Define protected routes that require authentication
  const protectedRoutes = [
    "/explore",
    "/leaderboard",
    "/admin",
    "/profile",
    "/collections",
    "/search",
    "/share"
  ]

  // Check if the current path is a protected route
  const isProtectedRoute = protectedRoutes.some(route =>
    request.nextUrl.pathname.startsWith(route)
  )

  // Check if the current path is a public route
  const isPublicRoute = publicRoutes.some(route =>
    request.nextUrl.pathname === route
  )

  // Redirect unauthenticated users to login if accessing protected routes
  // that are not explicitly marked as public
  if (!user && isProtectedRoute && !isPublicRoute) {
    const url = request.nextUrl.clone()
    url.pathname = "/auth/login"
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|public).*)"],
}
