"use client"

import { useState, useEffect } from "react"
import Header from "@/components/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Trophy, TrendingUp, Zap } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { getLeaderboard, getLeaderboardStats } from "@/app/actions/leaderboard"
import type { LeaderboardUser } from "@/app/actions/leaderboard"

export default function LeaderboardPage() {
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardUser[]>([])
  const [stats, setStats] = useState<{
    totalPoints: number
    activeUsers: number
    topContributor: { username: string; points: number } | null
  } | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchLeaderboard() {
      try {
        setLoading(true)
        setError(null)
        const [users, statsData] = await Promise.all([
          getLeaderboard(),
          getLeaderboardStats()
        ])
        setLeaderboardData(users)
        setStats(statsData)
      } catch (err) {
        setError("Failed to load leaderboard")
        console.error("Error fetching leaderboard:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchLeaderboard()
  }, [])

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1:
        return "bg-yellow-100 text-yellow-800"
      case 2:
        return "bg-gray-100 text-gray-800"
      case 3:
        return "bg-orange-100 text-orange-800"
      default:
        return "bg-gray-50 text-gray-700"
    }
  }

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return "🥇"
      case 2:
        return "🥈"
      case 3:
        return "🥉"
      default:
        return null
    }
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-yellow-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <Trophy className="w-8 h-8 text-orange-600" />
              <h1 className="text-4xl font-bold text-gray-900">Community Leaderboard</h1>
            </div>
            <p className="text-gray-600">Top contributors and community leaders</p>
          </div>

          {/* Leaderboard Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {loading ? (
              <>
                <Card>
                  <CardHeader className="pb-3">
                    <Skeleton className="h-4 w-24" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-8 w-20 mb-2" />
                    <Skeleton className="h-3 w-16" />
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-3">
                    <Skeleton className="h-4 w-32" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-8 w-24 mb-2" />
                    <Skeleton className="h-3 w-20" />
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-3">
                    <Skeleton className="h-4 w-28" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-8 w-16 mb-2" />
                    <Skeleton className="h-3 w-24" />
                  </CardContent>
                </Card>
              </>
            ) : error ? (
              <div className="col-span-3">
                <Card className="border-red-200">
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <p className="text-red-600 mb-4">{error}</p>
                      <Button
                        onClick={() => window.location.reload()}
                        variant="outline"
                      >
                        Try Again
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <>
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-gray-600">Top Contributor</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-orange-600 truncate">
                      {stats?.topContributor?.username || leaderboardData[0]?.username || "No users yet"}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {stats?.topContributor?.points || leaderboardData[0]?.points || 0} points
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-gray-600">Total Points Distributed</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-orange-600">
                      {stats?.totalPoints.toLocaleString() || leaderboardData.reduce((sum, user) => sum + user.points, 0).toLocaleString()}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Across all users</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-gray-600">Active Contributors</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-orange-600">{stats?.activeUsers || leaderboardData.length}</div>
                    <p className="text-xs text-gray-500 mt-1">Top ranked users</p>
                  </CardContent>
                </Card>
              </>
            )}
          </div>

          {/* Leaderboard Table */}
          <Card>
            <CardHeader>
              <CardTitle>Rankings</CardTitle>
              <CardDescription>Users ranked by community engagement and contributions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {loading ? (
                  // Loading skeletons for leaderboard items
                  Array.from({ length: 8 }).map((_, i) => (
                    <div key={i} className="flex items-center justify-between p-4 rounded-lg border">
                      <div className="flex items-center gap-4 flex-1">
                        <Skeleton className="w-10 h-10 rounded-full" />
                        <div className="flex-1">
                          <Skeleton className="h-4 w-24 mb-2" />
                          <Skeleton className="h-3 w-16" />
                        </div>
                      </div>
                      <div className="flex items-center gap-6">
                        <div>
                          <Skeleton className="h-4 w-12 mb-1" />
                          <Skeleton className="h-3 w-8" />
                        </div>
                        <div>
                          <Skeleton className="h-4 w-8 mb-1" />
                          <Skeleton className="h-3 w-12" />
                        </div>
                        <div>
                          <Skeleton className="h-4 w-10 mb-1" />
                          <Skeleton className="h-3 w-14" />
                        </div>
                      </div>
                    </div>
                  ))
                ) : error ? (
                  <div className="text-center py-8">
                    <p className="text-red-600 mb-4">{error}</p>
                    <Button
                      onClick={() => window.location.reload()}
                      variant="outline"
                    >
                      Try Again
                    </Button>
                  </div>
                ) : leaderboardData.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500">No users found. Be the first to contribute!</p>
                  </div>
                ) : (
                  leaderboardData.map((user) => (
                    <Link key={user.id} href={`/profile/${user.id}`}>
                      <div
                        className={`flex items-center justify-between p-4 rounded-lg border transition hover:shadow-md cursor-pointer ${getRankColor(
                          user.rank,
                        )}`}
                      >
                        <div className="flex items-center gap-4 flex-1">
                          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-white font-bold text-lg">
                            {getRankIcon(user.rank) || `#${user.rank}`}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-gray-900 truncate">{user.username}</p>
                            {user.badge && <Badge className="mt-1 bg-orange-600 text-white text-xs">{user.badge}</Badge>}
                          </div>
                        </div>

                        <div className="flex items-center gap-3 md:gap-6 text-right">
                          <div className="hidden sm:block">
                            <div className="flex items-center gap-1 font-semibold text-gray-900">
                              <Zap className="w-4 h-4 text-yellow-500" />
                              {user.points}
                            </div>
                            <p className="text-xs text-gray-600">points</p>
                          </div>
                          <div>
                            <div className="font-semibold text-gray-900">{user.proverbs_count}</div>
                            <p className="text-xs text-gray-600">proverbs</p>
                          </div>
                          <div className="hidden md:block">
                            <div className="flex items-center gap-1 font-semibold text-gray-900">
                              <TrendingUp className="w-4 h-4 text-orange-600" />
                              {user.followers_count}
                            </div>
                            <p className="text-xs text-gray-600">followers</p>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </>
  )
}
