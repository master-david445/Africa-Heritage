"use client"

import { Button } from "@/components/ui/button"
import { useFollow } from "@/lib/hooks/use-follow"

interface FollowButtonProps {
  userId: string
  size?: "sm" | "default" | "lg"
  className?: string
}

export default function FollowButton({ userId, size = "default", className }: FollowButtonProps) {
  const { isFollowing, toggleFollow, isLoading, error } = useFollow(userId)

  const handleClick = () => {
    toggleFollow(userId)
  }

  return (
    <Button
      size={size}
      onClick={handleClick}
      disabled={isLoading}
      className={`${className} ${
        isFollowing
          ? "bg-gray-200 text-gray-900 hover:bg-gray-300"
          : "bg-orange-600 text-white hover:bg-orange-700"
      }`}
    >
      {isLoading ? "Loading..." : isFollowing ? "Following" : "Follow"}
    </Button>
  )
}