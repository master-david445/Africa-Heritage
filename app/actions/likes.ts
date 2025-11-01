"use server"

import { createClient } from "@/lib/supabase/server"

export async function toggleLike(proverbId: string) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error("Unauthorized")
  }

  // Check if like already exists
  const { data: existingLike } = await supabase
    .from("likes")
    .select("id")
    .eq("proverb_id", proverbId)
    .eq("user_id", user.id)
    .single()

  if (existingLike) {
    // Unlike
    const { error } = await supabase.from("likes").delete().eq("proverb_id", proverbId).eq("user_id", user.id)

    if (error) throw error
    return { liked: false }
  } else {
    // Like
    const { error } = await supabase.from("likes").insert({
      proverb_id: proverbId,
      user_id: user.id,
    })

    if (error) throw error
    return { liked: true }
  }
}

export async function getLikesCount(proverbId: string) {
  const supabase = await createClient()

  const { data, error } = await supabase.from("likes").select("*", { count: "exact" }).eq("proverb_id", proverbId)

  if (error) throw error
  return data?.length || 0
}

export async function isProverbLikedByUser(proverbId: string) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return false
  }

  const { data } = await supabase.from("likes").select("id").eq("proverb_id", proverbId).eq("user_id", user.id).single()

  return !!data
}
