"use client"

import { useState } from "react"
import { formatDistanceToNow } from "date-fns"
import { ChevronUp, ChevronDown, CheckCircle, Edit, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useAuth } from "@/lib/auth-context"
import { voteOnAnswer } from "@/app/actions/votes"
import { updateAnswer, deleteAnswer, acceptAnswer } from "@/app/actions/answers"
import type { Answer } from "@/lib/types"

interface AnswerItemProps {
  answer: Answer
  questionAuthorId: string
  onVoteUpdate?: () => void
  onAnswerUpdate?: () => void
}

export default function AnswerItem({
  answer,
  questionAuthorId,
  onVoteUpdate,
  onAnswerUpdate
}: AnswerItemProps) {
  const { user } = useAuth()
  const [isVoting, setIsVoting] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editContent, setEditContent] = useState(answer.content)
  const [isAccepting, setIsAccepting] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const author = answer.profiles
  const isOwnAnswer = user?.id === answer.user_id
  const canAcceptAnswer = user?.id === questionAuthorId
  const userVote = answer.user_vote

  const handleVote = async (voteType: "upvote" | "downvote") => {
    if (!user) return

    setIsVoting(true)
    try {
      await voteOnAnswer({
        answer_id: answer.id,
        vote_type: voteType,
      })
      onVoteUpdate?.()
    } catch (error) {
      console.error("Vote error:", error)
    } finally {
      setIsVoting(false)
    }
  }

  const handleEdit = async () => {
    if (!editContent.trim()) return

    try {
      await updateAnswer(answer.id, { content: editContent.trim() })
      setIsEditing(false)
      onAnswerUpdate?.()
    } catch (error) {
      console.error("Edit error:", error)
    }
  }

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this answer?")) return

    setIsDeleting(true)
    try {
      await deleteAnswer(answer.id)
      onAnswerUpdate?.()
    } catch (error) {
      console.error("Delete error:", error)
    } finally {
      setIsDeleting(false)
    }
  }

  const handleAccept = async () => {
    setIsAccepting(true)
    try {
      await acceptAnswer(answer.id)
      onAnswerUpdate?.()
    } catch (error) {
      console.error("Accept error:", error)
    } finally {
      setIsAccepting(false)
    }
  }

  return (
    <div className={`border rounded-lg p-4 ${answer.is_accepted ? 'border-green-200 bg-green-50' : 'border-gray-200'}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-400 flex items-center justify-center text-white font-bold text-sm">
            {author?.username?.substring(0, 2).toUpperCase() || "U"}
          </div>
          <div>
            <div className="font-semibold text-gray-900 flex items-center gap-2">
              {author?.username || "Anonymous"}
              {answer.is_accepted && (
                <CheckCircle className="w-4 h-4 text-green-600" />
              )}
            </div>
            <div className="text-xs text-gray-500">
              {formatDistanceToNow(new Date(answer.created_at), { addSuffix: true })}
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2">
          {canAcceptAnswer && !answer.is_accepted && (
            <Button
              size="sm"
              variant="outline"
              onClick={handleAccept}
              disabled={isAccepting}
              className="text-green-600 border-green-600 hover:bg-green-50"
            >
              {isAccepting ? "Accepting..." : "Accept"}
            </Button>
          )}
          {isOwnAnswer && (
            <>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setIsEditing(!isEditing)}
                className="text-gray-600 hover:text-gray-900"
              >
                <Edit className="w-4 h-4" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={handleDelete}
                disabled={isDeleting}
                className="text-red-600 hover:text-red-900"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Content */}
      {isEditing ? (
        <div className="space-y-3">
          <Textarea
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            className="min-h-24"
            placeholder="Edit your answer..."
          />
          <div className="flex gap-2">
            <Button size="sm" onClick={handleEdit}>
              Save
            </Button>
            <Button size="sm" variant="outline" onClick={() => setIsEditing(false)}>
              Cancel
            </Button>
          </div>
        </div>
      ) : (
        <div className="prose prose-sm max-w-none mb-4">
          <p className="text-gray-700 whitespace-pre-wrap">{answer.content}</p>
        </div>
      )}

      {/* Voting */}
      {user && !isEditing && (
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => handleVote("upvote")}
              disabled={isVoting}
              className={`p-1 ${userVote === "upvote" ? "text-orange-600" : "text-gray-400 hover:text-orange-600"}`}
            >
              <ChevronUp className="w-4 h-4" />
            </Button>
            <span className="font-semibold text-sm min-w-8 text-center">
              {answer.vote_count}
            </span>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => handleVote("downvote")}
              disabled={isVoting}
              className={`p-1 ${userVote === "downvote" ? "text-blue-600" : "text-gray-400 hover:text-blue-600"}`}
            >
              <ChevronDown className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}