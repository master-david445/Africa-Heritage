"use client"

import { useState, useEffect } from "react"
import { Heart, MessageCircle, Bookmark, Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { toggleLike, isProverbLikedByUser } from "@/app/actions/likes"
import { toggleBookmark } from "@/app/actions/bookmarks"
import { createComment, getProverbComments } from "@/app/actions/comments"
import { useAuth } from "@/lib/auth-context"
import type { Database } from "@/lib/database.types"

type Profile = Database["public"]["Tables"]["profiles"]["Row"]
type Proverb = Database["public"]["Tables"]["proverbs"]["Row"] & {
  profiles: Profile | null
  likes?: any[]
  comments?: any[]
  bookmarks?: any[]
}

interface ProverbCardProps {
  proverb: Proverb
  currentUser: Profile | null
}

export default function ProverbCard({ proverb, currentUser }: ProverbCardProps) {
  const { user } = useAuth()
  const [isLiked, setIsLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(proverb.likes?.length || 0)
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [showComments, setShowComments] = useState(false)
  const [newComment, setNewComment] = useState("")
  const [comments, setComments] = useState(proverb.comments || [])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadUserInteractions = async () => {
      if (!user) return
      try {
        const liked = await isProverbLikedByUser(proverb.id)
        setIsLiked(liked)
      } catch (err) {
        console.error("[v0] Error loading like status:", err)
      }
    }

    loadUserInteractions()
  }, [user, proverb.id])

  useEffect(() => {
    const loadComments = async () => {
      if (!showComments) return
      try {
        const fetchedComments = await getProverbComments(proverb.id)
        setComments(fetchedComments)
      } catch (err) {
        console.error("[v0] Error loading comments:", err)
        setError("Failed to load comments")
      }
    }

    loadComments()
  }, [showComments, proverb.id])

  const handleLike = async () => {
    if (!user) {
      setError("Please log in to like proverbs")
      return
    }
    try {
      setIsLoading(true)
      setError(null)
      const result = await toggleLike(proverb.id)
      setIsLiked(result.liked)
      setLikeCount(result.liked ? likeCount + 1 : Math.max(0, likeCount - 1))
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Error toggling like"
      console.error("[v0] Like error:", errorMsg)
      setError(errorMsg)
    } finally {
      setIsLoading(false)
    }
  }

  const handleBookmark = async () => {
    if (!user) {
      setError("Please log in to bookmark proverbs")
      return
    }
    try {
      setIsLoading(true)
      setError(null)
      const result = await toggleBookmark(proverb.id)
      setIsBookmarked(result.bookmarked)
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Error toggling bookmark"
      console.error("[v0] Bookmark error:", errorMsg)
      setError(errorMsg)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCommentSubmit = async () => {
    if (!user || !newComment.trim()) return
    try {
      setIsLoading(true)
      setError(null)
      const comment = await createComment(proverb.id, newComment)
      setComments([comment, ...comments])
      setNewComment("")
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Error posting comment"
      console.error("[v0] Comment error:", errorMsg)
      setError(errorMsg)
    } finally {
      setIsLoading(false)
    }
  }

  const handleShare = async () => {
    if (navigator.share) {
      navigator.share({
        title: "African Heritage Proverb",
        text: proverb.proverb,
        url: window.location.href,
      })
    }
  }

  const author = proverb.profiles

  return (
    <div className="bg-white rounded-lg shadow-md border-l-4 border-orange-600 p-6 hover:shadow-lg transition">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-red-400 flex items-center justify-center text-white font-bold text-sm">
          {author?.username?.substring(0, 2).toUpperCase() || "U"}
        </div>
        <div>
          <div className="font-semibold text-gray-900">{author?.username || "Anonymous"}</div>
          <div className="text-xs text-gray-500">
            {proverb.country} • {proverb.language}
          </div>
        </div>
      </div>

      {/* Proverb Content */}
      <p className="font-serif text-lg text-gray-800 mb-2 italic">{`"${proverb.proverb}"`}</p>
      <p className="text-gray-600 mb-4">{proverb.meaning}</p>

      {/* Categories */}
      {proverb.categories && proverb.categories.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {proverb.categories.map((category: string) => (
            <span key={category} className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded">
              {category}
            </span>
          ))}
        </div>
      )}

      {/* Error Message */}
      {error && <p className="text-xs text-red-500 mb-2">{error}</p>}

      {/* Social Actions */}
      <div className="flex gap-4 text-gray-500 text-sm mb-4 border-t pt-4">
        <button
          onClick={handleLike}
          className={`flex items-center gap-1 transition ${isLiked ? "text-red-600" : "hover:text-red-600"}`}
          disabled={!user || isLoading}
        >
          <Heart className={`w-4 h-4 ${isLiked ? "fill-current" : ""}`} />
          {likeCount}
        </button>
        <button
          onClick={() => setShowComments(!showComments)}
          className="flex items-center gap-1 hover:text-blue-600 transition"
          disabled={!user}
        >
          <MessageCircle className="w-4 h-4" />
          {comments.length}
        </button>
        <button
          onClick={handleBookmark}
          className={`flex items-center gap-1 transition ${isBookmarked ? "text-amber-600" : "hover:text-amber-600"}`}
          disabled={!user || isLoading}
        >
          <Bookmark className={`w-4 h-4 ${isBookmarked ? "fill-current" : ""}`} />
        </button>
        <button onClick={handleShare} className="flex items-center gap-1 hover:text-green-600 transition">
          <Share2 className="w-4 h-4" />
          Share
        </button>
      </div>

      {/* Comments Section */}
      {showComments && (
        <div className="border-t pt-4 space-y-4">
          {/* Existing Comments */}
          {comments.length > 0 && (
            <div className="space-y-3 mb-4 max-h-48 overflow-y-auto">
              {comments.map((comment: any) => (
                <div key={comment.id} className="bg-gray-50 rounded p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-sm text-gray-900">
                      {comment.profiles?.username || "Anonymous"}
                    </span>
                    <span className="text-xs text-gray-500">{new Date(comment.created_at).toLocaleDateString()}</span>
                  </div>
                  <p className="text-sm text-gray-700">{comment.text}</p>
                </div>
              ))}
            </div>
          )}

          {/* Add Comment */}
          {user && (
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Add a comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleCommentSubmit()}
                className="flex-1 px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
              <Button
                size="sm"
                onClick={handleCommentSubmit}
                disabled={!newComment.trim() || isLoading}
                className="bg-orange-600 hover:bg-orange-700 text-white"
              >
                Post
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Login Prompt */}
      {!user && <div className="text-xs text-gray-500 text-center pt-2">Sign in to like, comment, and bookmark</div>}
    </div>
  )
}
