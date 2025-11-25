"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export interface Announcement {
    id: string
    title: string
    message: string
    type: "info" | "feature" | "maintenance" | "warning"
    created_by: string
    is_active: boolean
    created_at: string
    expires_at: string | null
}

export async function getActiveAnnouncements() {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from("announcements")
        .select("*")
        .eq("is_active", true)
        .or(`expires_at.is.null,expires_at.gt.${new Date().toISOString()}`)
        .order("created_at", { ascending: false })

    if (error) {
        console.error("Error fetching announcements:", error)
        return []
    }

    return data as Announcement[]
}

export async function getAllAnnouncements() {
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

    const { data, error } = await supabase
        .from("announcements")
        .select("*")
        .order("created_at", { ascending: false })

    if (error) throw error
    return data as Announcement[]
}

export async function createAnnouncement(announcement: {
    title: string
    message: string
    type: "info" | "feature" | "maintenance" | "warning"
    expires_at?: string | null
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

    const { error } = await supabase
        .from("announcements")
        .insert({
            ...announcement,
            created_by: user.id
        })

    if (error) throw error
    revalidatePath("/admin")
    revalidatePath("/")
}

export async function updateAnnouncement(id: string, updates: {
    title?: string
    message?: string
    type?: "info" | "feature" | "maintenance" | "warning"
    expires_at?: string | null
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

    const { error } = await supabase
        .from("announcements")
        .update(updates)
        .eq("id", id)

    if (error) throw error
    revalidatePath("/admin")
    revalidatePath("/")
}

export async function toggleAnnouncementStatus(id: string, is_active: boolean) {
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
        .from("announcements")
        .update({ is_active })
        .eq("id", id)

    if (error) throw error
    revalidatePath("/admin")
    revalidatePath("/")
}

export async function deleteAnnouncement(id: string) {
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
        .from("announcements")
        .delete()
        .eq("id", id)

    if (error) throw error
    revalidatePath("/admin")
    revalidatePath("/")
}
