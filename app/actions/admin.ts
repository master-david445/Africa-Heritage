"use server"

import { createClient } from "@/lib/supabase/server"

export interface PlatformStats {
  totalUsers: number
  totalProverbs: number
  totalComments: number
  activeUsers: number
  reportedContent: number
  suspendedUsers: number
}

export interface ReportedContent {
  id: string
  type: "proverb" | "comment" | "user"
  content: string
  reportedBy: string
  reason: string
  timestamp: string
  status: "pending" | "reviewed" | "resolved"
  contentId: string
  reporterUsername: string
}

export async function getPlatformStats(): Promise<PlatformStats> {
  const supabase = await createClient()

  const [
    totalUsersResult,
    totalProverbsResult,
    totalCommentsResult,
    activeUsersResult,
    suspendedUsersResult
  ] = await Promise.all([
    supabase.from("profiles").select("*", { count: "exact", head: true }),
    supabase.from("proverbs").select("*", { count: "exact", head: true }),
    supabase.from("comments").select("*", { count: "exact", head: true }),
    // Active users: users who have logged in or been active in the last 24 hours
    // For now, we'll count users who have created content in the last 24 hours
    supabase
      .from("proverbs")
      .select("user_id", { count: "exact", head: true })
      .gte("created_at", new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()),
    supabase.from("profiles").select("*", { count: "exact", head: true }).eq("is_suspended", true)
  ])

  return {
    totalUsers: totalUsersResult.count || 0,
    totalProverbs: totalProverbsResult.count || 0,
    totalComments: totalCommentsResult.count || 0,
    activeUsers: activeUsersResult.count || 0,
    reportedContent: 0, // We'll implement reports table later
    suspendedUsers: suspendedUsersResult.count || 0
  }
}

export async function getReportedContent(): Promise<ReportedContent[]> {
  // For now, return empty array since we don't have a reports table yet
  // This would need to be implemented with a proper reports/moderation system
  return []
}

export async function updateReportStatus(reportId: string, status: "pending" | "reviewed" | "resolved") {
  // Placeholder for future implementation
  // This would update the reports table
  throw new Error("Reports system not yet implemented")
}

export async function suspendUser(userId: string, reason?: string) {
  const supabase = await createClient()

  const { error } = await supabase
    .from("profiles")
    .update({ is_suspended: true })
    .eq("id", userId)

  if (error) throw error
}

export async function unsuspendUser(userId: string) {
  const supabase = await createClient()

  const { error } = await supabase
    .from("profiles")
    .update({ is_suspended: false })
    .eq("id", userId)

  if (error) throw error
}

export async function deleteContent(contentType: "proverb" | "comment", contentId: string) {
  const supabase = await createClient()

  let table: string
  switch (contentType) {
    case "proverb":
      table = "proverbs"
      break
    case "comment":
      table = "comments"
      break
    default:
      throw new Error("Invalid content type")
  }

  const { error } = await supabase
    .from(table)
    .delete()
    .eq("id", contentId)

  if (error) throw error
}