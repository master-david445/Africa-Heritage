import { z } from "zod"

// Proverb validation schemas
export const createProverbSchema = z.object({
  proverb: z.string().min(1, "Proverb is required").max(1000, "Proverb must be less than 1000 characters"),
  meaning: z.string().max(2000, "Meaning must be less than 2000 characters").optional(),
  context: z.string().max(1000, "Context must be less than 1000 characters").optional(),
  country: z.string().min(1, "Country is required"),
  language: z.string().min(1, "Language is required"),
  categories: z.array(z.string()).min(0).max(10, "Maximum 10 categories allowed"),
})

export const updateProverbSchema = z.object({
  proverb: z.string().min(1, "Proverb is required").max(1000, "Proverb must be less than 1000 characters").optional(),
  meaning: z.string().min(1, "Meaning is required").max(2000, "Meaning must be less than 2000 characters").optional(),
  context: z.string().max(1000, "Context must be less than 1000 characters").optional(),
  categories: z.array(z.string()).min(1, "At least one category is required").max(10, "Maximum 10 categories allowed").optional(),
})

// Comment validation schemas
export const createCommentSchema = z.object({
  text: z.string().min(1, "Comment cannot be empty").max(500, "Comment must be less than 500 characters"),
})

// Profile validation schemas
export const updateProfileSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters").max(30, "Username must be less than 30 characters").regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores"),
  bio: z.string().max(500, "Bio must be less than 500 characters").optional(),
  country: z.string().max(100, "Country must be less than 100 characters").optional(),
})

// Collection validation schemas
export const createCollectionSchema = z.object({
  title: z.string().min(1, "Title is required").max(100, "Title must be less than 100 characters"),
  description: z.string().max(500, "Description must be less than 500 characters").optional(),
  is_public: z.boolean().default(true),
  is_collaborative: z.boolean().default(false),
})

// Search validation schemas
export const searchProverbsSchema = z.object({
  query: z.string().optional(),
  country: z.string().optional(),
  language: z.string().optional(),
  categories: z.array(z.string()).optional(),
  author: z.string().optional(),
  limit: z.number().min(1).max(100).default(20),
  offset: z.number().min(0).default(0),
})

// Pagination validation
export const paginationSchema = z.object({
  limit: z.number().min(1).max(100).default(20),
  offset: z.number().min(0).default(0),
})

// Type exports for use in components
export type CreateProverbInput = z.infer<typeof createProverbSchema>
export type UpdateProverbInput = z.infer<typeof updateProverbSchema>
export type CreateCommentInput = z.infer<typeof createCommentSchema>
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>
export type CreateCollectionInput = z.infer<typeof createCollectionSchema>
export type SearchProverbsInput = z.infer<typeof searchProverbsSchema>
export type PaginationInput = z.infer<typeof paginationSchema>

// Answer validation schemas
export const createAnswerSchema = z.object({
  content: z.string().min(10, "Answer must be at least 10 characters").max(10000, "Answer must be less than 10000 characters"),
})

export const updateAnswerSchema = z.object({
  content: z.string().min(10, "Answer must be at least 10 characters").max(10000, "Answer must be less than 10000 characters"),
})

// Vote validation schemas
export const voteSchema = z.object({
  answer_id: z.string().uuid(),
  vote_type: z.enum(["upvote", "downvote"]),
})

// Question follow validation
export const questionFollowSchema = z.object({
  question_id: z.string().uuid(),
})

// Notification validation
export const createNotificationSchema = z.object({
  user_id: z.string().uuid(),
  type: z.string(),
  title: z.string().min(1).max(255),
  message: z.string().optional(),
  related_id: z.string().uuid().optional(),
})

// Type exports
export type CreateAnswerInput = z.infer<typeof createAnswerSchema>
export type UpdateAnswerInput = z.infer<typeof updateAnswerSchema>
export type VoteInput = z.infer<typeof voteSchema>
export type QuestionFollowInput = z.infer<typeof questionFollowSchema>
export type CreateNotificationInput = z.infer<typeof createNotificationSchema>