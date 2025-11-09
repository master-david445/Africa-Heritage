import type { Database } from "./database.types"

// Re-export database types for consistency
export type { Database }

// User types derived from database
export type Profile = Database["public"]["Tables"]["profiles"]["Row"]
export type Proverb = Database["public"]["Tables"]["proverbs"]["Row"] & {
  profiles: Profile | null
  likes_count?: number
  comments_count?: number
  bookmarks_count?: number
}
export type Comment = Database["public"]["Tables"]["comments"]["Row"] & {
  profiles: Profile | null
}
export type Like = Database["public"]["Tables"]["likes"]["Row"]
export type Bookmark = Database["public"]["Tables"]["bookmarks"]["Row"]
export type Follow = Database["public"]["Tables"]["follows"]["Row"]
export type Collection = Database["public"]["Tables"]["collections"]["Row"]
export type CollectionItem = Database["public"]["Tables"]["collection_items"]["Row"]
export type Badge = Database["public"]["Tables"]["badges"]["Row"]
export type UserBadge = Database["public"]["Tables"]["user_badges"]["Row"]

// New types for Quora-like format
export type Answer = Database["public"]["Tables"]["answers"]["Row"] & {
  profiles: Profile | null
  user_vote?: "upvote" | "downvote" | null
}
export type Vote = Database["public"]["Tables"]["votes"]["Row"]
export type QuestionFollow = Database["public"]["Tables"]["question_follows"]["Row"]
export type Notification = Database["public"]["Tables"]["notifications"]["Row"]

// Extended Proverb type for questions
export type Question = Database["public"]["Tables"]["proverbs"]["Row"] & {
  profiles: Profile | null
  answer_count?: number
  follower_count?: number
  answers?: Answer[]
}

// Form types for validation
export interface CreateProverbForm {
  proverb: string
  meaning: string
  context?: string
  country: string
  language: string
  categories: string[]
}

export interface CreateCommentForm {
  text: string
}

export interface UpdateProfileForm {
  username: string
  bio?: string
  country?: string
}

// API Response types
export interface ApiResponse<T = any> {
  data?: T
  error?: string
  success: boolean
}

// Pagination types
export interface PaginationParams {
  limit?: number
  offset?: number
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  hasMore: boolean
}

// Search types
export interface SearchFilters {
  query?: string
  country?: string
  language?: string
  categories?: string[]
  author?: string
}

// UI State types
export interface LoadingState {
  isLoading: boolean
  error: string | null
}

export interface ProverbCardState {
  isLiked: boolean
  isBookmarked: boolean
  likeCount: number
  commentCount: number
  showComments: boolean
  comments: Comment[]
  isLoading: boolean
  error: string | null
}
