import { Redis } from '@upstash/redis'

// Initialize Redis client
const redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL!,
    token: process.env.UPSTASH_REDIS_REST_TOKEN!,
})

export const CACHE_TTL = {
    PROFILE: 60 * 5, // 5 minutes
    PROVERB_FEED: 60 * 1, // 1 minute
    LEADERBOARD: 60 * 15, // 15 minutes
    USER_STATS: 60 * 5, // 5 minutes
}

export class CacheService {
    /**
     * Get data from cache
     */
    static async get<T>(key: string): Promise<T | null> {
        try {
            const data = await redis.get(key)
            return data as T
        } catch (error) {
            console.error('[CACHE] Get error:', error)
            return null
        }
    }

    /**
     * Set data in cache
     */
    static async set(key: string, value: any, ttlSeconds: number): Promise<void> {
        try {
            await redis.set(key, value, { ex: ttlSeconds })
        } catch (error) {
            console.error('[CACHE] Set error:', error)
        }
    }

    /**
     * Delete data from cache
     */
    static async del(key: string): Promise<void> {
        try {
            await redis.del(key)
        } catch (error) {
            console.error('[CACHE] Delete error:', error)
        }
    }

    /**
     * Generate cache key for profile
     */
    static getProfileKey(username: string): string {
        return `profile:${username.toLowerCase()}`
    }

    /**
     * Generate cache key for user stats
     */
    static getUserStatsKey(userId: string): string {
        return `stats:${userId}`
    }

    /**
     * Generate cache key for proverb feed
     */
    static getFeedKey(page: number, filters: string): string {
        return `feed:${filters}:${page}`
    }
}
