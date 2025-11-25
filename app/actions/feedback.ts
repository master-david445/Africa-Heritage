"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export interface Feedback {
    id: string
    user_id: string
    type: "feature_request" | "bug_report"
    title: string
    description: string
    status: "pending" | "reviewing" | "planned" | "in_progress" | "completed" | "rejected"
    priority: "low" | "medium" | "high"
    admin_notes: string | null
    reviewed_by: string | null
    created_at: string
    updated_at: string
    username?: string
}

export async function submitFeedback(data: {
    type: "feature_request" | "bug_report"
    title: string
    description: string
}) {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error("Unauthorized")

    const { error } = await supabase
        .from("feedback")
        .insert({
            user_id: user.id,
            type: data.type,
            title: data.title,
            description: data.description
        })

    if (error) throw error
    revalidatePath("/feedback")
}

export async function getUserFeedback() {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error("Unauthorized")

    const { data, error } = await supabase
        .from("feedback")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })

    if (error) throw error
    return data as Feedback[]
}

export async function getAllFeedback(filters?: {
    type?: "feature_request" | "bug_report"
    status?: string
}) {
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

    let query = supabase
        .from("feedback")
        .select(`
            *,
            profiles:user_id (
                username
            )
        `)
        .order("created_at", { ascending: false })

    if (filters?.type) {
        query = query.eq("type", filters.type)
    }

    if (filters?.status) {
        query = query.eq("status", filters.status)
    }

    const { data, error } = await query

    if (error) throw error

    return data.map((item: any) => ({
        ...item,
        username: item.profiles?.username || "Unknown"
    })) as Feedback[]
}

export async function updateFeedbackStatus(
    id: string,
    status: "pending" | "reviewing" | "planned" | "in_progress" | "completed" | "rejected",
    priority?: "low" | "medium" | "high",
    admin_notes?: string
) {
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

    const updates: any = {
        status,
        reviewed_by: user.id,
        updated_at: new Date().toISOString()
    }

    if (priority) updates.priority = priority
    if (admin_notes !== undefined) updates.admin_notes = admin_notes

    const { error } = await supabase
        .from("feedback")
        .update(updates)
        .eq("id", id)

    if (error) throw error
    revalidatePath("/admin")
}
