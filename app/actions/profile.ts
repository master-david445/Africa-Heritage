"use server"

import { ProfileService } from "@/lib/services/profile"
import { AuthService } from "@/lib/services/auth"
import { updateProfileSchema, updateEmailSchema, updatePasswordSchema, checkUsernameAvailabilitySchema } from "@/lib/validations/profile"
import { revalidatePath } from "next/cache"
import { logSecurityEvent } from "@/lib/utils/security-logger"
import { logger } from "@/lib/utils/logger"

// Rate limiting store for profile actions (in production, use Redis)
const profileActionLimits = new Map<string, { count: number; resetTime: number }>()

/**
 * Check rate limit for profile actions
 */
function checkProfileActionRateLimit(userId: string, maxActions: number = 10, windowMs: number = 60 * 1000): boolean {
  const key = `profile_actions_${userId}`
  const now = Date.now()
  const record = profileActionLimits.get(key)

  if (!record || now > record.resetTime) {
    profileActionLimits.set(key, {
      count: 1,
      resetTime: now + windowMs
    })
    return true
  }

  if (record.count >= maxActions) {
    return false
  }

  record.count++
  return true
}

export async function getCurrentUser() {
  try {
    const result = await AuthService.getCurrentUser()
    return result?.profile || null
  } catch (error) {
    logger.error("[PROFILE_ACTIONS] Get current user error:", error)
    throw new Error("Failed to get current user")
  }
}

export async function getUserProfile(username: string) {
  try {
    if (!username?.trim()) {
      throw new Error("Username is required")
    }

    const profile = await ProfileService.getUserProfile(username)
    return profile
  } catch (error) {
    logger.error("[PROFILE_ACTIONS] Get user profile error:", error)
    throw error
  }
}

export async function getUserProfileById(userId: string) {
  try {
    if (!userId?.trim()) {
      throw new Error("User ID is required")
    }

    const profile = await ProfileService.getUserProfileById(userId)
    return profile
  } catch (error) {
    logger.error("[PROFILE_ACTIONS] Get user profile by ID error:", error)
    throw error
  }
}

export async function updateProfile(updates: {
  username?: string
  bio?: string
  country?: string
  avatar_url?: string
}) {
  try {
    // Validate input
    const validationResult = updateProfileSchema.safeParse(updates)
    if (!validationResult.success) {
      throw new Error(`Validation failed: ${validationResult.error.errors.map(e => e.message).join(', ')}`)
    }

    // Check rate limit
    const currentUser = await AuthService.getCurrentUser()
    if (!currentUser) {
      throw new Error("Unauthorized: User not authenticated")
    }

    if (!checkProfileActionRateLimit(currentUser.user.id, 5, 60 * 1000)) {
      throw new Error("Too many profile updates. Please wait before trying again.")
    }

    logger.info("[PROFILE_ACTIONS] Updating profile for user:", { userId: currentUser.user.id })

    const result = await ProfileService.updateProfile(validationResult.data)

    // Revalidate profile page
    revalidatePath(`/profile/${result.username}`)
    revalidatePath('/profile')

    return result
  } catch (error) {
    logger.error("[PROFILE_ACTIONS] Update profile error:", error)
    throw error
  }
}

export async function getProfileStats(userId: string) {
  try {
    if (!userId?.trim()) {
      throw new Error("User ID is required")
    }

    const stats = await ProfileService.getProfileStats(userId)
    return stats
  } catch (error) {
    logger.error("[PROFILE_ACTIONS] Get profile stats error:", error)
    throw error
  }
}

export async function updateEmail(input: {
  email: string
  currentPassword: string
}) {
  try {
    // Validate input
    const validationResult = updateEmailSchema.safeParse(input)
    if (!validationResult.success) {
      throw new Error(`Validation failed: ${validationResult.error.errors.map(e => e.message).join(', ')}`)
    }

    // Check rate limit
    const currentUser = await AuthService.getCurrentUser()
    if (!currentUser) {
      throw new Error("Unauthorized: User not authenticated")
    }

    if (!checkProfileActionRateLimit(currentUser.user.id, 2, 60 * 60 * 1000)) { // 2 per hour for email changes
      throw new Error("Too many email change attempts. Please wait before trying again.")
    }

    logger.info("[PROFILE_ACTIONS] Updating email for user:", { userId: currentUser.user.id })

    const result = await ProfileService.updateEmail(validationResult.data)

    // Log security event
    await logSecurityEvent({
      user_id: currentUser.user.id,
      event_type: 'email_change_requested',
      metadata: {
        old_email: currentUser.user.email,
        new_email: input.email,
      },
    })

    return result
  } catch (error) {
    logger.error("[PROFILE_ACTIONS] Update email error:", error)
    throw error
  }
}

export async function updatePassword(input: {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}) {
  try {
    // Validate input
    const validationResult = updatePasswordSchema.safeParse(input)
    if (!validationResult.success) {
      throw new Error(`Validation failed: ${validationResult.error.errors.map(e => e.message).join(', ')}`)
    }

    // Check rate limit
    const currentUser = await AuthService.getCurrentUser()
    if (!currentUser) {
      throw new Error("Unauthorized: User not authenticated")
    }

    if (!checkProfileActionRateLimit(currentUser.user.id, 3, 60 * 60 * 1000)) { // 3 per hour for password changes
      throw new Error("Too many password change attempts. Please wait before trying again.")
    }

    logger.info("[PROFILE_ACTIONS] Updating password for user:", { userId: currentUser.user.id })

    const result = await ProfileService.updatePassword(validationResult.data)

    // Log security event
    await logSecurityEvent({
      user_id: currentUser.user.id,
      event_type: 'password_changed',
      metadata: {
        timestamp: new Date().toISOString(),
      },
    })

    return result
  } catch (error) {
    logger.error("[PROFILE_ACTIONS] Update password error:", error)
    throw error
  }
}

export async function checkUsernameAvailability(username: string): Promise<boolean> {
  try {
    // Validate input
    const validationResult = checkUsernameAvailabilitySchema.safeParse({ username })
    if (!validationResult.success) {
      return false // Invalid format = not available
    }

    const isAvailable = await ProfileService.checkUsernameAvailability(validationResult.data)
    return isAvailable
  } catch (error) {
    logger.error("[PROFILE_ACTIONS] Check username availability error:", error)
    return false
  }
}

export async function getProfilePageData(userId: string) {
  try {
    if (!userId?.trim()) {
      throw new Error("User ID is required")
    }

    const data = await ProfileService.getProfilePageData(userId)
    return data
  } catch (error) {
    logger.error("[PROFILE_ACTIONS] Get profile page data error:", error)
    throw error
  }
}
