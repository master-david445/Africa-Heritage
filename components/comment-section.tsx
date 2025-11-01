"use client"

import { useState } from "react"
import { Loader2, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import CommentItem from "@/components/comment-item"
import type { Comment, Profile } from "@/lib/types"

interface CommentSectionProps {
  proverbId: string
  comments: Comment[]
  currentUser: Profile | null
  isLoading: boolean
  onAddComment: (text: string) => Promise<void>
}

export default function CommentSection({
  proverbId,
  comments,
  currentUser,
  isLoading,
  onAddComment,
}: CommentSectionProps) {
  const [newComment, setNewComment] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newComment.trim() || isSubmitting) return

    setIsSubmitting(true)
    try {
      await onAddComment(newComment.trim())
      setNewComment("")
      toast.success("Comment added successfully!")
    } catch (error) {
      console.error("[v0] Comment submission error:", error)
      toast.error("Failed to add comment. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="border-t pt-4 space-y-4" aria-label="Comments section">
      {/* Existing Comments */}
      {comments.length > 0 && (
        <div className="space-y-3 max-h-48 overflow-y-auto" role="log" aria-label="Comments list">
          {comments.map((comment) => (
            <CommentItem key={comment.id} comment={comment} />
          ))}
        </div>
      )}

      {/* Add Comment Form */}
      {currentUser && (
        <form onSubmit={handleSubmit} className="flex gap-2" role="form" aria-label="Add comment">
          <div className="flex-1">
            <label htmlFor={`comment-${proverbId}`} className="sr-only">
              Add a comment
            </label>
            <textarea
              id={`comment-${proverbId}`}
              placeholder="Add a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
              rows={2}
              maxLength={500}
              disabled={isSubmitting}
              aria-describedby={`comment-help-${proverbId}`}
            />
            <div id={`comment-help-${proverbId}`} className="sr-only">
              Maximum 500 characters
            </div>
          </div>
          <Button
            type="submit"
            size="sm"
            disabled={!newComment.trim() || isSubmitting}
            className="bg-orange-600 hover:bg-orange-700 text-white self-end"
            aria-label="Post comment"
          >
            {isSubmitting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </Button>
        </form>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="flex justify-center py-4" aria-live="polite">
          <Loader2 className="w-6 h-6 animate-spin text-orange-600" />
        </div>
      )}

      {/* Empty State */}
      {comments.length === 0 && !isLoading && (
        <p className="text-sm text-gray-500 text-center py-4" role="status">
          No comments yet. Be the first to share your thoughts!
        </p>
      )}
    </section>
  )
}