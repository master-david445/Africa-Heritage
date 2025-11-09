"use server"

import { createClient } from "@/lib/supabase/server"

export async function getUserNotifications(userId?: string) {
  const supabase = await createClient()

  let targetUserId = userId
  if (!targetUserId) {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error("Unauthorized")
    targetUserId = user.id
  }

  const { data, error } = await supabase
    .from("notifications")
    .select("*")
    .eq("user_id", targetUserId)
    .order("created_at", { ascending: false })
    .limit(50)

  if (error) throw error
  return data
}

export async function markNotificationAsRead(notificationId: string) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")

  const { error } = await supabase
    .from("notifications")
    .update({ is_read: true })
    .eq("id", notificationId)
    .eq("user_id", user.id)

  if (error) throw error
}

export async function markAllNotificationsAsRead() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")

  const { error } = await supabase
    .from("notifications")
    .update({ is_read: true })
    .eq("user_id", user.id)
    .eq("is_read", false)

  if (error) throw error
}

export async function getUnreadNotificationCount() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return 0

  const { count, error } = await supabase
    .from("notifications")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id)
    .eq("is_read", false)

  if (error) throw error
  return count || 0
}

export async function createNotification(notification: {
  user_id: string
  type: string
  title: string
  message?: string
  related_id?: string
}) {
  const supabase = await createClient()

  const { error } = await supabase
    .from("notifications")
    .insert(notification)

  if (error) throw error
}