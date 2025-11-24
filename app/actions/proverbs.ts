"use server"

import { createClient, createAdminClient } from "@/lib/supabase/server"
import { createProverbSchema, CreateProverbInput } from "@/lib/validations"
import { checkAndAwardBadges } from "@/app/actions/badges"
import { awardPoints } from "@/app/actions/points"

export async function createProverb(validatedData: CreateProverbInput) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error("Unauthorized")
  }

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

  // Check and award badges asynchronously
  checkAndAwardBadges(user.id).catch(err =>
    console.error("Error awarding badges:", err)
  )

  // Award points asynchronously
  awardPoints(user.id, 10, 'created_proverb').catch(err =>
    console.error("Error awarding points:", err)
  )

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
  // Use admin client to bypass RLS for public feed
  let supabase;
  if (process.env.SUPABASE_SERVICE_ROLE_KEY) {
    supabase = await createAdminClient()
  } else {
    console.warn('[getAllProverbs] SUPABASE_SERVICE_ROLE_KEY missing, falling back to anon client')
    supabase = await createClient()
  }

  try {
    console.log(`[getAllProverbs] Fetching proverbs with limit=${limit}, offset=${offset}`)

    // First, get the proverbs with user profiles
    const { data, error } = await supabase
      .from("proverbs")
      .select(`
        *,
        profiles: user_id(id, username, avatar_url, country)
      `)
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1)

    if (error) {
      console.error('[getAllProverbs] Supabase error:', error)
      throw error
    }

    if (!data || data.length === 0) {
      console.log('[getAllProverbs] No proverbs found')
      return []
    }

    // Extract proverb IDs for counting related data
    const proverbIds = data.map(proverb => proverb.id)

    // Fetch counts in parallel with error handling
    const [likesResult, commentsResult, bookmarksResult] = await Promise.allSettled([
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

    // Process counts
    const likesCount = new Map<string, number>()
    const commentsCount = new Map<string, number>()
    const bookmarksCount = new Map<string, number>()

    // Process likes count
    if (likesResult.status === 'fulfilled' && likesResult.value.data) {
      likesResult.value.data.forEach(like => {
        likesCount.set(like.proverb_id, (likesCount.get(like.proverb_id) || 0) + 1)
      })
    }

    // Process comments count
    if (commentsResult.status === 'fulfilled' && commentsResult.value.data) {
      commentsResult.value.data.forEach(comment => {
        commentsCount.set(comment.proverb_id, (commentsCount.get(comment.proverb_id) || 0) + 1)
      })
    }

    // Process bookmarks count
    if (bookmarksResult.status === 'fulfilled' && bookmarksResult.value.data) {
      bookmarksResult.value.data.forEach(bookmark => {
        bookmarksCount.set(bookmark.proverb_id, (bookmarksCount.get(bookmark.proverb_id) || 0) + 1)
      })
    }

    // Enhance proverbs with counts
    const proverbsWithCounts = data.map(proverb => ({
      ...proverb,
      likes_count: likesCount.get(proverb.id) || 0,
      comments_count: commentsCount.get(proverb.id) || 0,
      bookmarks_count: bookmarksCount.get(proverb.id) || 0,
    }))

    console.log(`[getAllProverbs] Successfully fetched ${proverbsWithCounts.length} proverbs`)
    return proverbsWithCounts

  } catch (error) {
    console.error('[getAllProverbs] Error:', error)
    return []
  }
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

export async function getProverbOfTheDay() {
  const supabase = await createClient()
  const today = new Date().toISOString().split('T')[0]
  let currentIndex = 0

  // Optimized: Get count and proverb in parallel, handle tracker separately
  const [countResult, trackerResult] = await Promise.all([
    supabase.from("proverbs").select("*", { count: "exact", head: true }),
    supabase.from("proverb_of_the_day_tracker").select("*").single()
  ])

  const totalProverbs = countResult.count
  if (!totalProverbs) throw new Error("No proverbs available")

  let tracker = trackerResult.data
  let needsUpdate = false

  if (trackerResult.error || !tracker) {
    // Create initial tracker if doesn't exist
    const { data: newTracker, error: insertError } = await supabase
      .from("proverb_of_the_day_tracker")
      .insert({ current_index: 0, last_reset_date: today })
      .select()
      .single()

    if (insertError) console.warn('Tracker creation failed', insertError)
    tracker = newTracker
    currentIndex = 0
    needsUpdate = false
  } else {
    currentIndex = tracker.current_index
    if (tracker.last_reset_date !== today) {
      currentIndex = (currentIndex + 1) % totalProverbs
      needsUpdate = true
    }
  }

  // Update tracker asynchronously if needed (don't block proverb fetch)
  if (needsUpdate && tracker) {
    supabase
      .from("proverb_of_the_day_tracker")
      .update({
        current_index: currentIndex,
        last_reset_date: today
      })
      .eq("id", tracker.id)
      .then(({ error }) => {
        if (error) {
          console.warn('Failed to update tracker:', error)
        } else {
          console.log('Proverb of the day tracker updated')
        }
      })
  }

  // Fetch proverb with optimized single query including counts
  const { data: proverb, error: proverbError } = await supabase
    .from("proverbs")
    .select(`
      *,
      profiles: user_id(id, username, avatar_url, country)
    `)
    .range(currentIndex, currentIndex)
    .single()

  if (proverbError || !proverb) {
    // Fallback
    const { data: fallbackProverb } = await supabase
      .from("proverbs")
      .select(`
            *,
            profiles: user_id(id, username, avatar_url, country)
        `)
      .limit(1)
      .single()

    if (!fallbackProverb) throw new Error("No proverbs found")
    return {
      ...fallbackProverb,
      likes_count: 0,
      comments_count: 0
    }
  }

  // Fetch counts for the proverb
  const [likesResult, commentsResult] = await Promise.all([
    supabase.from("likes").select("proverb_id", { count: "exact", head: true }).eq("proverb_id", proverb.id),
    supabase.from("comments").select("proverb_id", { count: "exact", head: true }).eq("proverb_id", proverb.id),
  ])

  return {
    ...proverb,
    likes_count: likesResult.count || 0,
    comments_count: commentsResult.count || 0,
  }
}
