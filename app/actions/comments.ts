"use server"

import { createClient } from "@/lib/supabase/server"
import { createCommentSchema, CreateCommentInput } from "@/lib/validations"

export async function createComment(proverbId: string, text: string) {
  const supabase = await createClient()

  // Validate input
  const validatedData: CreateCommentInput = createCommentSchema.parse({ text })

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error("Unauthorized")
  }

  const { data, error } = await supabase
    .from("comments")
    .insert({
      proverb_id: proverbId,
      user_id: user.id,
      text: validatedData.text,
    })
    .select(`
      *,
      profiles:user_id(id, username, avatar_url)
    `)
    .single()

  if (error) throw error
  return data
}

export async function getProverbComments(proverbId: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("comments")
    .select(`
      *,
      profiles:user_id(id, username, avatar_url)
    `)
    .eq("proverb_id", proverbId)
    .order("created_at", { ascending: false })

  if (error) throw error
  return data
}

export async function deleteComment(commentId: string) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error("Unauthorized")
  }

  const { error } = await supabase.from("comments").delete().eq("id", commentId).eq("user_id", user.id)

  if (error) throw error
}
