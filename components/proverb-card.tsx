"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth-context"
import { getQuestionAnswers } from "@/app/actions/answers"
import { getUserVoteOnAnswer } from "@/app/actions/votes"
import { isFollowingQuestion } from "@/app/actions/question-follows"
import ProverbContent from "@/components/proverb-content"
import AnswerSection from "@/components/answer-section"
import FollowButton from "@/components/follow-button"
import type { Question, Answer, Profile } from "@/lib/types"

interface ProverbCardProps {
  proverb: Question
  currentUser: Profile | null
}

export default function ProverbCard({ proverb, currentUser }: ProverbCardProps) {
  const { user } = useAuth()
  const author = proverb.profiles

  const [answers, setAnswers] = useState<Answer[]>([])
  const [loading, setLoading] = useState(false)
  const [showAnswers, setShowAnswers] = useState(false)
  const [isFollowingQuestion, setIsFollowingQuestion] = useState(false)

  // Load answers and follow status when expanded
  const loadAnswers = async () => {
    if (answers.length > 0) return // Already loaded

    setLoading(true)
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
      setIsFollowingQuestion(followingStatus)
    } catch (error) {
      console.error("Error loading answers:", error)
    } finally {
      setLoading(false)
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

  return (
    <article className="bg-white rounded-lg shadow-md border-l-4 border-orange-600 p-6 hover:shadow-lg transition" role="article" aria-label="Proverb question">
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

      {/* Question Content */}
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">What does this proverb mean?</h3>
        <ProverbContent proverb={proverb} />
      </div>

      {/* Question Stats and Actions */}
      <div className="flex items-center justify-between mb-4 text-sm text-gray-600">
        <div className="flex items-center gap-4">
          <span>{proverb.answer_count || 0} answers</span>
          <span>{proverb.views || 0} views</span>
          <span>{proverb.follower_count || 0} followers</span>
        </div>
        <div className="flex items-center gap-2">
          <FollowButton
            targetId={proverb.id}
            targetType="question"
            isFollowing={isFollowingQuestion}
            onFollowChange={setIsFollowingQuestion}
            size="sm"
          />
          <button
            onClick={handleToggleAnswers}
            className="text-orange-600 hover:text-orange-700 font-medium"
          >
            {showAnswers ? "Hide answers" : "Show answers"}
          </button>
        </div>
      </div>

      {/* Answers Section */}
      {showAnswers && (
        <AnswerSection
          questionId={proverb.id}
          questionAuthorId={proverb.user_id}
          answers={answers}
          currentUser={currentUser}
          onAnswerUpdate={handleAnswerUpdate}
        />
      )}
    </article>
  )
}
