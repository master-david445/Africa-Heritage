"use server"

import { createClient } from "@/lib/supabase/server"

export async function awardPoints(userId: string, amount: number, reason: string) {
    const supabase = await createClient()

    // 1. Get current points
    const { data: profile, error: fetchError } = await supabase
        .from("profiles")
        .select("points")
        .eq("id", userId)
        .single()

    if (fetchError || !profile) {
        console.error(`[awardPoints] Error fetching profile for user ${userId}:`, fetchError)
        return
    }

    // 2. Calculate new points
    const newPoints = (profile.points || 0) + amount

    // 3. Update profile
    const { error: updateError } = await supabase
        .from("profiles")
        .update({ points: newPoints })
        .eq("id", userId)

    if (updateError) {
        console.error(`[awardPoints] Error updating points for user ${userId}:`, updateError)
    } else {
        console.log(`[awardPoints] Awarded ${amount} points to ${userId} for ${reason}. New total: ${newPoints}`)
    }
}
