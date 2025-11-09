"use client"

import { useState } from "react"
import { UserPlus, UserCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { toggleFollow } from "@/app/actions/follows"
import { toggleQuestionFollow } from "@/app/actions/question-follows"
import { useAuth } from "@/lib/auth-context"

interface FollowButtonProps {
  targetId: string
  targetType: "user" | "question"
  isFollowing: boolean
  onFollowChange?: (following: boolean) => void
  size?: "sm" | "default" | "lg"
}

export default function FollowButton({
  targetId,
  targetType,
  isFollowing,
  onFollowChange,
  size = "default"
}: FollowButtonProps) {
  const { user } = useAuth()
  const [following, setFollowing] = useState(isFollowing)
  const [isLoading, setIsLoading] = useState(false)

  const handleToggleFollow = async () => {
    if (!user) return

    setIsLoading(true)
    try {
      let result
      if (targetType === "user") {
        result = await toggleFollow(targetId)
      } else {
        result = await toggleQuestionFollow(targetId)
      }

      setFollowing(result.following)
      onFollowChange?.(result.following)
    } catch (error) {
      console.error("Follow error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  if (!user || user.id === targetId) {
    return null
  }

  return (
    <Button
      onClick={handleToggleFollow}
      disabled={isLoading}
      size={size}
      variant={following ? "outline" : "default"}
      className={following ? "text-green-600 border-green-600 hover:bg-green-50" : ""}
    >
      {following ? (
        <>
          <UserCheck className="w-4 h-4 mr-2" />
          {targetType === "user" ? "Following" : "Following"}
        </>
      ) : (
        <>
          <UserPlus className="w-4 h-4 mr-2" />
          {targetType === "user" ? "Follow" : "Follow Question"}
        </>
      )}
    </Button>
  )
}