"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import type { Badge, UserBadge } from "@/lib/types"

export async function getUserBadges(userId: string) {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from("user_badges")
        .select(`
      *,
      badge:badges(*)
    `)
        .eq("user_id", userId)

    if (error) {
        console.error("Error fetching user badges:", error)
        return []
    }

    return data.map((item) => ({
        ...item.badge,
        awarded_at: item.awarded_at,
    }))
}

export async function getAllBadges() {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from("badges")
        .select("*")
        .order("name")

    if (error) {
        console.error("Error fetching badges:", error)
        return []
    }

    return data
}

export async function checkAndAwardBadges(userId: string) {
    const supabase = await createClient()

    // 1. Fetch user stats
    const { count: proverbCount, error: proverbError } = await supabase
        .from("proverbs")
        .select("*", { count: "exact", head: true })
        .eq("user_id", userId)

    if (proverbError) {
        console.error("Error checking proverb count:", proverbError)
        return
    }

    // 2. Define badge criteria (hardcoded for now, ideally should be in DB or config)
    const badgesToAward = []

    if ((proverbCount || 0) >= 1) {
        badgesToAward.push("First Proverb")
    }
    if ((proverbCount || 0) >= 10) {
        badgesToAward.push("Proverb Master") // Example
    }

    // 3. Fetch existing badges to avoid duplicates
    const { data: existingBadges } = await supabase
        .from("user_badges")
        .select("badge_id, badge:badges(name)")
        .eq("user_id", userId)

    const existingBadgeNames = new Set(existingBadges?.map((b: any) => b.badge.name))

    // 4. Award new badges
    for (const badgeName of badgesToAward) {
        if (!existingBadgeNames.has(badgeName)) {
            // Find badge ID
            const { data: badge } = await supabase
                .from("badges")
                .select("id")
                .eq("name", badgeName)
                .single()

            if (badge) {
                await supabase
                    .from("user_badges")
                    .insert({
                        user_id: userId,
                        badge_id: badge.id,
                    })

                // Create notification
                await supabase.from("notifications").insert({
                    user_id: userId,
                    type: "badge_earned",
                    content: `You earned the "${badgeName}" badge!`,
                    is_read: false,
                    data: { badge_id: badge.id }
                })
            }
        }
    }

    revalidatePath(`/profile/${userId}`)
}
