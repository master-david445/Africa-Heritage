import { formatDistanceToNow } from "date-fns"
import type { Comment } from "@/lib/types"

interface CommentItemProps {
  comment: Comment
}

export default function CommentItem({ comment }: CommentItemProps) {
  const author = comment.profiles

  return (
    <div className="bg-gray-50 rounded p-3" role="article" aria-label="Comment">
      <div className="flex items-center gap-2 mb-1">
        <span className="font-semibold text-sm text-gray-900">
          {author?.username || "Anonymous"}
        </span>
        <time
          className="text-xs text-gray-500"
          dateTime={comment.created_at}
          title={new Date(comment.created_at).toLocaleString()}
        >
          {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
        </time>
      </div>
      <p className="text-sm text-gray-700">{comment.text}</p>
    </div>
  )
}