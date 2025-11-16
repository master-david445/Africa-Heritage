"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
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
  const [retryCount, setRetryCount] = useState(0)
  // Removed authChecked state - simplified logic
  const { user, profile: currentUser, isLoading: authLoading } = useAuth()
  const router = useRouter()

  const fetchProverbs = async (attempt = 0) => {
    try {
      setLoading(true)
      setError(null)
      console.log(`[EXPLORE] Fetching proverbs (attempt ${attempt + 1})`)

      const data = await getAllProverbs(20) // Initial load of 20 proverbs
      setProverbs(data)
      setRetryCount(0) // Reset retry count on success
    } catch (err) {
      console.error(`[EXPLORE] Error fetching proverbs (attempt ${attempt + 1}):`, err)

      // Retry logic for mobile devices
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
      const maxRetries = isMobile ? 3 : 1

      if (attempt < maxRetries) {
        console.log(`[EXPLORE] Retrying in 2 seconds... (${attempt + 1}/${maxRetries})`)
        setRetryCount(attempt + 1)
        setTimeout(() => fetchProverbs(attempt + 1), 2000)
        return
      }

      setError("Failed to load proverbs. Please check your connection and try again.")
      setRetryCount(0)
    } finally {
      setLoading(false)
    }
  }

  // Handle authentication and redirects
  useEffect(() => {
    // If auth is still loading, wait
    if (authLoading) return

    // If no user after auth check completes, redirect to login
    if (!user) {
      console.log("[EXPLORE] No authenticated user, redirecting to login")
      router.push("/auth/login")
      return
    }

    // If user is authenticated, fetch proverbs
    fetchProverbs()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authLoading, user])

  // Show loading state while checking authentication
  if (authLoading) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">Explore African Wisdom</h1>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Checking authentication...
              </p>
              <div className="mt-8 flex justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
              </div>
            </div>
          </div>
        </main>
      </>
    )
  }

  // If not authenticated, this component won't render due to redirect in useEffect
  // But add a fallback just in case
  if (!user) {
    return null
  }

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
              <div className="bg-red-50 rounded-lg shadow-md p-6 sm:p-12 text-center">
                <div className="text-red-600 mb-4">
                  <p className="text-lg font-semibold mb-2">Unable to Load Proverbs</p>
                  <p className="text-sm sm:text-base">{error}</p>
                  {retryCount > 0 && (
                    <p className="text-xs text-gray-600 mt-2">
                      Retried {retryCount} time{retryCount > 1 ? 's' : ''}
                    </p>
                  )}
                </div>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <button
                    onClick={() => fetchProverbs()}
                    className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
                  >
                    Try Again
                  </button>
                  <button
                    onClick={() => window.location.reload()}
                    className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    Reload Page
                  </button>
                </div>
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
