"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export interface AdminUser {
    id: string
    email: string
    username: string
    full_name: string | null
    avatar_url: string | null
    is_admin: boolean
    is_verified: boolean
    is_suspended: boolean
    points: number
    created_at: string
    proverb_count?: number
    comment_count?: number
}

export interface UserFilters {
    search?: string
    status?: "all" | "active" | "suspended" | "verified" | "admin"
    sort?: "newest" | "oldest" | "points_high" | "points_low"
    page?: number
    limit?: number
}

export async function getAdminUsers(filters: UserFilters = {}) {
    const supabase = await createClient()
    const { search, status = "all", sort = "newest", page = 1, limit = 10 } = filters

    // Calculate pagination
    const from = (page - 1) * limit
    const to = from + limit - 1

    // Start query
    let query = supabase
        .from("profiles")
        .select("*", { count: "exact" })

    // Apply search
    if (search) {
        query = query.or(`username.ilike.%${search}%,full_name.ilike.%${search}%,email.ilike.%${search}%`)
    }

    // Apply status filters
    switch (status) {
        case "suspended":
            query = query.eq("is_suspended", true)
            break
        case "verified":
            query = query.eq("is_verified", true)
            break
        case "admin":
            query = query.eq("is_admin", true)
            break
        case "active":
            query = query.eq("is_suspended", false)
            break
    }

    // Apply sorting
    switch (sort) {
        case "newest":
            query = query.order("created_at", { ascending: false })
            break
        case "oldest":
            query = query.order("created_at", { ascending: true })
            break
        case "points_high":
            query = query.order("points", { ascending: false })
            break
        case "points_low":
            query = query.order("points", { ascending: true })
            break
    }

    // Apply pagination
    query = query.range(from, to)

    const { data: profiles, error, count } = await query

    if (error) {
        console.error("Error fetching admin users:", error)
        throw new Error("Failed to fetch users")
    }

    return {
        users: profiles as AdminUser[],
        total: count || 0,
        page,
        limit,
        totalPages: count ? Math.ceil(count / limit) : 0
    }
}

export async function toggleUserAdmin(userId: string, isAdmin: boolean) {
    const supabase = await createClient()

    // Verify current user is admin
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error("Unauthorized")

    const { data: currentUserProfile } = await supabase
        .from("profiles")
        .select("is_admin")
        .eq("id", user.id)
        .single()

    if (!currentUserProfile?.is_admin) throw new Error("Unauthorized")

    const { error } = await supabase
        .from("profiles")
        .update({ is_admin: isAdmin })
        .eq("id", userId)

    if (error) throw error
    revalidatePath("/admin")
}

export async function toggleUserVerification(userId: string, isVerified: boolean) {
    const supabase = await createClient()

    // Verify current user is admin
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error("Unauthorized")

    const { data: currentUserProfile } = await supabase
        .from("profiles")
        .select("is_admin")
        .eq("id", user.id)
        .single()

    if (!currentUserProfile?.is_admin) throw new Error("Unauthorized")

    const { error } = await supabase
        .from("profiles")
        .update({ is_verified: isVerified })
        .eq("id", userId)

    if (error) throw error
    revalidatePath("/admin")
}

export async function toggleUserSuspension(userId: string, isSuspended: boolean) {
    const supabase = await createClient()

    // Verify current user is admin
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error("Unauthorized")

    const { data: currentUserProfile } = await supabase
        .from("profiles")
        .select("is_admin")
        .eq("id", user.id)
        .single()

    if (!currentUserProfile?.is_admin) throw new Error("Unauthorized")

    const { error } = await supabase
        .from("profiles")
        .update({ is_suspended: isSuspended })
        .eq("id", userId)

    if (error) throw error
    revalidatePath("/admin")
}
