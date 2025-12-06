import { createClient } from "@/lib/supabase/client"
import { CacheService, CACHE_TTL } from "@/lib/utils/cache"

export class ProverbService {
    /**
     * Get proverbs feed with caching
     */
    static async getFeed(page = 1, filters = "all") {
        try {
            const cacheKey = CacheService.getFeedKey(page, filters)
            const cachedFeed = await CacheService.get(cacheKey)
            if (cachedFeed) {
                return cachedFeed
            }

            const supabase = createClient()
            const limit = 10
            const from = (page - 1) * limit
            const to = from + limit - 1

            let query = supabase
                .from("proverbs")
                .select(`
          *,
          profiles:user_id (
            username,
            avatar_url
          ),
          likes (count),
          comments (count),
          bookmarks (count)
        `)
                .order("created_at", { ascending: false })
                .range(from, to)

            if (filters === "verified") {
                query = query.eq("is_verified", true)
            }

            const { data, error } = await query

            if (error) {
                console.error("[PROVERB_SERVICE] Get feed error:", error)
                throw error
            }

            // Cache the result
            await CacheService.set(cacheKey, data, CACHE_TTL.PROVERB_FEED)

            return data
        } catch (error) {
            console.error("[PROVERB_SERVICE] Get feed error:", error)
            throw error
        }
    }

    /**
     * Get proverb details
     */
    static async getProverb(id: string) {
        try {
            const supabase = createClient()

            const { data, error } = await supabase
                .from("proverbs")
                .select(`
          *,
          profiles:user_id (
            username,
            avatar_url
          ),
          likes (count),
          comments (
            *,
            profiles:user_id (
              username,
              avatar_url
            )
          )
        `)
                .eq("id", id)
                .single()

            if (error) {
                console.error("[PROVERB_SERVICE] Get proverb error:", error)
                throw error
            }

            return data
        } catch (error) {
            console.error("[PROVERB_SERVICE] Get proverb error:", error)
            throw error
        }
    }
}
