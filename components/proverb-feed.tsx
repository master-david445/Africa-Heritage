"use client"

import { useState } from "react"
import ProverbCard from "@/components/proverb-card"
import SocialStats from "@/components/social-stats"
import { Button } from "@/components/ui/button"
import type { Database } from "@/lib/database.types"

type Profile = Database["public"]["Tables"]["profiles"]["Row"]
type Proverb = Database["public"]["Tables"]["proverbs"]["Row"] & {
  profiles: Profile | null
  likes?: any[]
  comments?: any[]
  bookmarks?: any[]
}

interface ProverbFeedProps {
  initialProverbs: Proverb[]
  currentUser: Profile | null
}

export default function ProverbFeed({ initialProverbs, currentUser }: ProverbFeedProps) {
  const [proverbs, setProverbs] = useState<Proverb[]>(initialProverbs)
  const [isLoading, setIsLoading] = useState(false)

  const handleCreateProverb = () => {
    // This will be connected to a modal for creating proverbs
    console.log("Create proverb")
  }

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Feed */}
        <div className="lg:col-span-2 space-y-6">
          {/* Post Proverb Button */}
          {currentUser && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <Button
                onClick={handleCreateProverb}
                className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white"
              >
                Share a Proverb
              </Button>
            </div>
          )}

          {/* Proverb Feed */}
          <div className="space-y-4">
            {proverbs.length > 0 ? (
              proverbs.map((proverb) => <ProverbCard key={proverb.id} proverb={proverb} currentUser={currentUser} />)
            ) : (
              <div className="text-center py-8 text-gray-500">No proverbs yet. Be the first to share one!</div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Social Stats */}
          <SocialStats proverbs={proverbs} />

          {/* Trending */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="font-serif text-lg font-bold mb-4 text-gray-900">Trending</h3>
            <div className="space-y-3">
              {["Wisdom", "Family", "Unity", "Success"].map((tag) => (
                <button
                  key={tag}
                  className="block w-full text-left px-3 py-2 rounded hover:bg-orange-50 transition text-gray-700"
                >
                  #{tag}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
