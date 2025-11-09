"use client"

import { useState } from "react"
import { Loader2, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useAuth } from "@/lib/auth-context"
import { createAnswer } from "@/app/actions/answers"
import AnswerItem from "@/components/answer-item"
import type { Answer, Profile } from "@/lib/types"

interface AnswerSectionProps {
  questionId: string
  questionAuthorId: string
  answers: Answer[]
  currentUser: Profile | null
  onAnswerUpdate?: () => void
}

export default function AnswerSection({
  questionId,
  questionAuthorId,
  answers,
  currentUser,
  onAnswerUpdate,
}: AnswerSectionProps) {
  const { user } = useAuth()
  const [newAnswer, setNewAnswer] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newAnswer.trim() || isSubmitting) return

    setIsSubmitting(true)
    try {
      await createAnswer(questionId, { content: newAnswer.trim() })
      setNewAnswer("")
      onAnswerUpdate?.()
    } catch (error) {
      console.error("Answer submission error:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="border-t pt-6 space-y-6" aria-label="Answers section">
      {/* Answer Form */}
      {user && (
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="font-semibold text-gray-900 mb-3">Your Answer</h3>
          <form onSubmit={handleSubmit} className="space-y-3">
            <Textarea
              placeholder="Share your interpretation or meaning of this proverb..."
              value={newAnswer}
              onChange={(e) => setNewAnswer(e.target.value)}
              className="min-h-24 resize-none"
              maxLength={10000}
              disabled={isSubmitting}
            />
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">
                {newAnswer.length}/10000 characters
              </span>
              <Button
                type="submit"
                disabled={!newAnswer.trim() || isSubmitting}
                className="bg-orange-600 hover:bg-orange-700"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Posting...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Post Answer
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Answers List */}
      <div className="space-y-4">
        <h3 className="font-semibold text-gray-900">
          {answers.length} Answer{answers.length !== 1 ? 's' : ''}
        </h3>

        {answers.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>No answers yet. Be the first to share your wisdom!</p>
          </div>
        ) : (
          answers.map((answer) => (
            <AnswerItem
              key={answer.id}
              answer={answer}
              questionAuthorId={questionAuthorId}
              onVoteUpdate={onAnswerUpdate}
              onAnswerUpdate={onAnswerUpdate}
            />
          ))
        )}
      </div>
    </section>
  )
}