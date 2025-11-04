"use client"

import { useState, useEffect } from "react"
import Header from "@/components/header"
import ProverbCard from "@/components/proverb-card"
import { Button } from "@/components/ui/button"
import { Sparkles, TrendingUp, Heart } from "lucide-react"
import { getAllProverbs } from "@/app/actions/proverbs"
import { Skeleton } from "@/components/ui/skeleton"
import { useAuth } from "@/lib/auth-context"
import type { Proverb } from "@/lib/types"

export default function ExplorePage() {
  const [activeTab, setActiveTab] = useState<"featured" | "trending" | "popular">("featured")
  const [proverbs, setProverbs] = useState<Proverb[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { profile: currentUser } = useAuth()

  useEffect(() => {
    async function fetchProverbs() {
      try {
        setLoading(true)
        setError(null)
        const data = await getAllProverbs(50) // Fetch more proverbs for explore page
        setProverbs(data)
      } catch (err) {
        setError("Failed to load proverbs")
        console.error("Error fetching proverbs:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchProverbs()
  }, [])

  const featuredProverbs = proverbs.filter((p) => p.is_featured)
  const trendingProverbs = [...proverbs].sort((a, b) => b.views - a.views)
  const popularProverbs = [...proverbs].sort((a, b) => (b.likes_count || 0) - (a.likes_count || 0))

  const displayProverbs =
    activeTab === "featured" ? featuredProverbs : activeTab === "trending" ? trendingProverbs : popularProverbs

  return (
    <>
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Explore African Wisdom</h1>
          <p className="text-lg text-gray-600 mb-8">
            Discover proverbs from across Africa, curated by our community of wisdom keepers.
          </p>
        </div>

        {/* Discovery Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-gradient-to-br from-orange-100 to-red-100 rounded-lg shadow-md p-6 border-l-4 border-orange-600">
            <div className="flex items-center gap-3 mb-3">
              <Sparkles className="w-6 h-6 text-orange-600" />
              <h3 className="font-serif text-lg font-bold text-gray-900">Featured</h3>
            </div>
            <p className="text-gray-700 mb-4">Handpicked proverbs from our editorial team</p>
            <Button
              onClick={() => setActiveTab("featured")}
              className={`w-full ${activeTab === "featured" ? "bg-orange-600 text-white" : "bg-white text-orange-600 border border-orange-600"}`}
            >
              View Featured
            </Button>
          </div>

          <div className="bg-gradient-to-br from-blue-100 to-cyan-100 rounded-lg shadow-md p-6 border-l-4 border-blue-600">
            <div className="flex items-center gap-3 mb-3">
              <TrendingUp className="w-6 h-6 text-blue-600" />
              <h3 className="font-serif text-lg font-bold text-gray-900">Trending</h3>
            </div>
            <p className="text-gray-700 mb-4">Most viewed proverbs this week</p>
            <Button
              onClick={() => setActiveTab("trending")}
              className={`w-full ${activeTab === "trending" ? "bg-blue-600 text-white" : "bg-white text-blue-600 border border-blue-600"}`}
            >
              View Trending
            </Button>
          </div>

          <div className="bg-gradient-to-br from-red-100 to-pink-100 rounded-lg shadow-md p-6 border-l-4 border-red-600">
            <div className="flex items-center gap-3 mb-3">
              <Heart className="w-6 h-6 text-red-600" />
              <h3 className="font-serif text-lg font-bold text-gray-900">Popular</h3>
            </div>
            <p className="text-gray-700 mb-4">Most liked proverbs by the community</p>
            <Button
              onClick={() => setActiveTab("popular")}
              className={`w-full ${activeTab === "popular" ? "bg-red-600 text-white" : "bg-white text-red-600 border border-red-600"}`}
            >
              View Popular
            </Button>
          </div>
        </div>

        {/* Proverbs Grid */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6 capitalize">
            {activeTab === "featured"
              ? "Featured Proverbs"
              : activeTab === "trending"
                ? "Trending Proverbs"
                : "Popular Proverbs"}
          </h2>
          <div className="space-y-4">
            {loading ? (
              // Loading skeletons
              Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Skeleton className="w-10 h-10 rounded-full" />
                    <div>
                      <Skeleton className="h-4 w-24 mb-1" />
                      <Skeleton className="h-3 w-16" />
                    </div>
                  </div>
                  <Skeleton className="h-6 w-full mb-2" />
                  <Skeleton className="h-4 w-3/4 mb-4" />
                  <div className="flex gap-4">
                    <Skeleton className="h-8 w-16" />
                    <Skeleton className="h-8 w-16" />
                    <Skeleton className="h-8 w-16" />
                  </div>
                </div>
              ))
            ) : error ? (
              <div className="bg-red-50 rounded-lg shadow-md p-12 text-center">
                <p className="text-red-600 text-lg">{error}</p>
                <Button
                  onClick={() => window.location.reload()}
                  className="mt-4"
                  variant="outline"
                >
                  Try Again
                </Button>
              </div>
            ) : displayProverbs.length === 0 ? (
              <div className="bg-white rounded-lg shadow-md p-12 text-center">
                <p className="text-gray-500 text-lg">No proverbs in this category yet.</p>
              </div>
            ) : (
              displayProverbs.map((proverb) => (
                <ProverbCard key={proverb.id} proverb={proverb} currentUser={currentUser} />
              ))
            )}
          </div>
        </div>
      </main>
    </>
  )
}
