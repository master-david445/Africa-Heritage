"use client"

import FollowButton from "@/components/follow-button"
import type { Profile } from "@/lib/types"

interface FollowersListProps {
  users: Profile[]
  title: string
}

export default function FollowersList({ users, title }: FollowersListProps) {

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="font-serif text-lg font-bold mb-4 text-gray-900">{title}</h2>
      <div className="space-y-4">
        {users.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No {title.toLowerCase()} yet</p>
        ) : (
          users.map((user) => (
            <div key={user.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-red-400 flex items-center justify-center text-white font-bold text-sm">
                  {user.username?.substring(0, 2).toUpperCase() || "U"}
                </div>
                <div>
                  <div className="font-semibold text-gray-900">{user.username || "Anonymous"}</div>
                  <div className="text-xs text-gray-500">{user.points || 0} points</div>
                </div>
              </div>
              <FollowButton userId={user.id} size="sm" />
            </div>
          ))
        )}
      </div>
    </div>
  )
}
