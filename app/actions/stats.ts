"use server"

import { createClient } from "@/lib/supabase/server"

export interface CommunityStats {
    totalProverbs: number
    totalLikes: number
    totalComments: number
    totalBookmarks: number
    totalUsers: number
}

export async function getCommunityStats(): Promise<CommunityStats> {
    const supabase = await createClient()

    // Run queries in parallel for efficiency
    const [
        { count: totalProverbs },
        { count: totalLikes },
        { count: totalComments },
        { count: totalBookmarks },
        { count: totalUsers }
    ] = await Promise.all([
        supabase.from("proverbs").select("*", { count: "exact", head: true }),
        supabase.from("likes").select("*", { count: "exact", head: true }),
        supabase.from("comments").select("*", { count: "exact", head: true }),
        supabase.from("bookmarks").select("*", { count: "exact", head: true }),
        supabase.from("profiles").select("*", { count: "exact", head: true })
    ])

    return {
        totalProverbs: totalProverbs || 0,
        totalLikes: totalLikes || 0,
        totalComments: totalComments || 0,
        totalBookmarks: totalBookmarks || 0,
        totalUsers: totalUsers || 0
    }
}
