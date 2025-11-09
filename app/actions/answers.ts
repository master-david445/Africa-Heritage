"use server"

import { createClient } from "@/lib/supabase/server"
import { createAnswerSchema, updateAnswerSchema, CreateAnswerInput, UpdateAnswerInput } from "@/lib/validations"

export async function createAnswer(questionId: string, formData: CreateAnswerInput) {
  const supabase = await createClient()

  // Validate input
  const validatedData = createAnswerSchema.parse(formData)

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error("Unauthorized")
  }

  const { data, error } = await supabase
    .from("answers")
    .insert({
      question_id: questionId,
      user_id: user.id,
      content: validatedData.content,
    })
    .select(`
      *,
      profiles:user_id(id, username, avatar_url)
    `)
    .single()

  if (error) throw error

  // Update answer count on question
  await supabase.rpc('increment_answer_count', { question_id: questionId })

  // Create notification for question author
  const { data: question } = await supabase
    .from("proverbs")
    .select("user_id")
    .eq("id", questionId)
    .single()

  if (question && question.user_id !== user.id) {
    await supabase.from("notifications").insert({
      user_id: question.user_id,
      type: "new_answer",
      title: "New answer to your question",
      message: `Someone answered your proverb question`,
      related_id: data.id,
    })
  }

  return data
}

export async function getQuestionAnswers(questionId: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("answers")
    .select(`
      *,
      profiles:user_id(id, username, avatar_url)
    `)
    .eq("question_id", questionId)
    .order("vote_count", { ascending: false })
    .order("created_at", { ascending: false })

  if (error) throw error
  return data
}

export async function updateAnswer(answerId: string, formData: UpdateAnswerInput) {
  const supabase = await createClient()

  // Validate input
  const validatedData = updateAnswerSchema.parse(formData)

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error("Unauthorized")
  }

  const { data, error } = await supabase
    .from("answers")
    .update({
      content: validatedData.content,
    })
    .eq("id", answerId)
    .eq("user_id", user.id)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function deleteAnswer(answerId: string) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error("Unauthorized")
  }

  // Get question_id before deleting
  const { data: answer } = await supabase
    .from("answers")
    .select("question_id")
    .eq("id", answerId)
    .eq("user_id", user.id)
    .single()

  if (!answer) {
    throw new Error("Answer not found or unauthorized")
  }

  const { error } = await supabase
    .from("answers")
    .delete()
    .eq("id", answerId)
    .eq("user_id", user.id)

  if (error) throw error

  // Update answer count on question
  await supabase.rpc('decrement_answer_count', { question_id: answer.question_id })
}

export async function acceptAnswer(answerId: string) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error("Unauthorized")
  }

  // Get the answer and question to verify ownership
  const { data: answer } = await supabase
    .from("answers")
    .select(`
      *,
      proverbs!inner(user_id)
    `)
    .eq("id", answerId)
    .single()

  if (!answer) {
    throw new Error("Answer not found")
  }

  // Check if user owns the question
  if (answer.proverbs.user_id !== user.id) {
    throw new Error("Unauthorized - you don't own this question")
  }

  // First, unaccept any previously accepted answer
  await supabase
    .from("answers")
    .update({ is_accepted: false })
    .eq("question_id", answer.question_id)
    .eq("is_accepted", true)

  // Accept this answer
  const { data, error } = await supabase
    .from("answers")
    .update({ is_accepted: true })
    .eq("id", answerId)
    .select()
    .single()

  if (error) throw error

  // Create notification for answer author
  if (answer.user_id !== user.id) {
    await supabase.from("notifications").insert({
      user_id: answer.user_id,
      type: "answer_accepted",
      title: "Your answer was accepted!",
      message: "The question author accepted your answer",
      related_id: answerId,
    })
  }

  return data
}