"use server"

import { createClient } from "@/lib/supabase/server"

export async function toggleQuestionFollow(questionId: string) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error("Unauthorized")
  }

  // Check if already following
  const { data: existingFollow } = await supabase
    .from("question_follows")
    .select("id")
    .eq("question_id", questionId)
    .eq("user_id", user.id)
    .single()

  if (existingFollow) {
    // Unfollow
    const { error } = await supabase
      .from("question_follows")
      .delete()
      .eq("question_id", questionId)
      .eq("user_id", user.id)

    if (error) throw error

    // Update follower count
    await supabase.rpc('decrement_follower_count', { question_id: questionId })

    return { following: false }
  } else {
    // Follow
    const { error } = await supabase
      .from("question_follows")
      .insert({
        question_id: questionId,
        user_id: user.id,
      })

    if (error) throw error

    // Update follower count
    await supabase.rpc('increment_follower_count', { question_id: questionId })

    return { following: true }
  }
}

export async function isFollowingQuestion(questionId: string) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return false
  }

  const { data } = await supabase
    .from("question_follows")
    .select("id")
    .eq("question_id", questionId)
    .eq("user_id", user.id)
    .single()

  return !!data
}

export async function getUserFollowedQuestions() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error("Unauthorized")
  }

  const { data, error } = await supabase
    .from("question_follows")
    .select(`
      proverbs(*, profiles:user_id(id, username, avatar_url))
    `)
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  if (error) throw error
  return data
}