"use client"

import { Heart, MessageCircle, Share2, Bookmark } from "lucide-react"
import type { Database } from "@/lib/database.types"

type Proverb = Database["public"]["Tables"]["proverbs"]["Row"] & {
  likes?: any[]
  comments?: any[]
  bookmarks?: any[]
}

interface SocialStatsProps {
  proverbs?: Proverb[]
}

export default function SocialStats({ proverbs = [] }: SocialStatsProps) {
  const likes = proverbs.reduce((sum, p) => sum + (p.likes?.length || 0), 0)
  const comments = proverbs.reduce((sum, p) => sum + (p.comments?.length || 0), 0)
  const bookmarks = proverbs.reduce((sum, p) => sum + (p.bookmarks?.length || 0), 0)
  const shares = proverbs.reduce((sum, p) => sum + (p.shares || 0), 0)

  return (
    <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-orange-600">
      <h3 className="font-serif text-lg font-bold mb-4 text-gray-900">Community Activity</h3>
      <div className="grid grid-cols-2 gap-4">
        <div className="flex items-center gap-2">
          <Heart className="w-5 h-5 text-red-600" />
          <div>
            <div className="text-lg font-bold text-gray-900">{likes}</div>
            <div className="text-xs text-gray-500">Likes</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <MessageCircle className="w-5 h-5 text-blue-600" />
          <div>
            <div className="text-lg font-bold text-gray-900">{comments}</div>
            <div className="text-xs text-gray-500">Comments</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Bookmark className="w-5 h-5 text-amber-600" />
          <div>
            <div className="text-lg font-bold text-gray-900">{bookmarks}</div>
            <div className="text-xs text-gray-500">Bookmarks</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Share2 className="w-5 h-5 text-green-600" />
          <div>
            <div className="text-lg font-bold text-gray-900">{shares}</div>
            <div className="text-xs text-gray-500">Shares</div>
          </div>
        </div>
      </div>
    </div>
  )
}
