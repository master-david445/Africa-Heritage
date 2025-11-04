"use client"

import { useState } from "react"
import { Heart, MessageCircle, Bookmark, Share2, Loader2, FolderPlus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import type { Proverb, Profile } from "@/lib/types"

interface ProverbActionsProps {
  proverb: Proverb
  currentUser: Profile | null
  isLiked: boolean
  isBookmarked: boolean
  likeCount: number
  commentCount: number
  showComments: boolean
  isLoading: boolean
  error: string | null
  onLike: () => Promise<void>
  onBookmark: () => Promise<void>
  onToggleComments: () => void
  onShare: () => void
  onAddToCollection?: () => void
}

export default function ProverbActions({
  proverb,
  currentUser,
  isLiked,
  isBookmarked,
  likeCount,
  commentCount,
  showComments,
  isLoading,
  error,
  onLike,
  onBookmark,
  onToggleComments,
  onShare,
  onAddToCollection,
}: ProverbActionsProps) {
  const [shareLoading, setShareLoading] = useState(false)

  const handleShare = async () => {
    if (shareLoading) return

    setShareLoading(true)
    try {
      const shareData = {
        title: "African Heritage Proverb",
        text: proverb.proverb,
        url: window.location.href,
      }

      if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
        await navigator.share(shareData)
        toast.success("Proverb shared successfully!")
      } else {
        // Fallback: copy to clipboard
        await navigator.clipboard.writeText(`${proverb.proverb} - ${window.location.href}`)
        toast.success("Link copied to clipboard!")
      }
    } catch (err) {
      console.error("[v0] Share error:", err)
      if (err instanceof Error && err.name === "NotAllowedError") {
        toast.error("Sharing not allowed. Try copying the link instead.")
      } else {
        toast.error("Failed to share proverb")
      }
    } finally {
      setShareLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      {/* Error Message */}
      {error && (
        <div className="text-xs text-red-500 bg-red-50 p-2 rounded" role="alert">
          {error}
        </div>
      )}

      {/* Social Actions */}
      <div className="flex gap-4 text-gray-500 text-sm border-t pt-4" role="group" aria-label="Proverb actions">
        <button
          onClick={onLike}
          disabled={!currentUser || isLoading}
          className={`flex items-center gap-1 transition hover:text-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 rounded ${
            isLiked ? "text-red-600" : ""
          }`}
          aria-label={`${isLiked ? "Unlike" : "Like"} this proverb`}
          aria-pressed={isLiked}
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Heart className={`w-4 h-4 ${isLiked ? "fill-current" : ""}`} />
          )}
          <span aria-live="polite">{likeCount}</span>
        </button>

        <button
          onClick={onToggleComments}
          disabled={!currentUser}
          className={`flex items-center gap-1 transition hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded ${
            showComments ? "text-blue-600" : ""
          }`}
          aria-label={`${showComments ? "Hide" : "Show"} comments`}
          aria-expanded={showComments}
        >
          <MessageCircle className="w-4 h-4" />
          <span aria-live="polite">{commentCount}</span>
        </button>

        <button
          onClick={onBookmark}
          disabled={!currentUser || isLoading}
          className={`flex items-center gap-1 transition hover:text-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 rounded ${
            isBookmarked ? "text-amber-600" : ""
          }`}
          aria-label={`${isBookmarked ? "Remove from" : "Add to"} bookmarks`}
          aria-pressed={isBookmarked}
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Bookmark className={`w-4 h-4 ${isBookmarked ? "fill-current" : ""}`} />
          )}
        </button>

        {onAddToCollection && (
          <button
            onClick={onAddToCollection}
            disabled={!currentUser}
            className="flex items-center gap-1 transition hover:text-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 rounded"
            aria-label="Add to collection"
          >
            <FolderPlus className="w-4 h-4" />
            Add to Collection
          </button>
        )}

        <button
          onClick={handleShare}
          disabled={shareLoading}
          className="flex items-center gap-1 transition hover:text-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 rounded"
          aria-label="Share this proverb"
        >
          {shareLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Share2 className="w-4 h-4" />
          )}
          Share
        </button>
      </div>

      {/* Login Prompt */}
      {!currentUser && (
        <div className="text-xs text-gray-500 text-center pt-2" role="status">
          Sign in to like, comment, and bookmark
        </div>
      )}
    </div>
  )
}