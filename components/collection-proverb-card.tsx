"use client"

import ProverbContent from "@/components/proverb-content"
import type { Proverb } from "@/lib/types"

interface CollectionProverbCardProps {
  proverb: Proverb
}

export default function CollectionProverbCard({ proverb }: CollectionProverbCardProps) {
  const author = proverb.profiles

  return (
    <article className="bg-white rounded-lg shadow-md border-l-4 border-orange-600 p-6 hover:shadow-lg transition" role="article" aria-label="Proverb">
      {/* Header */}
      <header className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-red-400 flex items-center justify-center text-white font-bold text-sm" aria-hidden="true">
          {author?.username?.substring(0, 2).toUpperCase() || "U"}
        </div>
        <div>
          <div className="font-semibold text-gray-900">{author?.username || "Anonymous"}</div>
          <div className="text-xs text-gray-500" aria-label={`From ${proverb.country} in ${proverb.language}`}>
            {proverb.country} • {proverb.language}
          </div>
        </div>
      </header>

      {/* Proverb Content */}
      <ProverbContent proverb={proverb} />

      {/* Stats */}
      <div className="flex items-center gap-4 text-sm text-gray-600 mt-4">
        <span>{proverb.views || 0} views</span>
        <span>{proverb.shares || 0} shares</span>
      </div>
    </article>
  )
}