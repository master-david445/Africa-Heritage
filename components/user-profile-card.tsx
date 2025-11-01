"use client"

import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/auth-context"
import type { User } from "@/lib/types"
import { MapPin, Calendar, Award } from "lucide-react"

interface UserProfileCardProps {
  user: User
  isOwnProfile?: boolean
  onFollowChange?: () => void
}

export default function UserProfileCard({ user, isOwnProfile = false, onFollowChange }: UserProfileCardProps) {
  const { user: currentUser, followUser, unfollowUser, isFollowing } = useAuth()
  const following = isFollowing(user.id)

  const handleFollowToggle = () => {
    if (following) {
      unfollowUser(user.id)
    } else {
      followUser(user.id)
    }
    onFollowChange?.()
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {/* Cover Image */}
      <div className="h-32 bg-gradient-to-r from-orange-400 to-red-400"></div>

      {/* Profile Content */}
      <div className="px-6 pb-6">
        {/* Avatar */}
        <div className="flex items-end gap-4 -mt-16 mb-4">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-orange-400 to-red-400 border-4 border-white flex items-center justify-center text-white font-bold text-2xl">
            {user.name.substring(0, 2).toUpperCase()}
          </div>
          {!isOwnProfile && currentUser && currentUser.id !== user.id && (
            <Button
              onClick={handleFollowToggle}
              className={`ml-auto ${
                following
                  ? "bg-gray-200 text-gray-900 hover:bg-gray-300"
                  : "bg-orange-600 text-white hover:bg-orange-700"
              }`}
            >
              {following ? "Following" : "Follow"}
            </Button>
          )}
        </div>

        {/* User Info */}
        <div className="mb-4">
          <h1 className="text-2xl font-bold text-gray-900">{user.name}</h1>
          {user.isVerified && <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">Verified</span>}
        </div>

        {/* Bio */}
        {user.bio && <p className="text-gray-600 mb-4">{user.bio}</p>}

        {/* Location & Join Date */}
        <div className="flex flex-wrap gap-4 mb-4 text-sm text-gray-600">
          {user.country && (
            <div className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              {user.country}
            </div>
          )}
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            Joined {new Date(user.joinedDate).toLocaleDateString()}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 py-4 border-t border-b border-gray-200 mb-4">
          <div className="text-center">
            <div className="text-lg font-bold text-gray-900">{user.proverbsCount}</div>
            <div className="text-xs text-gray-500">Proverbs</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-gray-900">{user.followersCount}</div>
            <div className="text-xs text-gray-500">Followers</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-gray-900">{user.followingCount}</div>
            <div className="text-xs text-gray-500">Following</div>
          </div>
        </div>

        {/* Badges */}
        {user.badges.length > 0 && (
          <div>
            <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
              <Award className="w-4 h-4" />
              Badges
            </h3>
            <div className="flex flex-wrap gap-2">
              {user.badges.map((badge) => (
                <div key={badge.id} className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm">
                  {badge.name}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
