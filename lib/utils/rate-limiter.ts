import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

// Initialize Redis client
const redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL!,
    token: process.env.UPSTASH_REDIS_REST_TOKEN!,
})

// Rate limiters for different operations
export const rateLimiters = {
    // Login attempts: 5 attempts per 15 minutes
    login: new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(5, '15 m'),
        analytics: true,
        prefix: '@ratelimit/login',
    }),

    // Email changes: 2 attempts per hour
    emailChange: new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(2, '1 h'),
        analytics: true,
        prefix: '@ratelimit/email-change',
    }),

    // Password changes: 3 attempts per hour
    passwordChange: new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(3, '1 h'),
        analytics: true,
        prefix: '@ratelimit/password-change',
    }),

    // Profile updates: 10 attempts per minute
    profileUpdate: new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(10, '1 m'),
        analytics: true,
        prefix: '@ratelimit/profile-update',
    }),

    // API requests: 100 requests per minute
    api: new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(100, '1 m'),
        analytics: true,
        prefix: '@ratelimit/api',
    }),
}

/**
 * Check rate limit for a specific operation
 * @param identifier - Unique identifier (e.g., user ID, IP address)
 * @param limiter - The rate limiter to use
 * @returns Object with success status and limit info
 */
export async function checkRateLimit(
    identifier: string,
    limiter: Ratelimit
): Promise<{
    success: boolean
    limit: number
    remaining: number
    reset: number
}> {
    const { success, limit, remaining, reset } = await limiter.limit(identifier)

    return {
        success,
        limit,
        remaining,
        reset,
    }
}
