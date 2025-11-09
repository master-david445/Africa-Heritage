"use server"

import { createClient } from "@/lib/supabase/server"
import { voteSchema, VoteInput } from "@/lib/validations"

export async function voteOnAnswer(formData: VoteInput) {
  const supabase = await createClient()

  // Validate input
  const validatedData = voteSchema.parse(formData)

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error("Unauthorized")
  }

  // Check if user already voted on this answer
  const { data: existingVote } = await supabase
    .from("votes")
    .select("*")
    .eq("answer_id", validatedData.answer_id)
    .eq("user_id", user.id)
    .single()

  if (existingVote) {
    if (existingVote.vote_type === validatedData.vote_type) {
      // Remove vote if same type
      const { error } = await supabase
        .from("votes")
        .delete()
        .eq("answer_id", validatedData.answer_id)
        .eq("user_id", user.id)

      if (error) throw error

      // Update vote count
      await updateVoteCount(validatedData.answer_id, existingVote.vote_type === "upvote" ? -1 : 1)

      return { voted: false, previousVote: existingVote.vote_type }
    } else {
      // Change vote type
      const { error } = await supabase
        .from("votes")
        .update({ vote_type: validatedData.vote_type })
        .eq("answer_id", validatedData.answer_id)
        .eq("user_id", user.id)

      if (error) throw error

      // Update vote count (remove old, add new)
      const voteChange = validatedData.vote_type === "upvote" ? 2 : -2
      await updateVoteCount(validatedData.answer_id, voteChange)

      return { voted: true, voteType: validatedData.vote_type, previousVote: existingVote.vote_type }
    }
  } else {
    // New vote
    const { error } = await supabase
      .from("votes")
      .insert({
        answer_id: validatedData.answer_id,
        user_id: user.id,
        vote_type: validatedData.vote_type,
      })

    if (error) throw error

    // Update vote count
    await updateVoteCount(validatedData.answer_id, validatedData.vote_type === "upvote" ? 1 : -1)

    // Create notification for answer author
    const { data: answer } = await supabase
      .from("answers")
      .select("user_id")
      .eq("id", validatedData.answer_id)
      .single()

    if (answer && answer.user_id !== user.id) {
      await supabase.from("notifications").insert({
        user_id: answer.user_id,
        type: validatedData.vote_type,
        title: `Your answer received a ${validatedData.vote_type}`,
        message: `Someone ${validatedData.vote_type}d your answer`,
        related_id: validatedData.answer_id,
      })
    }

    return { voted: true, voteType: validatedData.vote_type }
  }
}

async function updateVoteCount(answerId: string, change: number) {
  const supabase = await createClient()

  const { error } = await supabase.rpc('increment_vote_count', {
    answer_id: answerId,
    vote_change: change
  })

  if (error) throw error
}

export async function getUserVoteOnAnswer(answerId: string) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return null
  }

  const { data } = await supabase
    .from("votes")
    .select("vote_type")
    .eq("answer_id", answerId)
    .eq("user_id", user.id)
    .single()

  return data?.vote_type || null
}