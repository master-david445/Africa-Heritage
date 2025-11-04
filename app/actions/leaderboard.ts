"use server"

import { createClient } from "@/lib/supabase/server"

export interface LeaderboardUser {
  id: string
  username: string
  avatar_url: string | null
  points: number
  proverbs_count: number
  followers_count: number
  rank: number
  badge?: string
}

export async function getLeaderboard(limit = 50) {
  const supabase = await createClient()

  // Get users ordered by points
  const { data: users, error: usersError } = await supabase
    .from("profiles")
    .select("id, username, avatar_url, points")
    .eq("is_suspended", false)
    .order("points", { ascending: false })
    .limit(limit)

  if (usersError) throw usersError

  if (!users || users.length === 0) {
    return []
  }

  // Get stats for each user
  const userIds = users.map(user => user.id)

  const [proverbsResult, followersResult, badgesResult] = await Promise.all([
    // Get proverbs count for each user
    supabase
      .from("proverbs")
      .select("user_id")
      .in("user_id", userIds),

    // Get followers count for each user
    supabase
      .from("follows")
      .select("following_id")
      .in("following_id", userIds),

    // Get user badges
    supabase
      .from("user_badges")
      .select(`
        user_id,
        badges: badge_id (
          name
        )
      `)
      .in("user_id", userIds)
  ])

  // Create count maps
  const proverbsCount = new Map<string, number>()
  const followersCount = new Map<string, number>()
  const userBadges = new Map<string, string[]>()

  proverbsResult.data?.forEach(proverb => {
    proverbsCount.set(proverb.user_id, (proverbsCount.get(proverb.user_id) || 0) + 1)
  })

  followersResult.data?.forEach(follow => {
    followersCount.set(follow.following_id, (followersCount.get(follow.following_id) || 0) + 1)
  })

  badgesResult.data?.forEach(userBadge => {
    const userId = userBadge.user_id
    const badgeName = (userBadge.badges as any)?.name
    if (badgeName) {
      if (!userBadges.has(userId)) {
        userBadges.set(userId, [])
      }
      userBadges.get(userId)!.push(badgeName)
    }
  })

  // Combine data and assign ranks
  const leaderboardUsers: LeaderboardUser[] = users.map((user, index) => ({
    id: user.id,
    username: user.username,
    avatar_url: user.avatar_url,
    points: user.points,
    proverbs_count: proverbsCount.get(user.id) || 0,
    followers_count: followersCount.get(user.id) || 0,
    rank: index + 1,
    badge: userBadges.get(user.id)?.[0] // Take first badge as primary
  }))

  return leaderboardUsers
}

export async function getLeaderboardStats() {
  const supabase = await createClient()

  const [totalPointsResult, activeUsersResult, topContributorResult] = await Promise.all([
    // Total points distributed
    supabase
      .from("profiles")
      .select("points")
      .eq("is_suspended", false),

    // Active users (users with recent activity - last 24 hours)
    // For simplicity, we'll count users who have created content in the last 24 hours
    supabase
      .from("proverbs")
      .select("user_id", { count: "exact", head: true })
      .gte("created_at", new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()),

    // Top contributor
    supabase
      .from("profiles")
      .select("username, points")
      .eq("is_suspended", false)
      .order("points", { ascending: false })
      .limit(1)
      .single()
  ])

  const totalPoints = totalPointsResult.data?.reduce((sum, profile) => sum + profile.points, 0) || 0
  const activeUsers = activeUsersResult.count || 0
  const topContributor = topContributorResult.data

  return {
    totalPoints,
    activeUsers,
    topContributor
  }
}