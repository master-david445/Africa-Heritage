"use server"

import { createClient } from "@/lib/supabase/server"
import { createProverbSchema, CreateProverbInput } from "@/lib/validations"

export async function createProverb(formData: CreateProverbInput) {
  const supabase = await createClient()

  // Validate input
  const validatedData = createProverbSchema.parse(formData)

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error("Unauthorized")
  }

  // Check if user profile exists, create if not
  const { data: profile } = await supabase
    .from("profiles")
    .select("id")
    .eq("id", user.id)
    .single()

  if (!profile) {
    // Create profile if it doesn't exist
    const { error: profileError } = await supabase
      .from("profiles")
      .insert({
        id: user.id,
        username: user.email?.split('@')[0] || `user_${user.id.slice(0, 8)}`,
        email: user.email || '',
        points: 0,
        reputation_score: 0,
        is_admin: false,
        is_verified: false,
        is_suspended: false,
      })

    if (profileError) {
      console.error("Profile creation error:", profileError)
      // Continue anyway, as the insert might still work
    }
  }

  const { data, error } = await supabase
    .from("proverbs")
    .insert({
      user_id: user.id,
      proverb: validatedData.proverb,
      meaning: validatedData.meaning,
      context: validatedData.context,
      country: validatedData.country,
      language: validatedData.language,
      categories: validatedData.categories,
      answer_count: 0,
      follower_count: 0,
    })
    .select()
    .single()

  if (error) {
    console.error("Proverb creation error:", error)
    throw error
  }

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
      profiles:user_id(id, username, avatar_url)
    `)
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1)

  if (error) throw error

  // Get counts separately for better performance
  const proverbIds = data?.map(p => p.id) || []

  if (proverbIds.length > 0) {
    const [likesResult, commentsResult, bookmarksResult] = await Promise.all([
      supabase
        .from("likes")
        .select("proverb_id")
        .in("proverb_id", proverbIds),
      supabase
        .from("comments")
        .select("proverb_id")
        .in("proverb_id", proverbIds),
      supabase
        .from("bookmarks")
        .select("proverb_id")
        .in("proverb_id", proverbIds),
    ])

    // Create count maps
    const likesCount = new Map<string, number>()
    const commentsCount = new Map<string, number>()
    const bookmarksCount = new Map<string, number>()

    likesResult.data?.forEach(like => {
      likesCount.set(like.proverb_id, (likesCount.get(like.proverb_id) || 0) + 1)
    })

    commentsResult.data?.forEach(comment => {
      commentsCount.set(comment.proverb_id, (commentsCount.get(comment.proverb_id) || 0) + 1)
    })

    bookmarksResult.data?.forEach(bookmark => {
      bookmarksCount.set(bookmark.proverb_id, (bookmarksCount.get(bookmark.proverb_id) || 0) + 1)
    })

    // Add counts to proverbs
    return data?.map(proverb => ({
      ...proverb,
      likes_count: likesCount.get(proverb.id) || 0,
      comments_count: commentsCount.get(proverb.id) || 0,
      bookmarks_count: bookmarksCount.get(proverb.id) || 0,
    })) || []
  }

  return data?.map(proverb => ({
    ...proverb,
    likes_count: 0,
    comments_count: 0,
    bookmarks_count: 0,
  })) || []
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
