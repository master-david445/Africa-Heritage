"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth-context"
import { getProverbOfTheDay } from "@/app/actions/proverbs"
import ProverbContent from "@/components/proverb-content"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import type { Proverb, Profile } from "@/lib/types"

export default function ProverbOfTheDay() {
  const [proverb, setProverb] = useState<Proverb | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { profile: currentUser } = useAuth()

  useEffect(() => {
    async function fetchProverbOfTheDay() {
      try {
        setLoading(true)
        setError(null)
        const data = await getProverbOfTheDay()
        setProverb(data)
      } catch (err) {
        setError("Failed to load proverb of the day")
        console.error("Error fetching proverb of the day:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchProverbOfTheDay()
  }, [])

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl shadow-lg border-2 border-amber-200 p-8 relative overflow-hidden">
        {/* Decorative background pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-4 right-4 w-20 h-20 border-4 border-amber-300 rounded-full"></div>
          <div className="absolute bottom-4 left-4 w-16 h-16 border-4 border-orange-300 rounded-full"></div>
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-6">
            <Skeleton className="w-8 h-8 rounded-full" />
            <div>
              <Skeleton className="h-5 w-32 mb-1" />
              <Skeleton className="h-4 w-24" />
            </div>
          </div>

          <Skeleton className="h-8 w-full mb-4" />
          <Skeleton className="h-6 w-3/4 mb-6" />

          <div className="flex items-center gap-4">
            <Skeleton className="h-6 w-16" />
            <Skeleton className="h-6 w-16" />
            <Skeleton className="h-6 w-16" />
          </div>
        </div>
      </div>
    )
  }

  if (error || !proverb) {
    return (
      <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl shadow-lg border-2 border-amber-200 p-8 text-center">
        <p className="text-amber-700 text-lg">{error || "No proverb available today"}</p>
      </div>
    )
  }

  const author = proverb.profiles

  return (
    <article className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl shadow-lg border-2 border-amber-200 p-8 relative overflow-hidden" role="article" aria-label="Proverb of the day">
      {/* Decorative background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-4 right-4 w-20 h-20 border-4 border-amber-300 rounded-full"></div>
        <div className="absolute bottom-4 left-4 w-16 h-16 border-4 border-orange-300 rounded-full"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 border-2 border-amber-200 rounded-full"></div>
      </div>

      {/* Proverb of the Day Badge */}
      <div className="absolute top-4 left-4 z-20">
        <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold px-3 py-1 text-sm shadow-md">
          🌟 Proverb of the Day
        </Badge>
      </div>

      <div className="relative z-10">
        {/* Header */}
        <header className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-400 to-orange-400 flex items-center justify-center text-white font-bold text-lg shadow-md" aria-hidden="true">
            {author?.username?.substring(0, 2).toUpperCase() || "U"}
          </div>
          <div>
            <div className="font-bold text-gray-900 text-lg">{author?.username || "Anonymous"}</div>
            <div className="text-sm text-gray-600" aria-label={`From ${proverb.country} in ${proverb.language}`}>
              {proverb.country} • {proverb.language}
            </div>
          </div>
        </header>

        {/* Proverb Content - Larger text */}
        <div className="mb-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">What does this proverb mean?</h3>
          <div className="text-lg leading-relaxed">
            <ProverbContent proverb={proverb} />
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center justify-between text-sm text-gray-600 border-t border-amber-200 pt-4">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1">
              <span className="font-medium">{proverb.likes_count || 0}</span> likes
            </span>
            <span className="flex items-center gap-1">
              <span className="font-medium">{proverb.comments_count || 0}</span> comments
            </span>
            <span className="flex items-center gap-1">
              <span className="font-medium">{proverb.views || 0}</span> views
            </span>
          </div>
        </div>
      </div>
    </article>
  )
}