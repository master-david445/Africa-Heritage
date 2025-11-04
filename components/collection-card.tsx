"use client"

import { Lock, Users } from "lucide-react"
import Link from "next/link"
import type { Collection } from "@/lib/types"

interface CollectionCardProps {
  collection: Collection
}

export default function CollectionCard({ collection }: CollectionCardProps) {
  return (
    <Link href={`/collections/${collection.id}`}>
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition cursor-pointer h-full">
        {/* Cover Image */}
        <div className="h-40 bg-gradient-to-br from-orange-400 to-red-400"></div>

        {/* Content */}
        <div className="p-6">
          <div className="flex items-start justify-between mb-2">
            <h3 className="font-serif text-lg font-bold text-gray-900 flex-1">{collection.title}</h3>
            {!collection.is_public && <Lock className="w-4 h-4 text-gray-500 flex-shrink-0" />}
          </div>

          <p className="text-sm text-gray-600 mb-4 line-clamp-2">{collection.description}</p>

          {/* Stats */}
          <div className="flex items-center justify-between text-sm text-gray-500 mb-4 pb-4 border-b border-gray-200">
            <span>{Math.floor(Math.random() * 20)} proverbs</span>
            {collection.is_collaborative && (
              <div className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                {collection.contributors.length}
              </div>
            )}
          </div>

          {/* Creator */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-400 to-red-400 flex items-center justify-center text-white font-bold text-xs">
              {collection.user_id.substring(0, 2).toUpperCase()}
            </div>
            <div className="text-sm">
              <div className="font-semibold text-gray-900">By {collection.user_id}</div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}