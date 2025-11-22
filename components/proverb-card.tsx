"use client"

import { useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { getQuestionAnswers } from "@/app/actions/answers"
import { getUserVoteOnAnswer } from "@/app/actions/votes"
import { isFollowingQuestion, toggleQuestionFollow } from "@/app/actions/question-follows"
import ProverbContent from "@/components/proverb-content"
import AnswerSection from "@/components/answer-section"
import FollowButton from "@/components/follow-button"
import ProverbActions from "@/components/proverb-actions"
import AddToCollectionModal from "@/components/add-to-collection-modal"
import CommentSection from "@/components/comment-section"
import { useProverbCard } from "@/lib/hooks/use-proverb-card"
import { toast } from "sonner"
import type { Question, Answer, Profile, Proverb } from "@/lib/types"

interface ProverbCardProps {
  proverb: Question
  currentUser: Profile | null
}

export default function ProverbCard({ proverb, currentUser }: ProverbCardProps) {
  // Social features hook
  const {
    isLiked,
    isBookmarked,
    likeCount,
    commentCount,
    showComments,
    comments,
    isLoading: isSocialLoading,
    error: socialError,
    showAddToCollectionModal,
    setShowAddToCollectionModal,
    handleLike,
    handleBookmark,
    handleToggleComments,
    handleAddComment,
    handleShare,
    handleAddToCollection,
    handleAddToCollectionSubmit,
    handleCreateCollection,
  } = useProverbCard(proverb as Proverb, currentUser)

  // Q&A features state
  const [answers, setAnswers] = useState<Answer[]>([])
  const [loadingAnswers, setLoadingAnswers] = useState(false)
  const [showAnswers, setShowAnswers] = useState(false)
  const [isFollowingQuestionState, setIsFollowingQuestionState] = useState(false)
  const [isFollowLoading, setIsFollowLoading] = useState(false)

  const author = proverb.profiles

  // Load answers and follow status when expanded
  const loadAnswers = async () => {
    if (answers.length > 0) return // Already loaded

    setLoadingAnswers(true)
    try {
      const questionAnswers = await getQuestionAnswers(proverb.id)
      const followingStatus = await isFollowingQuestion(proverb.id)

      // Load user votes for each answer
      const answersWithVotes = await Promise.all(
        questionAnswers.map(async (answer: Answer) => {
          const userVote = await getUserVoteOnAnswer(answer.id)
          return { ...answer, user_vote: userVote }
        })
      )

      setAnswers(answersWithVotes)
      setIsFollowingQuestionState(followingStatus)
    } catch (error) {
      console.error("Error loading answers:", error)
    } finally {
      setLoadingAnswers(false)
    }
  }

  const handleToggleAnswers = () => {
    setShowAnswers(!showAnswers)
    if (!showAnswers && answers.length === 0) {
      loadAnswers()
    }
  }

  const handleAnswerUpdate = () => {
    // Reload answers
    loadAnswers()
  }

  const handleFollowQuestion = async () => {
    if (!currentUser) {
      toast.error("Please log in to follow questions")
      return
    }

    setIsFollowLoading(true)
    try {
      const result = await toggleQuestionFollow(proverb.id)
      setIsFollowingQuestionState(result.following)
      toast.success(result.following ? "Following question" : "Unfollowed question")
    } catch (error) {
      console.error("Error toggling follow:", error)
      toast.error("Failed to update follow status")
    } finally {
      setIsFollowLoading(false)
    }
  }

  return (
    <article className="bg-white rounded-lg shadow-md border-l-4 border-orange-600 p-6 hover:shadow-lg transition" role="article" aria-label="Proverb card">
      {/* Header */}
      <header className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-red-400 flex items-center justify-center text-white font-bold text-sm" aria-hidden="true">
          {author?.username?.substring(0, 2).toUpperCase() || "U"}
        </div>
        <div>
          <div className="font-semibold text-gray-900">{author?.username || "Anonymous"}</div>
          <div className="text-xs text-gray-500" aria-label={`From ${proverb.country} in ${proverb.language}`}>
            {proverb.country} • {proverb.language}
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="mb-4">
        <ProverbContent proverb={proverb} />
      </div>

      {/* Social Actions (Like, Comment, Bookmark, Share, Add to Collection) */}
      <div className="mb-4">
        <ProverbActions
          proverb={proverb as Proverb}
          currentUser={currentUser}
          isLiked={isLiked}
          isBookmarked={isBookmarked}
          likeCount={likeCount}
          commentCount={commentCount}
          showComments={showComments}
          isLoading={isSocialLoading}
          error={socialError}
          onLike={handleLike}
          onBookmark={handleBookmark}
          onToggleComments={handleToggleComments}
          onShare={handleShare}
          onAddToCollection={handleAddToCollection}
        />
      </div>

      {/* Comments Section */}
      {showComments && (
        <div className="mb-6 border-t pt-4">
          <CommentSection
            proverbId={proverb.id}
            comments={comments}
            currentUser={currentUser}
            onAddComment={handleAddComment}
            isLoading={isSocialLoading}
          />
        </div>
      )}

      {/* Q&A Section (Answers) */}
      <div className="border-t pt-4">
        <div className="flex items-center justify-between mb-4 text-sm text-gray-600">
          <div className="flex items-center gap-4">
            <span>{proverb.answer_count || 0} answers</span>
            <span>{proverb.views || 0} views</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleFollowQuestion}
              disabled={isFollowLoading}
              className={`text-sm font-medium px-3 py-1 rounded-full transition ${isFollowingQuestionState
                  ? "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  : "bg-orange-50 text-orange-600 hover:bg-orange-100"
                }`}
            >
              {isFollowLoading ? "..." : isFollowingQuestionState ? "Following" : "Follow Question"}
            </button>
            <button
              onClick={handleToggleAnswers}
              className="text-orange-600 hover:text-orange-700 font-medium"
            >
              {showAnswers ? "Hide answers" : "Show answers"}
            </button>
          </div>
        </div>

        {showAnswers && (
          <AnswerSection
            questionId={proverb.id}
            questionAuthorId={proverb.user_id}
            answers={answers}
            currentUser={currentUser}
            onAnswerUpdate={handleAnswerUpdate}
          />
        )}
      </div>

      {/* Add to Collection Modal */}
      <AddToCollectionModal
        open={showAddToCollectionModal}
        onOpenChange={setShowAddToCollectionModal}
        proverb={proverb as Proverb}
        currentUser={currentUser}
        onAddToCollection={handleAddToCollectionSubmit}
        onCreateCollection={handleCreateCollection}
      />
    </article>
  )
}
