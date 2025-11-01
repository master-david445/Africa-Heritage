"use server"

import { createClient } from "@/lib/supabase/server"

export async function toggleFollow(followingId: string) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error("Unauthorized")
  }

  // Check if already following
  const { data: existingFollow } = await supabase
    .from("follows")
    .select("id")
    .eq("follower_id", user.id)
    .eq("following_id", followingId)
    .single()

  if (existingFollow) {
    // Unfollow
    const { error } = await supabase.from("follows").delete().eq("follower_id", user.id).eq("following_id", followingId)

    if (error) throw error
    return { following: false }
  } else {
    // Follow
    const { error } = await supabase.from("follows").insert({
      follower_id: user.id,
      following_id: followingId,
    })

    if (error) throw error
    return { following: true }
  }
}

export async function getUserFollowers(userId: string) {
  const supabase = await createClient()

  const { data, error } = await supabase.from("follows").select(`profiles:follower_id(*)`).eq("following_id", userId)

  if (error) throw error
  return data
}

export async function getUserFollowing(userId: string) {
  const supabase = await createClient()

  const { data, error } = await supabase.from("follows").select(`profiles:following_id(*)`).eq("follower_id", userId)

  if (error) throw error
  return data
}

export async function isFollowing(followingId: string) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return false
  }

  const { data } = await supabase
    .from("follows")
    .select("id")
    .eq("follower_id", user.id)
    .eq("following_id", followingId)
    .single()

  return !!data
}
