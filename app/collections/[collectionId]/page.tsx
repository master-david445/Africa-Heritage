"use client"

import { useState } from "react"
import Header from "@/components/header"
import CollectionDetail from "@/components/collection-detail"
import CollectionStats from "@/components/collection-stats"
import { toast } from "sonner"
import type { Collection, Proverb, Profile } from "@/lib/types"

// Mock data
const mockCollections: Record<string, Collection> = {
  col1: {
    id: "col1",
    userId: "user1",
    userName: "Amara Kofi",
    title: "Wisdom for Daily Life",
    description: "Essential proverbs that guide us through everyday challenges and decisions.",
    coverImage: "/placeholder.jpg",
    proverbs: ["1", "2", "3"],
    isPublic: true,
    isCollaborative: false,
    contributors: ["user1"],
  },
  col2: {
    id: "col2",
    userId: "user5",
    userName: "Zainab Hassan",
    title: "Ubuntu Philosophy",
    description: "Proverbs centered around community, unity, and interconnectedness.",
    coverImage: "/placeholder.jpg",
    proverbs: ["2", "5"],
    isPublic: true,
    isCollaborative: true,
    contributors: ["user5", "user1", "user3"],
  },
}

const mockProverbs: Record<string, Proverb> = {
  "1": {
    id: "1",
    userId: "user1",
    userName: "Amara Kofi",
    userAvatar: "/placeholder-user.jpg",
    proverb: "Se wo were fi na wosankofa a yenkyi",
    meaning: "It is not wrong to go back for that which you have forgotten.",
    country: "Ghana",
    language: "Twi",
    categories: ["Wisdom", "Learning"],
    timestamp: new Date(Date.now() - 86400000),
    likes: ["user2", "user3"],
    comments: [],
    bookmarks: ["user4"],
    reactions: {},
    views: 234,
    shares: 12,
    isVerified: true,
    isFeatured: false,
  },
  "2": {
    id: "2",
    userId: "user5",
    userName: "Zainab Hassan",
    userAvatar: "/placeholder-user.jpg",
    proverb: "Ubuntu ngumuntu ngabantu",
    meaning: "A person is a person through other people.",
    country: "South Africa",
    language: "Zulu",
    categories: ["Community", "Unity"],
    timestamp: new Date(Date.now() - 172800000),
    likes: ["user1", "user2", "user3", "user6"],
    comments: [],
    bookmarks: ["user2", "user7"],
    reactions: {},
    views: 456,
    shares: 34,
    isVerified: true,
    isFeatured: true,
  },
  "3": {
    id: "3",
    userId: "user8",
    userName: "Chidi Okafor",
    userAvatar: "/placeholder-user.jpg",
    proverb: "A single hand cannot tie a bundle",
    meaning: "Cooperation and teamwork are essential for success.",
    country: "Nigeria",
    language: "Igbo",
    categories: ["Teamwork", "Success"],
    timestamp: new Date(Date.now() - 259200000),
    likes: ["user1", "user3"],
    comments: [],
    bookmarks: ["user5", "user9"],
    reactions: {},
    views: 189,
    shares: 8,
    isVerified: false,
    isFeatured: false,
  },
  "5": {
    id: "5",
    userId: "user9",
    userName: "Amina Diallo",
    userAvatar: "/placeholder-user.jpg",
    proverb: "The lion does not turn around when a small dog barks",
    meaning: "Do not be distracted by insignificant matters.",
    country: "Mali",
    language: "Bambara",
    categories: ["Wisdom", "Focus"],
    timestamp: new Date(Date.now() - 432000000),
    likes: ["user2", "user6"],
    comments: [],
    bookmarks: ["user1", "user8"],
    reactions: {},
    views: 267,
    shares: 15,
    isVerified: false,
    isFeatured: false,
  },
}

export default function CollectionDetailPage({ params }: { params: { collectionId: string } }) {
  const collectionId = params.collectionId
  const collection = mockCollections[collectionId as keyof typeof mockCollections]
  const [proverbs, setProverbs] = useState<Proverb[]>(
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
        console.error("[v0] Delete collection error:", error)
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
      console.error("[v0] Share collection error:", error)
      toast.error("Failed to share collection")
    }
  }

  const handleAddProverbs = () => {
    toast.info("Add proverbs functionality coming soon!")
  }

  const handleUpdateCollection = (updatedCollection: Collection) => {
    // Update local state - in a real app, this would trigger a re-fetch or optimistic update
    // For now, we'll just show success message since the modal handles the toast
    console.log("Collection updated:", updatedCollection)
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
