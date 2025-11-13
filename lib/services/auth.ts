import { createClient } from "@/lib/supabase/client"
import type { SignInInput } from "@/lib/validations/profile"

/**
 * Authentication service layer
 * Handles authentication-related operations with proper security measures
 */

export class AuthService {
  /**
   * Client-side password verification - limited functionality
   * For full password verification, use server actions
   */
  static async verifyCurrentPassword(currentPassword: string): Promise<boolean> {
    // Client-side password verification is limited
    // This method now only checks if a user is authenticated
    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      return !!user
    } catch {
      return false
    }
  }

  /**
   * Gets the current authenticated user with profile data
   */
  static async getCurrentUser() {
    try {
      const supabase = createClient()

      const { data: { user }, error: userError } = await supabase.auth.getUser()

      if (userError || !user) {
        return null
      }

      // Get profile data
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single()

      if (profileError) {
        console.error("[AUTH_SERVICE] Failed to get profile:", profileError)
        return null
      }

      return {
        user,
        profile,
      }
    } catch (error) {
      console.error("[AUTH_SERVICE] Get current user error:", error)
      return null
    }
  }

  /**
   * Checks if the current user is authenticated
   */
  static async isAuthenticated(): Promise<boolean> {
    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      return !!user
    } catch {
      return false
    }
  }

  /**
   * Gets user profile by username (case-insensitive)
   */
  static async getUserByUsername(username: string) {
    try {
      const supabase = createClient()

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .ilike("username", username) // Case-insensitive search
        .single()

      if (error) {
        console.log("[AUTH_SERVICE] User lookup error:", error.message)
        return null
      }

      return data
    } catch (error) {
      console.error("[AUTH_SERVICE] Get user by username error:", error)
      return null
    }
  }

  /**
   * Validates if an identifier is an email or username
   */
  static parseIdentifier(identifier: string): { type: 'email' | 'username'; value: string } {
    // Proper email regex validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (emailRegex.test(identifier)) {
      return { type: 'email', value: identifier }
    }

    // Assume username if it doesn't match email pattern
    return { type: 'username', value: identifier }
  }

  /**
   * Enhanced sign-in that handles both email and username
   */
  static async signIn(input: SignInInput) {
    try {
      const supabase = createClient()

      const { identifier, password } = input
      const parsed = this.parseIdentifier(identifier)

      let loginEmail = identifier

      if (parsed.type === 'username') {
        // Lookup email by username
        const userProfile = await this.getUserByUsername(parsed.value)
        if (!userProfile?.email) {
          throw new Error("Username not found. Please check your username or use your email address.")
        }
        loginEmail = userProfile.email
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email: loginEmail,
        password,
      })

      if (error) {
        throw error
      }

      return data
    } catch (error) {
      console.error("[AUTH_SERVICE] Sign in error:", error)
      throw error
    }
  }

  /**
   * Rate limiting helper - tracks attempts per user/IP
   * Note: This is a basic implementation. Consider using Redis for production
   */
  private static rateLimitCache = new Map<string, { attempts: number; lastAttempt: number }>()

  static checkRateLimit(identifier: string, maxAttempts = 5, windowMs = 15 * 60 * 1000): boolean {
    const key = `auth_${identifier}`
    const now = Date.now()
    const record = this.rateLimitCache.get(key)

    if (!record) {
      this.rateLimitCache.set(key, { attempts: 1, lastAttempt: now })
      return true
    }

    // Reset if window has passed
    if (now - record.lastAttempt > windowMs) {
      this.rateLimitCache.set(key, { attempts: 1, lastAttempt: now })
      return true
    }

    // Check if under limit
    if (record.attempts < maxAttempts) {
      record.attempts++
      return true
    }

    return false
  }
}