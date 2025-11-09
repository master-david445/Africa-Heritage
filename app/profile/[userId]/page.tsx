"use client"

import { useState, useEffect } from "react"
import Header from "@/components/header"
import UserProfileCard from "@/components/user-profile-card"
import FollowersList from "@/components/followers-list"
import ProverbCard from "@/components/proverb-card"
import BadgeShowcase from "@/components/badge-showcase"
import PointsTracker from "@/components/points-tracker"
import { useAuth } from "@/lib/auth-context"
import { getUserProfile, getProfileStats } from "@/app/actions/profile"
import { getProverbsByUser } from "@/app/actions/proverbs"
import { getUserFollowers, getUserFollowing } from "@/app/actions/follows"
import type { Profile, Proverb } from "@/lib/types"

export default function ProfilePage({ params }: { params: { userId: string } }) {
  const { user: currentUser } = useAuth()
  const userId = params.userId

  const [profileUser, setProfileUser] = useState<Profile | null>(null)
  const [userProverbs, setUserProverbs] = useState<Proverb[]>([])
  const [followers, setFollowers] = useState<any[]>([])
  const [following, setFollowing] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<"proverbs" | "followers" | "following" | "achievements">("proverbs")

  useEffect(() => {
    async function loadProfileData() {
      try {
        setLoading(true)
        setError(null)

        // Load profile data
        const profile = await getUserProfile(userId)
        if (!profile) {
          setError("User not found")
          return
        }
        setProfileUser(profile)

        // Load stats and update profile with counts
        const stats = await getProfileStats(userId)
        setProfileUser(prev => prev ? { ...prev, ...stats } : null)

        // Load user's proverbs/questions
        const proverbs = await getProverbsByUser(userId)
        setUserProverbs(proverbs)

        // Load followers and following
        const [followersData, followingData] = await Promise.all([
          getUserFollowers(userId),
          getUserFollowing(userId)
        ])
        setFollowers(followersData || [])
        setFollowing(followingData || [])

      } catch (err) {
        console.error("Error loading profile:", err)
        setError("Failed to load profile")
      } finally {
        setLoading(false)
      }
    }

    if (userId) {
      loadProfileData()
    }
  }, [userId])

  if (loading) {
    return (
      <>
        <Header />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-1">
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                  <div className="h-32 bg-gray-200"></div>
                  <div className="px-6 pb-6">
                    <div className="flex items-end gap-4 -mt-16 mb-4">
                      <div className="w-24 h-24 rounded-full bg-gray-200"></div>
                      <div className="flex-1">
                        <div className="h-6 bg-gray-200 rounded mb-2"></div>
                        <div className="h-4 bg-gray-200 rounded"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="lg:col-span-2">
                <div className="h-96 bg-white rounded-lg shadow-md"></div>
              </div>
            </div>
          </div>
        </main>
      </>
    )
  }

  if (error || !profileUser) {
    return (
      <>
        <Header />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900">
              {error || "User not found"}
            </h1>
          </div>
        </main>
      </>
    )
  }

  const isOwnProfile = currentUser?.id === userId

  // Convert Profile to User format expected by components
  const userForComponents = {
    id: profileUser.id,
    name: profileUser.username,
    email: profileUser.email || "",
    bio: profileUser.bio || undefined,
    country: profileUser.country || undefined,
    avatar: profileUser.avatar_url || "/placeholder-user.jpg",
    joinedDate: new Date(profileUser.created_at),
    proverbsCount: (profileUser as any).proverbsCount || 0,
    followersCount: (profileUser as any).followersCount || 0,
    followingCount: (profileUser as any).followingCount || 0,
    points: profileUser.points,
    badges: [], // TODO: Implement badge system
    isAdmin: profileUser.is_admin,
    isVerified: profileUser.is_verified,
    isSuspended: profileUser.is_suspended,
  }

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
                    <p className="text-gray-500">
                      {isOwnProfile ? "You haven't shared any proverbs yet" : "No proverbs shared yet"}
                    </p>
                    {isOwnProfile && (
                      <p className="text-sm text-gray-400 mt-2">
                        Click "Ask Question" to share your first proverb!
                      </p>
                    )}
                  </div>
                ) : (
                  userProverbs.map((proverb) => (
                    <ProverbCard
                      key={proverb.id}
                      proverb={proverb}
                      currentUser={currentUser ? {
                        id: currentUser.id,
                        username: currentUser.email?.split('@')[0] || 'user',
                        email: currentUser.email || '',
                        bio: null,
                        country: null,
                        avatar_url: null,
                        points: 0,
                        reputation_score: 0,
                        is_admin: false,
                        is_verified: false,
                        is_suspended: false,
                        created_at: '',
                        updated_at: ''
                      } : null}
                    />
                  ))
                )}
              </div>
            )}

            {activeTab === "followers" && <FollowersList users={followers} title="Followers" />}

            {activeTab === "following" && <FollowersList users={following} title="Following" />}

            {activeTab === "achievements" && (
              <BadgeShowcase badges={userForComponents.badges} userPoints={profileUser.points} />
            )}
          </div>
        </div>
      </main>
    </>
  )
}
