"use client"

import { useEffect, useState } from "react"
import { Heart, MessageCircle, Share2, Bookmark, Loader2 } from "lucide-react"
import { getCommunityStats, type CommunityStats } from "@/app/actions/stats"

export default function SocialStats() {
  const [stats, setStats] = useState<CommunityStats>({
    totalProverbs: 0,
    totalLikes: 0,
    totalComments: 0,
    totalBookmarks: 0,
    totalUsers: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadStats() {
      try {
        const data = await getCommunityStats()
        setStats(data)
      } catch (error) {
        console.error("Error loading community stats:", error)
      } finally {
        setLoading(false)
      }
    }

    loadStats()
  }, [])

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-orange-600 flex justify-center items-center h-40">
        <Loader2 className="w-6 h-6 animate-spin text-orange-600" />
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-orange-600">
      <h3 className="font-serif text-lg font-bold mb-4 text-gray-900">Community Activity</h3>
      <div className="grid grid-cols-2 gap-4">
        <div className="flex items-center gap-2">
          <Heart className="w-5 h-5 text-red-600" />
          <div>
            <div className="text-lg font-bold text-gray-900">{stats.totalLikes.toLocaleString()}</div>
            <div className="text-xs text-gray-500">Likes</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <MessageCircle className="w-5 h-5 text-blue-600" />
          <div>
            <div className="text-lg font-bold text-gray-900">{stats.totalComments.toLocaleString()}</div>
            <div className="text-xs text-gray-500">Comments</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Bookmark className="w-5 h-5 text-amber-600" />
          <div>
            <div className="text-lg font-bold text-gray-900">{stats.totalBookmarks.toLocaleString()}</div>
            <div className="text-xs text-gray-500">Bookmarks</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Share2 className="w-5 h-5 text-green-600" />
          <div>
            <div className="text-lg font-bold text-gray-900">{stats.totalProverbs.toLocaleString()}</div>
            <div className="text-xs text-gray-500">Proverbs</div>
          </div>
        </div>
      </div>
    </div>
  )
}
