import { NextRequest, NextResponse } from 'next/server'
import { rateLimiters, checkRateLimit } from '@/lib/utils/rate-limiter'

export async function POST(req: NextRequest) {
    try {
        const { identifier } = await req.json()

        // Use IP address as fallback if identifier not provided
        // In production, ensure you trust the x-forwarded-for header or use a more robust IP detection
        const ip = req.headers.get('x-forwarded-for')?.split(',')[0] || '127.0.0.1'
        const key = identifier ? `${identifier}_${ip}` : ip

        const result = await checkRateLimit(key, rateLimiters.login)

        if (!result.success) {
            return NextResponse.json(
                {
                    error: 'Too many login attempts. Please try again later.',
                    reset: result.reset
                },
                { status: 429 }
            )
        }

        return NextResponse.json(result)
    } catch (error) {
        console.error('Rate limit check failed:', error)
        // Fail open if rate limiting fails to avoid blocking legitimate users during outages
        return NextResponse.json({ success: true })
    }
}
