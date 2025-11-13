"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/auth-context"
import { getUserProfileById, getProfileStats } from "@/app/actions/profile"
import { isFollowing } from "@/app/actions/follows"
import FollowButton from "@/components/follow-button"
import type { Profile } from "@/lib/types"
import { MapPin, Calendar, Award } from "lucide-react"

interface UserProfileCardProps {
  user?: Profile & {
    proverbsCount?: number
    followersCount?: number
    followingCount?: number
  }
  userId?: string
  isOwnProfile?: boolean
  onFollowChange?: () => void
}

type DisplayUser = Profile & {
  proverbsCount?: number
  followersCount?: number
  followingCount?: number
}

export default function UserProfileCard({ user, userId, isOwnProfile = false, onFollowChange }: UserProfileCardProps) {
  const { user: currentUser } = useAuth()
  const [fetchedUser, setFetchedUser] = useState<Profile | null>(null)
  const [isUserFollowing, setIsUserFollowing] = useState(false)
  const [loading, setLoading] = useState(false)

  const displayUser = (user || fetchedUser) as DisplayUser

  useEffect(() => {
    const fetchData = async () => {
      if (!displayUser && userId) {
        setLoading(true)
        try {
          const profile = await getUserProfileById(userId)
          const stats = await getProfileStats(userId)
          setFetchedUser({ ...profile, ...stats })
        } catch (error) {
          console.error("Error fetching user profile:", error)
        } finally {
          setLoading(false)
        }
      }

      // Check follow status
      if (displayUser && currentUser && displayUser.id !== currentUser.id) {
        try {
          const following = await isFollowing(displayUser.id)
          setIsUserFollowing(following)
        } catch (error) {
          console.error("Error checking follow status:", error)
        }
      }
    }

    fetchData()
  }, [displayUser, userId, currentUser])

  if (loading || !displayUser) {
    return (
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="h-32 bg-gradient-to-r from-orange-400 to-red-400 animate-pulse"></div>
        <div className="px-6 pb-6">
          <div className="flex items-end gap-4 -mt-16 mb-4">
            <div className="w-24 h-24 rounded-full bg-gray-200 animate-pulse"></div>
          </div>
          <div className="space-y-2 mb-4">
            <div className="h-6 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {/* Cover Image */}
      <div className="h-24 sm:h-32 bg-gradient-to-r from-orange-400 to-red-400"></div>

      {/* Profile Content */}
      <div className="px-4 sm:px-6 pb-6">
        {/* Avatar */}
        <div className="flex items-end gap-3 sm:gap-4 -mt-12 sm:-mt-16 mb-4">
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-br from-orange-400 to-red-400 border-4 border-white flex items-center justify-center text-white font-bold text-xl sm:text-2xl">
            {displayUser.username.substring(0, 2).toUpperCase()}
          </div>
        </div>

        {/* User Info */}
        <div className="mb-4">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">{displayUser.username}</h1>
          {displayUser.is_verified && <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded ml-2">Verified</span>}
          {displayUser.is_admin && <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded ml-2">Admin</span>}
        </div>

        {/* Bio */}
        {displayUser.bio && <p className="text-gray-600 mb-4">{displayUser.bio}</p>}

        {/* Location & Join Date */}
        <div className="flex flex-wrap gap-4 mb-4 text-sm text-gray-600">
          {displayUser.country && (
            <div className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              {displayUser.country}
            </div>
          )}
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            Joined {new Date(displayUser.created_at).toLocaleDateString()}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-2 md:gap-4 py-4 border-t border-b border-gray-200 mb-4">
          <div className="text-center">
            <div className="text-lg font-bold text-gray-900">{displayUser.proverbsCount}</div>
            <div className="text-xs text-gray-500">Proverbs</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-gray-900">{displayUser.followersCount}</div>
            <div className="text-xs text-gray-500">Followers</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-gray-900">{displayUser.followingCount}</div>
            <div className="text-xs text-gray-500">Following</div>
          </div>
        </div>

        {/* Follow Button */}
        {!isOwnProfile && (
          <div className="mb-4">
            <FollowButton
              targetId={displayUser.id}
              targetType="user"
              isFollowing={isUserFollowing}
              onFollowChange={setIsUserFollowing}
            />
          </div>
        )}

        {/* Reputation Score */}
        <div className="mt-4 p-3 bg-orange-50 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-orange-600" />
              <span className="font-semibold text-gray-900">Reputation</span>
            </div>
            <span className="text-lg font-bold text-orange-600">{displayUser.reputation_score}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
