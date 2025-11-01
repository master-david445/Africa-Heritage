"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/auth-context"
import type { User } from "@/lib/types"

interface FollowersListProps {
  users: User[]
  title: string
}

export default function FollowersList({ users, title }: FollowersListProps) {
  const { isFollowing, followUser, unfollowUser } = useAuth()
  const [localUsers, setLocalUsers] = useState(users)

  const handleFollowToggle = (userId: string) => {
    if (isFollowing(userId)) {
      unfollowUser(userId)
    } else {
      followUser(userId)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="font-serif text-lg font-bold mb-4 text-gray-900">{title}</h2>
      <div className="space-y-4">
        {localUsers.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No {title.toLowerCase()} yet</p>
        ) : (
          localUsers.map((user) => (
            <div key={user.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-red-400 flex items-center justify-center text-white font-bold text-sm">
                  {user.name.substring(0, 2).toUpperCase()}
                </div>
                <div>
                  <div className="font-semibold text-gray-900">{user.name}</div>
                  <div className="text-xs text-gray-500">{user.proverbsCount} proverbs</div>
                </div>
              </div>
              <Button
                size="sm"
                onClick={() => handleFollowToggle(user.id)}
                className={`${
                  isFollowing(user.id)
                    ? "bg-gray-200 text-gray-900 hover:bg-gray-300"
                    : "bg-orange-600 text-white hover:bg-orange-700"
                }`}
              >
                {isFollowing(user.id) ? "Following" : "Follow"}
              </Button>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
