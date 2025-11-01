"use client"

import { useAuth } from "@/lib/auth-context"
import { useProverbCard } from "@/lib/hooks/use-proverb-card"
import ProverbContent from "@/components/proverb-content"
import ProverbActions from "@/components/proverb-actions"
import CommentSection from "@/components/comment-section"
import type { Proverb, Profile } from "@/lib/types"

interface ProverbCardProps {
  proverb: Proverb
  currentUser: Profile | null
}

export default function ProverbCard({ proverb, currentUser }: ProverbCardProps) {
  const { user } = useAuth()
  const author = proverb.profiles

  const {
    isLiked,
    isBookmarked,
    likeCount,
    commentCount,
    showComments,
    comments,
    isLoading,
    error,
    handleLike,
    handleBookmark,
    handleToggleComments,
    handleAddComment,
    handleShare,
  } = useProverbCard(proverb, currentUser)

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

      {/* Proverb Content */}
      <ProverbContent proverb={proverb} />

      {/* Social Actions */}
      <ProverbActions
        proverb={proverb}
        currentUser={currentUser}
        isLiked={isLiked}
        isBookmarked={isBookmarked}
        likeCount={likeCount}
        commentCount={commentCount}
        showComments={showComments}
        isLoading={isLoading}
        error={error}
        onLike={handleLike}
        onBookmark={handleBookmark}
        onToggleComments={handleToggleComments}
        onShare={handleShare}
      />

      {/* Comments Section */}
      {showComments && (
        <CommentSection
          proverbId={proverb.id}
          comments={comments}
          currentUser={currentUser}
          isLoading={isLoading}
          onAddComment={handleAddComment}
        />
      )}
    </article>
  )
}
