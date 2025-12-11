"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import Header from "@/components/header"
import CollectionDetail from "@/components/collection-detail"
import CollectionStats from "@/components/collection-stats"
import { toast } from "sonner"
import type { Collection, Proverb, Profile } from "@/lib/types"
import type { Database } from "@/lib/database.types"
import { logger } from "@/lib/utils/logger"

type ProverbWithUser = Database["public"]["Tables"]["proverbs"]["Row"] & {
  profiles: Database["public"]["Tables"]["profiles"]["Row"] | null
  userName: string
  userAvatar: string
}

// Mock data
const mockCollections: Record<string, Collection> = {
  col1: {
    id: "col1",
    user_id: "user1",
    title: "Wisdom for Daily Life",
    description: "Essential proverbs that guide us through everyday challenges and decisions.",
    cover_image: "/placeholder.jpg",
    is_public: true,
    is_collaborative: false,
    contributors: ["user1"],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  col2: {
    id: "col2",
    user_id: "user5",
    title: "Ubuntu Philosophy",
    description: "Proverbs centered around community, unity, and interconnectedness.",
    cover_image: "/placeholder.jpg",
    is_public: true,
    is_collaborative: true,
    contributors: ["user5", "user1", "user3"],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
}

const mockProverbs: Record<string, ProverbWithUser> = {
  "1": {
    id: "1",
    user_id: "user1",
    proverb: "Se wo were fi na wosankofa a yenkyi",
    meaning: "It is not wrong to go back for that which you have forgotten.",
    context: null,
    country: "Ghana",
    language: "Twi",
    categories: ["Wisdom", "Learning"],
    audio_url: null,
    created_at: new Date(Date.now() - 86400000).toISOString(),
    updated_at: new Date(Date.now() - 86400000).toISOString(),
    is_verified: true,
    is_featured: false,
    views: 234,
    shares: 12,
    status: "approved",
    rejection_reason: null,
    profiles: {
      id: "user1",
      username: "Amara Kofi",
      email: "amara@example.com",
      bio: null,
      country: "Ghana",
      avatar_url: "/placeholder-user.jpg",
      points: 0,
      reputation_score: 0,
      is_admin: false,
      is_verified: false,
      is_suspended: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    userName: "Amara Kofi",
    userAvatar: "/placeholder-user.jpg",
  },
  "2": {
    id: "2",
    user_id: "user5",
    proverb: "Ubuntu ngumuntu ngabantu",
    meaning: "A person is a person through other people.",
    context: null,
    country: "South Africa",
    language: "Zulu",
    categories: ["Community", "Unity"],
    audio_url: null,
    created_at: new Date(Date.now() - 172800000).toISOString(),
    updated_at: new Date(Date.now() - 172800000).toISOString(),
    is_verified: true,
    is_featured: true,
    views: 456,
    shares: 34,
    status: "approved",
    rejection_reason: null,
    profiles: {
      id: "user5",
      username: "Zainab Hassan",
      email: "zainab@example.com",
      bio: null,
      country: "South Africa",
      avatar_url: "/placeholder-user.jpg",
      points: 0,
      reputation_score: 0,
      is_admin: false,
      is_verified: false,
      is_suspended: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    userName: "Zainab Hassan",
    userAvatar: "/placeholder-user.jpg",
  },
}

export default function CollectionDetailPage() {
  const params = useParams()
  const collectionId = params.collectionId as string
  const collection = mockCollections[collectionId as keyof typeof mockCollections]
  const [proverbs, setProverbs] = useState<ProverbWithUser[]>(
    collection ? [] : [], // Mock empty for now
  )
  const [currentUser] = useState<Profile | null>(null) // Mock current user

  if (!collection) {
    return (
      <>
        <Header />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900">Collection not found</h1>
          </div>
        </main>
      </>
    )
  }

  const handleEdit = () => {
    // Edit is handled by the modal in CollectionDetail component
  }

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this collection? This action cannot be undone.")) {
      try {
        // TODO: Implement actual API call to delete collection
        // await deleteCollection(collectionId)
        toast.success("Collection deleted successfully!")
        // Redirect to collections page
        window.location.href = "/collections"
      } catch (error) {
        logger.error("[v0] Delete collection error:", error)
        toast.error("Failed to delete collection")
      }
    }
  }

  const handleShare = async () => {
    try {
      const shareUrl = `${window.location.origin}/collections/${collectionId}`
      if (navigator.share) {
        await navigator.share({
          title: collection.title,
          text: `Check out this African proverb collection: ${collection.title}`,
          url: shareUrl,
        })
        toast.success("Collection shared successfully!")
      } else {
        await navigator.clipboard.writeText(shareUrl)
        toast.success("Link copied to clipboard!")
      }
    } catch (error) {
      logger.error("[v0] Share collection error:", error)
      toast.error("Failed to share collection")
    }
  }

  const handleAddProverbs = () => {
    toast.info("Add proverbs functionality coming soon!")
  }

  const handleUpdateCollection = (updatedCollection: Collection) => {
    // Update local state - in a real app, this would trigger a re-fetch or optimistic update
    // For now, we'll just show success message since the modal handles the toast
    logger.info("Collection updated:", updatedCollection)
  }

  return (
    <>
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <CollectionDetail
              collection={collection}
              proverbs={proverbs}
              currentUser={currentUser}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onShare={handleShare}
              onAddProverbs={handleAddProverbs}
              onUpdateCollection={handleUpdateCollection}
            />
          </div>

          {/* Sidebar with Stats */}
          <div className="lg:col-span-1">
            <CollectionStats
              collection={collection}
              viewCount={Math.floor(Math.random() * 1000) + 100} // Mock data
              likeCount={Math.floor(Math.random() * 200) + 10} // Mock data
              shareCount={Math.floor(Math.random() * 50) + 5} // Mock data
            />
          </div>
        </div>
      </main>
    </>
  )
}
