"use server"

import { createClient } from "@/lib/supabase/server"
import { searchProverbsSchema, SearchProverbsInput } from "@/lib/validations"

export async function searchProverbs(filters: SearchProverbsInput) {
  const supabase = await createClient()

  // Validate input
  const validatedFilters = searchProverbsSchema.parse(filters)

  let query = supabase
    .from("proverbs")
    .select(`
      *,
      profiles:user_id(id, username, avatar_url)
    `)
    .order("created_at", { ascending: false })
    .range(validatedFilters.offset, validatedFilters.offset + validatedFilters.limit - 1)

  // Apply search filters
  if (validatedFilters.query) {
    query = query.or(`proverb.ilike.%${validatedFilters.query}%,meaning.ilike.%${validatedFilters.query}%,context.ilike.%${validatedFilters.query}%`)
  }

  if (validatedFilters.country) {
    query = query.ilike("country", `%${validatedFilters.country}%`)
  }

  if (validatedFilters.language) {
    query = query.ilike("language", `%${validatedFilters.language}%`)
  }

  if (validatedFilters.categories && validatedFilters.categories.length > 0) {
    // Search for proverbs that contain any of the specified categories
    query = query.overlaps("categories", validatedFilters.categories)
  }

  if (validatedFilters.author) {
    // Join with profiles to search by author
    query = query.eq("profiles.username", validatedFilters.author)
  }

  const { data, error } = await query

  if (error) throw error

  // Get counts for the results
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

export async function getSearchSuggestions(query: string, limit = 5) {
  const supabase = await createClient()

  if (!query || query.length < 2) {
    return []
  }

  // Get category suggestions
  const { data: categories } = await supabase
    .from("proverbs")
    .select("categories")
    .not("categories", "is", null)

  const categorySuggestions = new Set<string>()
  categories?.forEach(row => {
    row.categories?.forEach((cat: string) => {
      if (cat.toLowerCase().includes(query.toLowerCase())) {
        categorySuggestions.add(cat)
      }
    })
  })

  // Get country suggestions
  const { data: countries } = await supabase
    .from("proverbs")
    .select("country")
    .ilike("country", `%${query}%`)
    .limit(limit)

  // Get language suggestions
  const { data: languages } = await supabase
    .from("proverbs")
    .select("language")
    .ilike("language", `%${query}%`)
    .limit(limit)

  // Get author suggestions
  const { data: authors } = await supabase
    .from("profiles")
    .select("username")
    .ilike("username", `%${query}%`)
    .limit(limit)

  return {
    categories: Array.from(categorySuggestions).slice(0, limit),
    countries: countries?.map(c => c.country).filter((v, i, a) => a.indexOf(v) === i) || [],
    languages: languages?.map(l => l.language).filter((v, i, a) => a.indexOf(v) === i) || [],
    authors: authors?.map(a => a.username) || [],
  }
}