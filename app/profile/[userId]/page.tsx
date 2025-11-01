"use client"

import { useState } from "react"
import Header from "@/components/header"
import UserProfileCard from "@/components/user-profile-card"
import FollowersList from "@/components/followers-list"
import ProverbCard from "@/components/proverb-card"
import BadgeShowcase from "@/components/badge-showcase"
import PointsTracker from "@/components/points-tracker"
import { useAuth } from "@/lib/auth-context"
import type { User, Proverb } from "@/lib/types"

// Mock user data
const mockUsers: Record<string, User> = {
  user1: {
    id: "user1",
    name: "Amara Kofi",
    email: "amara@example.com",
    bio: "Passionate about preserving African wisdom and culture",
    country: "Ghana",
    avatar: "/placeholder-user.jpg",
    joinedDate: new Date("2023-01-15"),
    proverbsCount: 24,
    followersCount: 342,
    followingCount: 128,
    points: 1250,
    badges: [
      { id: "b1", name: "Contributor", description: "Shared 10+ proverbs", icon: "🌟" },
      { id: "b2", name: "Community Leader", description: "500+ followers", icon: "👑" },
    ],
    isAdmin: false,
    isVerified: true,
    isSuspended: false,
  },
  user2: {
    id: "user2",
    name: "Kwame Mensah",
    email: "kwame@example.com",
    bio: "Collector of West African proverbs",
    country: "Ghana",
    avatar: "/placeholder-user.jpg",
    joinedDate: new Date("2023-03-20"),
    proverbsCount: 15,
    followersCount: 89,
    followingCount: 45,
    points: 650,
    badges: [],
    isAdmin: false,
    isVerified: false,
    isSuspended: false,
  },
  user5: {
    id: "user5",
    name: "Zainab Hassan",
    email: "zainab@example.com",
    bio: "Documenting East African wisdom traditions",
    country: "Kenya",
    avatar: "/placeholder-user.jpg",
    joinedDate: new Date("2023-02-10"),
    proverbsCount: 31,
    followersCount: 215,
    followingCount: 92,
    points: 1100,
    badges: [{ id: "b3", name: "Top Contributor", description: "30+ proverbs shared", icon: "🏆" }],
    isAdmin: false,
    isVerified: true,
    isSuspended: false,
  },
}

// Mock proverbs for user
const mockUserProverbs: Record<string, Proverb[]> = {
  user1: [
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
  ],
}

// Mock followers/following
const mockFollowers: Record<string, User[]> = {
  user1: [mockUsers.user2, mockUsers.user5],
}

const mockFollowing: Record<string, User[]> = {
  user1: [mockUsers.user5],
}

export default function ProfilePage({ params }: { params: { userId: string } }) {
  const { user: currentUser } = useAuth()
  const userId = params.userId
  const profileUser = mockUsers[userId as keyof typeof mockUsers]
  const userProverbs = mockUserProverbs[userId as keyof typeof mockUserProverbs] || []
  const followers = mockFollowers[userId as keyof typeof mockFollowers] || []
  const following = mockFollowing[userId as keyof typeof mockFollowing] || []

  const [activeTab, setActiveTab] = useState<"proverbs" | "followers" | "following" | "achievements">("proverbs")

  if (!profileUser) {
    return (
      <>
        <Header />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900">User not found</h1>
          </div>
        </main>
      </>
    )
  }

  const isOwnProfile = currentUser?.id === userId

  return (
    <>
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <UserProfileCard user={profileUser} isOwnProfile={isOwnProfile} />
            {isOwnProfile && (
              <div className="mt-6">
                <PointsTracker currentPoints={profileUser.points} nextMilestone={1500} />
              </div>
            )}
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Tabs */}
            <div className="flex gap-4 mb-6 border-b border-gray-200 overflow-x-auto">
              <button
                onClick={() => setActiveTab("proverbs")}
                className={`px-4 py-2 font-semibold transition whitespace-nowrap ${
                  activeTab === "proverbs"
                    ? "text-orange-600 border-b-2 border-orange-600"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Proverbs ({userProverbs.length})
              </button>
              <button
                onClick={() => setActiveTab("followers")}
                className={`px-4 py-2 font-semibold transition whitespace-nowrap ${
                  activeTab === "followers"
                    ? "text-orange-600 border-b-2 border-orange-600"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Followers ({followers.length})
              </button>
              <button
                onClick={() => setActiveTab("following")}
                className={`px-4 py-2 font-semibold transition whitespace-nowrap ${
                  activeTab === "following"
                    ? "text-orange-600 border-b-2 border-orange-600"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Following ({following.length})
              </button>
              <button
                onClick={() => setActiveTab("achievements")}
                className={`px-4 py-2 font-semibold transition whitespace-nowrap ${
                  activeTab === "achievements"
                    ? "text-orange-600 border-b-2 border-orange-600"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Achievements
              </button>
            </div>

            {/* Tab Content */}
            {activeTab === "proverbs" && (
              <div className="space-y-4">
                {userProverbs.length === 0 ? (
                  <div className="bg-white rounded-lg shadow-md p-8 text-center">
                    <p className="text-gray-500">No proverbs shared yet</p>
                  </div>
                ) : (
                  userProverbs.map((proverb) => <ProverbCard key={proverb.id} proverb={proverb} />)
                )}
              </div>
            )}

            {activeTab === "followers" && <FollowersList users={followers} title="Followers" />}

            {activeTab === "following" && <FollowersList users={following} title="Following" />}

            {activeTab === "achievements" && (
              <BadgeShowcase badges={profileUser.badges} userPoints={profileUser.points} />
            )}
          </div>
        </div>
      </main>
    </>
  )
}
