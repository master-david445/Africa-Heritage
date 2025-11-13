/**
 * Profile-related TypeScript interfaces
 * Replaces any types with proper type safety
 */

import type { Database } from "@/lib/database.types"

// Base profile type from database
export type Profile = Database["public"]["Tables"]["profiles"]["Row"]

// Extended profile with computed fields
export interface ProfileWithStats extends Profile {
  stats?: ProfileStats
  isFollowing?: boolean
  isFollowedBy?: boolean
}

// Profile statistics
export interface ProfileStats {
  proverbsCount: number
  followersCount: number
  followingCount: number
  likesReceivedCount?: number
  totalPoints?: number
}

// Follow relationship types
export interface FollowRelationship {
  id: string
  follower_id: string
  following_id: string
  created_at: string
  follower?: Profile
  following?: Profile
}

// Follower/Following list item
export interface FollowListItem {
  id: string
  username: string
  avatar_url?: string
  bio?: string
  country?: string
  isFollowing?: boolean
  followedAt?: string
}

// Profile page data (optimized single query result)
export interface ProfilePageData {
  profile: Profile
  stats: ProfileStats
  proverbs: Array<{
    id: string
    proverb: string
    meaning?: string
    created_at: string
    likes_count?: number
    comments_count?: number
  }>
  followers: FollowListItem[]
  following: FollowListItem[]
}

// Authentication types
export interface AuthUser {
  id: string
  email?: string
  user_metadata?: Record<string, any>
  app_metadata?: Record<string, any>
  created_at: string
  updated_at: string
}

export interface AuthSession {
  user: AuthUser
  session: {
    access_token: string
    refresh_token: string
    expires_at: number
  }
}

// Service response types
export interface ServiceResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

// Profile update result
export interface ProfileUpdateResult {
  success: boolean
  profile: Profile
  message?: string
}

// Authentication result
export interface AuthResult {
  success: boolean
  user?: AuthUser
  session?: any
  error?: string
}

// Rate limiting types
export interface RateLimitInfo {
  allowed: boolean
  remaining: number
  resetTime: number
  retryAfter?: number
}

// Validation error types
export interface ValidationError {
  field: string
  message: string
  code?: string
}

export interface ValidationResult {
  success: boolean
  errors?: ValidationError[]
  data?: any
}

// Component state types
export interface ProfileFormState {
  isLoading: boolean
  error: string | null
  success: string | null
  isDirty: boolean
}

export interface FollowButtonState {
  isFollowing: boolean
  isLoading: boolean
  followersCount: number
}

// API types for profile operations
export interface UpdateProfileRequest {
  username?: string
  bio?: string
  country?: string
}

export interface UpdateEmailRequest {
  email: string
  currentPassword: string
}

export interface UpdatePasswordRequest {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}

export interface CheckUsernameRequest {
  username: string
}

export interface CheckUsernameResponse {
  available: boolean
  suggestion?: string
}

// Search and filter types
export interface ProfileSearchFilters {
  query?: string
  country?: string
  hasBio?: boolean
  minPoints?: number
  maxPoints?: number
  isVerified?: boolean
}

export interface ProfileSearchResult {
  profiles: ProfileWithStats[]
  total: number
  hasMore: boolean
  nextCursor?: string
}

// Notification types for profile actions
export interface ProfileNotification {
  id: string
  type: 'follow' | 'like' | 'comment' | 'mention'
  fromUser: Profile
  targetUser: Profile
  relatedId?: string
  message: string
  createdAt: string
  isRead: boolean
}

// Settings types
export interface ProfileSettings {
  emailNotifications: boolean
  pushNotifications: boolean
  privateProfile: boolean
  showOnlineStatus: boolean
  language: string
  timezone: string
}

// Export commonly used types
export type {
  Database,
  Profile as BaseProfile,
  FollowRelationship as Follow,
  ProfileWithStats as ExtendedProfile,
  ProfileStats as Stats,
  FollowListItem as Follower,
  ProfilePageData as ProfileData,
  AuthUser as User,
  AuthSession as Session,
}