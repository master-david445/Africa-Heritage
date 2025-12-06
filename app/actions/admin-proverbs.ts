"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export interface PendingProverb {
    id: string
    content: string
    meaning: string
    origin: string
    category: string
    created_at: string
    user_id: string
    username: string
    avatar_url: string | null
    status: "pending" | "approved" | "rejected"
}

export async function getPendingProverbs() {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from("proverbs")
        .select(`
      id,
      proverb,
      meaning,
      origin,
      category,
      created_at,
      status,
      user_id,
      profiles:user_id (
        username,
        avatar_url
      )
    `)
        .eq("status", "pending")
        .order("created_at", { ascending: true })

    if (error) {
        console.error("Error fetching pending proverbs:", error)
        throw new Error("Failed to fetch pending proverbs")
    }

    return data.map((item: any) => ({
        id: item.id,
        content: item.proverb,  // Map 'proverb' column to 'content' property
        meaning: item.meaning,
        origin: item.origin,
        category: item.category,
        created_at: item.created_at,
        status: item.status,
        user_id: item.user_id,
        username: item.profiles?.username || "Unknown",
        avatar_url: item.profiles?.avatar_url
    })) as PendingProverb[]
}

export async function approveProverb(proverbId: string) {
    const supabase = await createClient()

    // Verify admin
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error("Unauthorized")

    const { data: profile } = await supabase
        .from("profiles")
        .select("is_admin")
        .eq("id", user.id)
        .single()

    if (!profile?.is_admin) throw new Error("Unauthorized")

    const { error } = await supabase
        .from("proverbs")
        .update({ status: "approved" })
        .eq("id", proverbId)

    if (error) throw error
    revalidatePath("/admin")
    revalidatePath("/explore")
}

export async function rejectProverb(proverbId: string, reason: string) {
    const supabase = await createClient()

    // Verify admin
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error("Unauthorized")

    const { data: profile } = await supabase
        .from("profiles")
        .select("is_admin")
        .eq("id", user.id)
        .single()

    if (!profile?.is_admin) throw new Error("Unauthorized")

    const { error } = await supabase
        .from("proverbs")
        .update({
            status: "rejected",
            rejection_reason: reason
        })
        .eq("id", proverbId)

    if (error) throw error
    revalidatePath("/admin")
}

export async function deleteProverb(proverbId: string) {
    const supabase = await createClient()

    // Verify admin
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error("Unauthorized")

    const { data: profile } = await supabase
        .from("profiles")
        .select("is_admin")
        .eq("id", user.id)
        .single()

    if (!profile?.is_admin) throw new Error("Unauthorized")

    // Log the deletion in moderation_actions
    await supabase
        .from("moderation_actions")
        .insert({
            admin_id: user.id,
            action_type: "delete_proverb",
            target_type: "proverb",
            target_id: proverbId,
            reason: "Admin deletion"
        })

    // Delete the proverb
    const { error } = await supabase
        .from("proverbs")
        .delete()
        .eq("id", proverbId)

    if (error) throw error
    revalidatePath("/admin")
    revalidatePath("/explore")
}
