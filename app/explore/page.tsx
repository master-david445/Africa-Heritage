"use client"

import { useState } from "react"
import Header from "@/components/header"
import ProverbCard from "@/components/proverb-card"
import { Button } from "@/components/ui/button"
import { Sparkles, TrendingUp, Heart } from "lucide-react"
import type { Proverb } from "@/lib/types"

// Mock proverbs
const allProverbs: Proverb[] = [
  {
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
  {
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
  {
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
  {
    id: "4",
    userId: "user2",
    userName: "Kwame Mensah",
    userAvatar: "/placeholder-user.jpg",
    proverb: "When the root is deep, there is no reason to fear the wind",
    meaning: "Strong foundations provide security and stability.",
    country: "Ghana",
    language: "Akan",
    categories: ["Strength", "Foundation"],
    timestamp: new Date(Date.now() - 345600000),
    likes: ["user1", "user4", "user5"],
    comments: [],
    bookmarks: ["user3"],
    reactions: {},
    views: 312,
    shares: 18,
    isVerified: true,
    isFeatured: false,
  },
  {
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
]

export default function ExplorePage() {
  const [activeTab, setActiveTab] = useState<"featured" | "trending" | "popular">("featured")

  const featuredProverbs = allProverbs.filter((p) => p.isFeatured)
  const trendingProverbs = [...allProverbs].sort((a, b) => b.views - a.views)
  const popularProverbs = [...allProverbs].sort((a, b) => b.likes.length - a.likes.length)

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
            {displayProverbs.length === 0 ? (
              <div className="bg-white rounded-lg shadow-md p-12 text-center">
                <p className="text-gray-500 text-lg">No proverbs in this category yet.</p>
              </div>
            ) : (
              displayProverbs.map((proverb) => <ProverbCard key={proverb.id} proverb={proverb} />)
            )}
          </div>
        </div>
      </main>
    </>
  )
}
