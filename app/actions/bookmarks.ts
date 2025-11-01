"use server"

import { createClient } from "@/lib/supabase/server"

export async function toggleBookmark(proverbId: string) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error("Unauthorized")
  }

  // Check if bookmark already exists
  const { data: existingBookmark } = await supabase
    .from("bookmarks")
    .select("id")
    .eq("proverb_id", proverbId)
    .eq("user_id", user.id)
    .single()

  if (existingBookmark) {
    // Remove bookmark
    const { error } = await supabase.from("bookmarks").delete().eq("proverb_id", proverbId).eq("user_id", user.id)

    if (error) throw error
    return { bookmarked: false }
  } else {
    // Add bookmark
    const { error } = await supabase.from("bookmarks").insert({
      proverb_id: proverbId,
      user_id: user.id,
    })

    if (error) throw error
    return { bookmarked: true }
  }
}

export async function getUserBookmarks() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error("Unauthorized")
  }

  const { data, error } = await supabase
    .from("bookmarks")
    .select("proverbs(*)")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  if (error) throw error
  return data
}
