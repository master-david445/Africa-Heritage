"use server"

import { createClient } from "@/lib/supabase/server"

export async function getCurrentUser() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return null
  }

  const { data: profile, error } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  if (error) throw error
  return profile
}

export async function getUserProfile(username: string) {
  const supabase = await createClient()

  const { data, error } = await supabase.from("profiles").select("*").eq("username", username).single()

  if (error) throw error
  return data
}

export async function updateProfile(updates: {
  username?: string
  bio?: string
  country?: string
  avatar_url?: string
}) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error("Unauthorized")
  }

  const { data, error } = await supabase.from("profiles").update(updates).eq("id", user.id).select().single()

  if (error) throw error
  return data
}

export async function getProfileStats(userId: string) {
  const supabase = await createClient()

  // Get proverbs count
  const { count: proverbsCount } = await supabase
    .from("proverbs")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId)

  // Get followers count
  const { count: followersCount } = await supabase
    .from("follows")
    .select("*", { count: "exact", head: true })
    .eq("following_id", userId)

  // Get following count
  const { count: followingCount } = await supabase
    .from("follows")
    .select("*", { count: "exact", head: true })
    .eq("follower_id", userId)

  return {
    proverbsCount: proverbsCount || 0,
    followersCount: followersCount || 0,
    followingCount: followingCount || 0,
  }
}
