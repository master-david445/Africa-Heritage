"use client"

import Header from "@/components/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Trophy, TrendingUp, Zap } from "lucide-react"
import Link from "next/link"

interface LeaderboardUser {
  id: string
  name: string
  avatar: string
  points: number
  proverbsCount: number
  followersCount: number
  rank: number
  badge?: string
}

const leaderboardData: LeaderboardUser[] = [
  {
    id: "user1",
    name: "Amara Kofi",
    avatar: "/placeholder-user.jpg",
    points: 2450,
    proverbsCount: 45,
    followersCount: 542,
    rank: 1,
    badge: "Community Champion",
  },
  {
    id: "user5",
    name: "Zainab Hassan",
    avatar: "/placeholder-user.jpg",
    points: 2100,
    proverbsCount: 38,
    followersCount: 415,
    rank: 2,
    badge: "Top Contributor",
  },
  {
    id: "user3",
    name: "Kofi Mensah",
    avatar: "/placeholder-user.jpg",
    points: 1850,
    proverbsCount: 32,
    followersCount: 298,
    rank: 3,
  },
  {
    id: "user4",
    name: "Nia Okafor",
    avatar: "/placeholder-user.jpg",
    points: 1620,
    proverbsCount: 28,
    followersCount: 245,
    rank: 4,
  },
  {
    id: "user6",
    name: "Jabari Mwangi",
    avatar: "/placeholder-user.jpg",
    points: 1450,
    proverbsCount: 24,
    followersCount: 189,
    rank: 5,
  },
  {
    id: "user7",
    name: "Adeyemi Adebayo",
    avatar: "/placeholder-user.jpg",
    points: 1280,
    proverbsCount: 21,
    followersCount: 156,
    rank: 6,
  },
  {
    id: "user8",
    name: "Fatima Al-Rashid",
    avatar: "/placeholder-user.jpg",
    points: 1100,
    proverbsCount: 18,
    followersCount: 134,
    rank: 7,
  },
  {
    id: "user9",
    name: "Thabo Ndlela",
    avatar: "/placeholder-user.jpg",
    points: 950,
    proverbsCount: 15,
    followersCount: 112,
    rank: 8,
  },
]

export default function LeaderboardPage() {
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
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600">Top Contributor</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-600">{leaderboardData[0].name}</div>
                <p className="text-xs text-gray-500 mt-1">{leaderboardData[0].points} points</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600">Total Points Distributed</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-600">
                  {leaderboardData.reduce((sum, user) => sum + user.points, 0).toLocaleString()}
                </div>
                <p className="text-xs text-gray-500 mt-1">Across all users</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600">Active Contributors</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-600">{leaderboardData.length}</div>
                <p className="text-xs text-gray-500 mt-1">Top ranked users</p>
              </CardContent>
            </Card>
          </div>

          {/* Leaderboard Table */}
          <Card>
            <CardHeader>
              <CardTitle>Rankings</CardTitle>
              <CardDescription>Users ranked by community engagement and contributions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {leaderboardData.map((user) => (
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
                        <div className="flex-1">
                          <p className="font-semibold text-gray-900">{user.name}</p>
                          {user.badge && <Badge className="mt-1 bg-orange-600 text-white">{user.badge}</Badge>}
                        </div>
                      </div>

                      <div className="flex items-center gap-6 text-right">
                        <div>
                          <div className="flex items-center gap-1 font-semibold text-gray-900">
                            <Zap className="w-4 h-4 text-yellow-500" />
                            {user.points}
                          </div>
                          <p className="text-xs text-gray-600">points</p>
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900">{user.proverbsCount}</div>
                          <p className="text-xs text-gray-600">proverbs</p>
                        </div>
                        <div>
                          <div className="flex items-center gap-1 font-semibold text-gray-900">
                            <TrendingUp className="w-4 h-4 text-orange-600" />
                            {user.followersCount}
                          </div>
                          <p className="text-xs text-gray-600">followers</p>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </>
  )
}
