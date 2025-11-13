import { createClient } from "@/lib/supabase/server"
import { AuthService } from "./auth"
import type {
  UpdateProfileInput,
  UpdateEmailInput,
  UpdatePasswordInput,
  CheckUsernameAvailabilityInput
} from "@/lib/validations/profile"

/**
 * Profile service layer
 * Handles all profile-related operations with proper security and validation
 */

export class ProfileService {
  /**
   * Updates user profile information
   * Requires authentication and ownership verification
   */
  static async updateProfile(updates: UpdateProfileInput) {
    try {
      // Verify authentication
      const currentUser = await AuthService.getCurrentUser()
      if (!currentUser) {
        throw new Error("Unauthorized: User not authenticated")
      }

      const supabase = await createClient()

      // Check username availability if changing
      if (updates.username !== currentUser.profile.username) {
        const isAvailable = await this.checkUsernameAvailability({
          username: updates.username
        })
        if (!isAvailable) {
          throw new Error("Username is already taken")
        }
      }

      // Update profile
      const { data, error } = await supabase
        .from("profiles")
        .update({
          username: updates.username,
          bio: updates.bio || null,
          country: updates.country || null,
          updated_at: new Date().toISOString(),
        })
        .eq("id", currentUser.user.id)
        .select()
        .single()

      if (error) {
        console.error("[PROFILE_SERVICE] Update profile error:", error)
        throw new Error(`Failed to update profile: ${error.message}`)
      }

      console.log("[PROFILE_SERVICE] Profile updated successfully")
      return data
    } catch (error) {
      console.error("[PROFILE_SERVICE] Update profile error:", error)
      throw error
    }
  }

  /**
   * Updates user email with password verification
   * CRITICAL SECURITY: Requires current password confirmation
   */
  static async updateEmail(input: UpdateEmailInput) {
    try {
      // Verify authentication
      const currentUser = await AuthService.getCurrentUser()
      if (!currentUser) {
        throw new Error("Unauthorized: User not authenticated")
      }

      // CRITICAL: Verify current password before allowing email change
      const isPasswordValid = await AuthService.verifyCurrentPassword(input.currentPassword)
      if (!isPasswordValid) {
        throw new Error("Current password is incorrect")
      }

      const supabase = await createClient()

      // Update email in auth system
      const { error: authError } = await supabase.auth.updateUser({
        email: input.email
      })

      if (authError) {
        console.error("[PROFILE_SERVICE] Update email auth error:", authError)
        throw new Error(`Failed to update email: ${authError.message}`)
      }

      console.log("[PROFILE_SERVICE] Email update initiated successfully")
      return { success: true, message: "Email update initiated. Please check your email for confirmation." }
    } catch (error) {
      console.error("[PROFILE_SERVICE] Update email error:", error)
      throw error
    }
  }

  /**
   * Updates user password with current password verification
   * CRITICAL SECURITY: Requires current password confirmation
   */
  static async updatePassword(input: UpdatePasswordInput) {
    try {
      // Verify authentication
      const currentUser = await AuthService.getCurrentUser()
      if (!currentUser) {
        throw new Error("Unauthorized: User not authenticated")
      }

      // CRITICAL: Verify current password before allowing password change
      const isPasswordValid = await AuthService.verifyCurrentPassword(input.currentPassword)
      if (!isPasswordValid) {
        throw new Error("Current password is incorrect")
      }

      const supabase = await createClient()

      // Update password in auth system
      const { error: authError } = await supabase.auth.updateUser({
        password: input.newPassword
      })

      if (authError) {
        console.error("[PROFILE_SERVICE] Update password auth error:", authError)
        throw new Error(`Failed to update password: ${authError.message}`)
      }

      console.log("[PROFILE_SERVICE] Password updated successfully")
      return { success: true, message: "Password updated successfully" }
    } catch (error) {
      console.error("[PROFILE_SERVICE] Update password error:", error)
      throw error
    }
  }

