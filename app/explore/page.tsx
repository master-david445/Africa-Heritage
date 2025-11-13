"use client"

import { useState, useEffect } from "react"
import Header from "@/components/header"
import ProverbOfTheDay from "@/components/proverb-of-the-day"
import SearchBar from "@/components/search-bar"
import ProverbFeed from "@/components/proverb-feed"
import CategoryCards from "@/components/category-cards"
import { getAllProverbs } from "@/app/actions/proverbs"
import { useAuth } from "@/lib/auth-context"
import type { Proverb } from "@/lib/types"

export default function ExplorePage() {
  const [proverbs, setProverbs] = useState<Proverb[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { profile: currentUser } = useAuth()

  useEffect(() => {
    async function fetchProverbs() {
      try {
        setLoading(true)
        setError(null)
        const data = await getAllProverbs(20) // Initial load of 20 proverbs
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

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Explore African Wisdom</h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Discover timeless proverbs from across Africa, passed down through generations of wisdom keepers.
            </p>
          </div>

          {/* Proverb of the Day */}
          <section className="mb-12" aria-labelledby="proverb-of-day-heading">
            <h2 id="proverb-of-day-heading" className="sr-only">Proverb of the Day</h2>
            <ProverbOfTheDay />
          </section>

          {/* Search Bar */}
          <section className="mb-12" aria-labelledby="search-heading">
            <h2 id="search-heading" className="sr-only">Search Proverbs</h2>
            <div className="flex justify-center">
              <SearchBar />
            </div>
          </section>

          {/* All Proverbs Feed */}
          <section aria-labelledby="all-proverbs-heading">
            <h2 id="all-proverbs-heading" className="text-2xl font-bold text-gray-900 mb-8">All Proverbs</h2>
            {loading ? (
              <div className="space-y-6">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse" />
                      <div>
                        <div className="h-4 bg-gray-200 rounded w-24 mb-1 animate-pulse" />
                        <div className="h-3 bg-gray-200 rounded w-16 animate-pulse" />
                      </div>
                    </div>
                    <div className="h-6 bg-gray-200 rounded w-full mb-2 animate-pulse" />
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-4 animate-pulse" />
                    <div className="flex gap-4">
                      <div className="h-8 bg-gray-200 rounded w-16 animate-pulse" />
                      <div className="h-8 bg-gray-200 rounded w-16 animate-pulse" />
                      <div className="h-8 bg-gray-200 rounded w-16 animate-pulse" />
                    </div>
                  </div>
                ))}
              </div>
            ) : error ? (
              <div className="bg-red-50 rounded-lg shadow-md p-12 text-center">
                <p className="text-red-600 text-lg mb-4">{error}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Try Again
                </button>
              </div>
            ) : (
              <ProverbFeed initialProverbs={proverbs} currentUser={currentUser} />
            )}
          </section>

          {/* Category Cards */}
          <section className="mt-16" aria-labelledby="categories-heading">
            <h2 id="categories-heading" className="text-2xl font-bold text-gray-900 mb-8 text-center">Explore by Category</h2>
            <CategoryCards />
          </section>
        </div>
      </main>
    </>
  )
}
