"use client"

import { useState, useEffect } from "react"
import ProverbCard from "@/components/proverb-card"
import ProverbCardSkeleton from "@/components/proverb-card-skeleton"
import SocialStats from "@/components/social-stats"
import CreateProverbModal from "@/components/create-proverb-modal"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { getAllProverbs } from "@/app/actions/proverbs"
import type { Proverb, Profile } from "@/lib/types"

interface ProverbFeedProps {
  initialProverbs: Proverb[]
  currentUser: Profile | null
}

export default function ProverbFeed({ initialProverbs, currentUser }: ProverbFeedProps) {
  const [proverbs, setProverbs] = useState<Proverb[]>(initialProverbs)
  const [isLoading, setIsLoading] = useState(false)
  const [hasMore, setHasMore] = useState(initialProverbs.length === 20)
  const [error, setError] = useState<string | null>(null)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)

  useEffect(() => {
    setProverbs(initialProverbs)
  }, [initialProverbs])

  const handleCreateProverb = () => {
    setIsCreateModalOpen(true)
  }

  const handleProverbCreated = async () => {
    // Refresh the feed
    setIsLoading(true)
    try {
      const newProverbs = await getAllProverbs(20, 0)
      setProverbs(newProverbs)
      setHasMore(newProverbs.length === 20)
    } catch (error) {
      console.error("Error refreshing proverbs:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleLoadMore = async () => {
    if (isLoading || !hasMore) return

    setIsLoading(true)
    setError(null)
    try {
      const newProverbs = await getAllProverbs(20, proverbs.length)
      setProverbs(prev => [...prev, ...newProverbs])
      setHasMore(newProverbs.length === 20)
    } catch (error) {
      console.error("[v0] Error loading more proverbs:", error)
      setError("Failed to load more proverbs. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8" role="main" aria-label="Proverb feed">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Feed */}
        <div className="lg:col-span-2 space-y-6">
          {/* Post Proverb Button */}
          {currentUser && (
            <section className="bg-white rounded-lg shadow-md p-6" aria-labelledby="create-proverb-heading">
              <h2 id="create-proverb-heading" className="sr-only">Create new proverb</h2>
              <Button
                onClick={handleCreateProverb}
                className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white"
                aria-label="Share a new proverb"
              >
                Share a Proverb
              </Button>
            </section>
          )}

          {/* Proverb Feed */}
          <section aria-labelledby="proverbs-heading">
            <h2 id="proverbs-heading" className="sr-only">Proverbs</h2>
            <div className="space-y-4">
              {proverbs.length > 0 ? (
                <>
                  {proverbs.map((proverb) => (
                    <ProverbCard key={proverb.id} proverb={proverb} currentUser={currentUser} />
                  ))}

                  {/* Load More Button */}
                  {hasMore && (
                    <div className="text-center py-6">
                      <Button
                        onClick={handleLoadMore}
                        disabled={isLoading}
                        variant="outline"
                        className="min-w-[120px]"
                        aria-label="Load more proverbs"
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Loading...
                          </>
                        ) : (
                          "Load More"
                        )}
                      </Button>
                    </div>
                  )}

                  {/* Error Message */}
                  {error && (
                    <div className="text-center py-4">
                      <p className="text-red-600 text-sm">{error}</p>
                      <Button
                        onClick={handleLoadMore}
                        variant="outline"
                        size="sm"
                        className="mt-2"
                        aria-label="Retry loading more proverbs"
                      >
                        Try Again
                      </Button>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-12 text-gray-500" role="status">
                  <p className="text-lg mb-2">No proverbs yet</p>
                  <p>Be the first to share wisdom from African heritage!</p>
                </div>
              )}
            </div>
          </section>
        </div>

        {/* Sidebar */}
        <aside className="space-y-6" aria-label="Sidebar">
          {/* Social Stats */}
          <SocialStats />

          {/* Trending */}
          <section className="bg-white rounded-lg shadow-md p-6" aria-labelledby="trending-heading">
            <h3 id="trending-heading" className="font-serif text-lg font-bold mb-4 text-gray-900">Trending</h3>
            <nav aria-label="Trending categories">
              <div className="space-y-3">
                {["Wisdom", "Family", "Unity", "Success"].map((tag) => (
                  <button
                    key={tag}
                    className="block w-full text-left px-3 py-2 rounded hover:bg-orange-50 transition text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
                    aria-label={`View proverbs tagged with ${tag}`}
                  >
                    #{tag}
                  </button>
                ))}
              </div>
            </nav>
          </section>
        </aside>
      </div>

      <CreateProverbModal
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
        onSuccess={handleProverbCreated}
      />
    </main>
  )
}