  /**
   * Checks if a username is available (case-insensitive)
   */
  static async checkUsernameAvailability(input: CheckUsernameAvailabilityInput): Promise<boolean> {
    try {
      const supabase = await createClient()

      // Get current user to exclude their own username
      const currentUser = await AuthService.getCurrentUser()
      const excludeUserId = currentUser?.user?.id

      let query = supabase
        .from("profiles")
        .select("id")
        .ilike("username", input.username) // Case-insensitive search

      // Exclude current user's username if they're updating
      if (excludeUserId) {
        query = query.neq("id", excludeUserId)
      }

      const { data, error } = await query.single()

      if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
        console.error("[PROFILE_SERVICE] Username availability check error:", error)
        throw new Error("Failed to check username availability")
      }

      const isAvailable = !data
      console.log(`[PROFILE_SERVICE] Username "${input.username}" availability:`, isAvailable)
      return isAvailable
    } catch (error) {
      console.error("[PROFILE_SERVICE] Check username availability error:", error)
      throw error
    }
  }

  /**
   * Gets user profile by username (case-insensitive)
   */
  static async getUserProfile(username: string) {
    try {
      const supabase = await createClient()

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .ilike("username", username)
        .single()

      if (error) {
        console.log("[PROFILE_SERVICE] Get user profile error:", error.message)
        return null
      }

      return data
    } catch (error) {
      console.error("[PROFILE_SERVICE] Get user profile error:", error)
      throw error
    }
  }

  /**
   * Gets user profile by ID
   */
  static async getUserProfileById(userId: string) {
    try {
      const supabase = await createClient()

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single()

      if (error) {
        console.log("[PROFILE_SERVICE] Get user profile by ID error:", error.message)
        return null
      }

      return data
    } catch (error) {
      console.error("[PROFILE_SERVICE] Get user profile by ID error:", error)
      throw error
    }
  }

  /**
   * Gets profile statistics (followers, following, proverbs count)
   */
  static async getProfileStats(userId: string) {
    try {
      const supabase = await createClient()

      // Get proverbs count
      const { count: proverbsCount } = await supabase
        .from("proverbs")
        .select("*", { count: "exact", head: true })
        .eq("user_id", userId)

      // Get followers count
      const { count: followersCount } = await supabase
        .from("follows")
        .select("*", { count: "exact", head: true })
        .eq("following_id", userId)

      // Get following count
      const { count: followingCount } = await supabase
        .from("follows")
        .select("*", { count: "exact", head: true })
        .eq("follower_id", userId)

      const stats = {
        proverbsCount: proverbsCount || 0,
        followersCount: followersCount || 0,
        followingCount: followingCount || 0,
      }

      console.log(`[PROFILE_SERVICE] Profile stats for ${userId}:`, stats)
      return stats
    } catch (error) {
      console.error("[PROFILE_SERVICE] Get profile stats error:", error)
      throw error
    }
  }

  /**
   * Gets combined profile data with stats and relationships
   * Optimized single query approach
   */
  static async getProfilePageData(userId: string) {
    try {
      const supabase = await createClient()

      // Get profile
      const profile = await this.getUserProfileById(userId)
      if (!profile) {
        throw new Error("Profile not found")
      }

      // Get stats
      const stats = await this.getProfileStats(userId)

      // Get recent proverbs (limit for performance)
      const { data: proverbs, error: proverbsError } = await supabase
        .from("proverbs")
        .select(`
          *,
          profiles:user_id (
            username,
            avatar_url
          )
        `)
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(10)

      if (proverbsError) {
        console.error("[PROFILE_SERVICE] Get proverbs error:", proverbsError)
      }

      // Get followers (limit for performance)
      const { data: followers, error: followersError } = await supabase
        .from("follows")
        .select(`
          follower_id,
          profiles:follower_id (
            id,
            username,
            avatar_url
          )
        `)
        .eq("following_id", userId)
        .limit(10)

      if (followersError) {
        console.error("[PROFILE_SERVICE] Get followers error:", followersError)
      }

      // Get following (limit for performance)
      const { data: following, error: followingError } = await supabase
        .from("follows")
        .select(`
          following_id,
          profiles:following_id (
            id,
            username,
            avatar_url
          )
        `)
        .eq("follower_id", userId)
        .limit(10)

      if (followingError) {
        console.error("[PROFILE_SERVICE] Get following error:", followingError)
      }

      return {
        profile,
        stats,
        proverbs: proverbs || [],
        followers: followers || [],
        following: following || [],
      }
    } catch (error) {
      console.error("[PROFILE_SERVICE] Get profile page data error:", error)
      throw error
    }
  }
}