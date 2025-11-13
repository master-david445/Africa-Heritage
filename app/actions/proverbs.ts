"use server"

import { createClient } from "@/lib/supabase/server"
import { createProverbSchema, CreateProverbInput } from "@/lib/validations"
import type { Proverb } from "@/lib/types"

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

export async function getProverbOfTheDay(): Promise<Proverb> {
  const supabase = await createClient()

  // Get total proverb count
  const { count: totalProverbs, error: countError } = await supabase
    .from("proverbs")
    .select("*", { count: "exact", head: true })

  if (countError || !totalProverbs) throw new Error("Failed to get proverb count")

  // Get or create tracker record
  let { data: tracker, error: trackerError } = await supabase
    .from("proverb_of_the_day_tracker")
    .select("*")
    .single()

  if (trackerError || !tracker) {
    // Create initial tracker if doesn't exist
    const { data: newTracker, error: insertError } = await supabase
      .from("proverb_of_the_day_tracker")
      .insert({ current_index: 0, last_reset_date: new Date().toISOString().split('T')[0] })
      .select()
      .single()

    if (insertError) throw new Error("Failed to create tracker")
    tracker = newTracker
  }

  // Check if date has changed
  const today = new Date().toISOString().split('T')[0]
  const lastResetDate = new Date(tracker.last_reset_date).toISOString().split('T')[0]

  let currentIndex = tracker.current_index

  if (today !== lastResetDate) {
    // New day - increment index
    currentIndex = (tracker.current_index + 1) % totalProverbs

    // Update tracker
    await supabase
      .from("proverb_of_the_day_tracker")
      .update({
        current_index: currentIndex,
        last_reset_date: today
      })
      .eq("id", tracker.id)
  }

  // Fetch the proverb at current index
  const { data: proverb, error: proverbError } = await supabase
    .from("proverbs")
    .select(`
      *,
      profiles:user_id(id, username, avatar_url, country)
    `)
    .order("created_at", { ascending: true })
    .range(currentIndex, currentIndex)
    .single()

  if (proverbError || !proverb) throw new Error("Failed to fetch proverb")

  // Get counts
  const [likesResult, commentsResult] = await Promise.all([
    supabase.from("likes").select("proverb_id").eq("proverb_id", proverb.id),
    supabase.from("comments").select("proverb_id").eq("proverb_id", proverb.id),
  ])

  return {
    ...proverb,
    likes_count: likesResult.data?.length || 0,
    comments_count: commentsResult.data?.length || 0,
  }
}
