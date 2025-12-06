import { NextResponse, type NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'

export async function middleware(request: NextRequest) {
    let response = NextResponse.next({
        request: {
            headers: request.headers,
        },
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
                    cookiesToSet.forEach(({ name, value, options }) => {
                        request.cookies.set(name, value)
                        response.cookies.set(name, value, {
                            ...options,
                            httpOnly: true, // CRITICAL: Force httpOnly for security
                            secure: process.env.NODE_ENV === 'production',
                            sameSite: 'lax',
                        })
                    })
                },
            },
        }
    )

    // Refresh session if needed
    await supabase.auth.getUser()

    // CSRF Protection
    // Only check state-changing methods
    if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(request.method)) {
        const origin = request.headers.get('origin')
        const host = request.headers.get('host')
        const referer = request.headers.get('referer')

        // Skip CSRF check for API routes that might be called from mobile apps or other clients
        // In a strict environment, you'd want to verify these too, potentially via API keys
        if (request.nextUrl.pathname.startsWith('/api/')) {
            // For now, we'll allow API routes but you might want to add specific checks here
        } else {
            // For form submissions and other browser interactions
            if (origin && host && !origin.includes(host)) {
                return new NextResponse('CSRF Error: Origin mismatch', { status: 403 })
            }

            if (referer && host && !referer.includes(host)) {
                return new NextResponse('CSRF Error: Referer mismatch', { status: 403 })
            }
        }
    }

    return response
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - public folder
         */
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
}
