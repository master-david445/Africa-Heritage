"use client"

import { Eye, Heart, Share2, Users, Calendar } from "lucide-react"
import type { Collection } from "@/lib/types"

interface CollectionStatsProps {
  collection: Collection
  viewCount?: number
  likeCount?: number
  shareCount?: number
}

export default function CollectionStats({
  collection,
  viewCount = 0,
  likeCount = 0,
  shareCount = 0,
}: CollectionStatsProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Collection Statistics</h3>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Views */}
        <div className="text-center">
          <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mx-auto mb-2">
            <Eye className="w-6 h-6 text-blue-600" />
          </div>
          <div className="text-2xl font-bold text-gray-900">{viewCount.toLocaleString()}</div>
          <div className="text-sm text-gray-600">Views</div>
        </div>

        {/* Likes */}
        <div className="text-center">
          <div className="flex items-center justify-center w-12 h-12 bg-red-100 rounded-full mx-auto mb-2">
            <Heart className="w-6 h-6 text-red-600" />
          </div>
          <div className="text-2xl font-bold text-gray-900">{likeCount.toLocaleString()}</div>
          <div className="text-sm text-gray-600">Likes</div>
        </div>

        {/* Shares */}
        <div className="text-center">
          <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mx-auto mb-2">
            <Share2 className="w-6 h-6 text-green-600" />
          </div>
          <div className="text-2xl font-bold text-gray-900">{shareCount.toLocaleString()}</div>
          <div className="text-sm text-gray-600">Shares</div>
        </div>

        {/* Contributors */}
        <div className="text-center">
          <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-full mx-auto mb-2">
            <Users className="w-6 h-6 text-purple-600" />
          </div>
          <div className="text-2xl font-bold text-gray-900">{collection.contributors.length}</div>
          <div className="text-sm text-gray-600">Contributors</div>
        </div>
      </div>

      {/* Additional Info */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            <span>Created {formatDate(collection.created_at)}</span>
          </div>
          {collection.updated_at !== collection.created_at && (
            <div className="flex items-center gap-2">
              <span>Updated {formatDate(collection.updated_at)}</span>
            </div>
          )}
        </div>

        {/* Privacy Status */}
        <div className="mt-2 flex items-center gap-4 text-sm">
          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
            collection.is_public
              ? 'bg-green-100 text-green-800'
              : 'bg-gray-100 text-gray-800'
          }`}>
            {collection.is_public ? 'Public' : 'Private'}
          </span>
          {collection.is_collaborative && (
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              Collaborative
            </span>
          )}
        </div>
      </div>
    </div>
  )
}