"use server"

import { createClient } from "@/lib/supabase/server"

export async function createProverb(formData: {
  proverb: string
  meaning: string
  context?: string
  country: string
  language: string
  categories: string[]
}) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error("Unauthorized")
  }

  const { data, error } = await supabase
    .from("proverbs")
    .insert({
      user_id: user.id,
      proverb: formData.proverb,
      meaning: formData.meaning,
      context: formData.context,
      country: formData.country,
      language: formData.language,
      categories: formData.categories,
    })
    .select()
    .single()

  if (error) throw error
  return data
}

export async function getProverbsByUser(userId: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("proverbs")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })

  if (error) throw error
  return data
}

export async function getAllProverbs(limit = 20, offset = 0) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("proverbs")
    .select(`
      *,
      profiles:user_id(id, username, avatar_url),
      likes:likes(count),
      comments:comments(count),
      bookmarks:bookmarks(count)
    `)
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1)

  if (error) throw error
  return data
}

export async function updateProverb(
  proverbId: string,
  updates: {
    proverb?: string
    meaning?: string
    context?: string
    categories?: string[]
  },
) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error("Unauthorized")
  }

  const { data, error } = await supabase
    .from("proverbs")
    .update(updates)
    .eq("id", proverbId)
    .eq("user_id", user.id)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function deleteProverb(proverbId: string) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error("Unauthorized")
  }

  const { error } = await supabase.from("proverbs").delete().eq("id", proverbId).eq("user_id", user.id)

  if (error) throw error
}
