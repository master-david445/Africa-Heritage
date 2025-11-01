"use client"

import { useState } from "react"
import Header from "@/components/header"
import ProverbCard from "@/components/proverb-card"
import { Button } from "@/components/ui/button"
import { Lock, Users, Share2, Edit, Trash2 } from "lucide-react"
import type { Collection, Proverb } from "@/lib/types"

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
    collection?.proverbs.map((id) => mockProverbs[id as keyof typeof mockProverbs]).filter(Boolean) || [],
  )

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

  return (
    <>
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Collection Header */}
        <div className="mb-8">
          <div className="bg-gradient-to-r from-orange-400 to-red-400 rounded-lg h-48 mb-6"></div>

          <div className="flex items-start justify-between mb-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold text-gray-900">{collection.title}</h1>
                {!collection.isPublic && <Lock className="w-6 h-6 text-gray-500" />}
              </div>
              <p className="text-gray-600 mb-4">{collection.description}</p>

              {/* Collection Info */}
              <div className="flex flex-wrap gap-6 text-sm text-gray-600">
                <div>
                  <span className="font-semibold text-gray-900">{proverbs.length}</span> proverbs
                </div>
                <div>
                  By <span className="font-semibold text-gray-900">{collection.userName}</span>
                </div>
                {collection.isCollaborative && (
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    <span>
                      <span className="font-semibold text-gray-900">{collection.contributors.length}</span> contributors
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 ml-4">
              <Button variant="outline" size="sm" className="flex items-center gap-2 bg-transparent">
                <Share2 className="w-4 h-4" />
                Share
              </Button>
              <Button variant="outline" size="sm" className="flex items-center gap-2 bg-transparent">
                <Edit className="w-4 h-4" />
                Edit
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-2 text-red-600 hover:text-red-700 bg-transparent"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Contributors */}
          {collection.isCollaborative && collection.contributors.length > 0 && (
            <div className="bg-orange-50 rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-gray-900 mb-3">Contributors</h3>
              <div className="flex flex-wrap gap-3">
                {collection.contributors.map((contributor) => (
                  <div key={contributor} className="flex items-center gap-2 bg-white rounded-full px-3 py-1">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-orange-400 to-red-400 flex items-center justify-center text-white font-bold text-xs">
                      {contributor.substring(0, 1).toUpperCase()}
                    </div>
                    <span className="text-sm text-gray-700">{contributor}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Proverbs */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Proverbs in this collection</h2>
          {proverbs.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-12 text-center">
              <p className="text-gray-500 text-lg">No proverbs in this collection yet.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {proverbs.map((proverb) => (
                <ProverbCard key={proverb.id} proverb={proverb} />
              ))}
            </div>
          )}
        </div>
      </main>
    </>
  )
}
