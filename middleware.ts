import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@supabase/ssr"

// Rate limiting store (in production, use Redis)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>()

// CSRF token store (in production, use Redis or database)
const csrfTokens = new Set<string>()

/**
 * Rate limiting function
 */
function checkRateLimit(
  key: string,
  maxRequests: number = 100,
  windowMs: number = 15 * 60 * 1000 // 15 minutes
): boolean {
  const now = Date.now()
  const record = rateLimitStore.get(key)

  if (!record || now > record.resetTime) {
    // Reset or create new record
    rateLimitStore.set(key, {
      count: 1,
      resetTime: now + windowMs
    })
    return true
  }

  if (record.count >= maxRequests) {
    return false
  }

  record.count++
  return true
}

/**
 * Generate CSRF token
 */
function generateCSRFToken(): string {
  const token = crypto.randomUUID()
  csrfTokens.add(token)

  // Clean up old tokens periodically (simple implementation)
  if (csrfTokens.size > 1000) {
    const tokensArray = Array.from(csrfTokens)
    csrfTokens.clear()
    // Keep only the last 500 tokens
    tokensArray.slice(-500).forEach(token => csrfTokens.add(token))
  }

  return token
}

/**
 * Validate CSRF token
 */
function validateCSRFToken(token: string): boolean {
  if (!csrfTokens.has(token)) {
    return false
  }
  // Remove token after use (one-time use)
  csrfTokens.delete(token)
  return true
}

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  const method = request.method
  const clientIP = request.headers.get('x-forwarded-for') ||
                   request.headers.get('x-real-ip') ||
                   'unknown'
  const userAgent = request.headers.get('user-agent') || ''

  // Rate limiting for auth endpoints
  if (pathname.startsWith('/auth/') || pathname.includes('/actions/')) {
    const rateLimitKey = `${clientIP}_${pathname}`
    if (!checkRateLimit(rateLimitKey, 10, 5 * 60 * 1000)) { // 10 requests per 5 minutes
      console.warn(`[MIDDLEWARE] Rate limit exceeded for ${clientIP} on ${pathname}`)
      return new NextResponse('Too Many Requests', {
        status: 429,
        headers: {
          'Retry-After': '300',
          'X-RateLimit-Reset': new Date(Date.now() + 5 * 60 * 1000).toISOString()
        }
      })
    }
  }

  // CSRF protection for sensitive operations
  if (method !== 'GET' && method !== 'HEAD') {
    const sensitivePaths = [
      '/actions/profile',
      '/actions/auth',
      '/admin'
    ]

    const isSensitiveOperation = sensitivePaths.some(path => pathname.includes(path))

    if (isSensitiveOperation) {
      const csrfToken = request.headers.get('x-csrf-token') ||
                       request.nextUrl.searchParams.get('csrfToken')

      if (!csrfToken || !validateCSRFToken(csrfToken)) {
        console.warn(`[MIDDLEWARE] CSRF token validation failed for ${pathname}`)
        return new NextResponse('Forbidden', { status: 403 })
      }
    }
  }

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
            // SECURITY FIX: Enable httpOnly for auth cookies to prevent XSS attacks
            const secureOptions = {
              ...options,
              secure: true,
              sameSite: 'strict' as const,
              httpOnly: true, // CRITICAL: Prevent client-side access to auth cookies
            }
            request.cookies.set(name, value)
            supabaseResponse = NextResponse.next({
              request,
            })
            supabaseResponse.cookies.set(name, value, secureOptions)
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

  // Add security headers
  const securityHeaders = {
    // Content Security Policy
    'Content-Security-Policy': [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' *.supabase.co *.vercel-analytics.com",
      "style-src 'self' 'unsafe-inline' *.googleapis.com",
      "img-src 'self' data: https: *.supabase.co",
      "font-src 'self' *.googleapis.com *.gstatic.com",
      "connect-src 'self' *.supabase.co *.vercel-analytics.com",
      "frame-src 'none'",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'"
    ].join('; '),

    // Prevent clickjacking
    'X-Frame-Options': 'DENY',

    // Prevent MIME type sniffing
    'X-Content-Type-Options': 'nosniff',

    // Enable XSS protection
    'X-XSS-Protection': '1; mode=block',

    // Referrer policy
    'Referrer-Policy': 'strict-origin-when-cross-origin',

    // HSTS (HTTP Strict Transport Security)
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',

    // Permissions policy
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',

    // CSRF token for client-side use
    'X-CSRF-Token': generateCSRFToken(),
  }

  // Apply security headers to response
  Object.entries(securityHeaders).forEach(([key, value]) => {
    supabaseResponse.headers.set(key, value)
  })

  // Log security events
  if (pathname.includes('/actions/') || pathname.startsWith('/auth/')) {
    console.log(`[MIDDLEWARE] ${method} ${pathname} - User: ${user?.id || 'anonymous'} - IP: ${clientIP}`)
  }

  return supabaseResponse
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|public).*)"],
}
