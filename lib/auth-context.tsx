"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import type { User as SupabaseUser } from "@supabase/supabase-js"
import type { Database } from "@/lib/database.types"

// Mobile detection utility
const isMobile = () => {
  if (typeof window === 'undefined') return false
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
}

type Profile = Database["public"]["Tables"]["profiles"]["Row"]

interface AuthContextType {
  user: SupabaseUser | null
  profile: Profile | null
  isLoading: boolean
  refreshProfile: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<SupabaseUser | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const fetchProfile = async (userId: string, retryCount = 0) => {
    const maxRetries = isMobile() ? 3 : 1 // More retries on mobile
    const retryDelay = isMobile() ? 1000 : 500 // Longer delay on mobile

    try {
      console.log(`[AUTH] Fetching profile for ${userId} (attempt ${retryCount + 1})`)
      const supabase = createClient()

      // Add timeout for mobile devices
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), isMobile() ? 10000 : 5000) // 10s on mobile, 5s on desktop

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single()

      clearTimeout(timeoutId)

      if (error) {
        console.log(`[AUTH] Profile fetch error (attempt ${retryCount + 1}):`, error.message)

        // Retry logic for mobile devices or network errors
        if ((isMobile() || error.message.includes('network')) && retryCount < maxRetries) {
          console.log(`[AUTH] Retrying profile fetch in ${retryDelay}ms... (${retryCount + 1}/${maxRetries})`)
          await new Promise(resolve => setTimeout(resolve, retryDelay))
          return fetchProfile(userId, retryCount + 1)
        }

        console.error("[AUTH] Profile fetch failed after all retries:", error)
        setProfile(null)
        return
      }

      console.log("[AUTH] Profile loaded successfully:", data?.username || 'unknown user')
      setProfile(data)
    } catch (err) {
      console.log(`[AUTH] Profile fetch exception (attempt ${retryCount + 1}):`, err)

      // Retry on network errors for mobile
      if (isMobile() && retryCount < maxRetries && (
        err instanceof Error && (
          err.name === 'AbortError' ||
          err.message.includes('network') ||
          err.message.includes('fetch')
        )
      )) {
        console.log(`[AUTH] Retrying after network error in ${retryDelay}ms... (${retryCount + 1}/${maxRetries})`)
        await new Promise(resolve => setTimeout(resolve, retryDelay))
        return fetchProfile(userId, retryCount + 1)
      }

      console.error("[AUTH] Profile fetch failed permanently:", err)
      setProfile(null)
    }
  }

  const refreshProfile = async () => {
    if (user?.id) {
      console.log("[AUTH] Manually refreshing profile...")
      await fetchProfile(user.id)
    }
  }

  useEffect(() => {
    const supabase = createClient()
    let isMounted = true
    let timeoutId: NodeJS.Timeout

    const initializeAuth = async () => {
      try {
        console.log("[AUTH] Starting auth initialization...")

        // Set loading to false after a short delay to prevent infinite loading
        timeoutId = setTimeout(() => {
          console.warn("[AUTH] Auth check timeout - assuming no user")
          if (isMounted) {
            setUser(null)
            setProfile(null)
            setIsLoading(false)
          }
        }, 5000) // 5 second timeout

        const { data: { session }, error } = await supabase.auth.getSession()

        // Clear the timeout since we got a response
        clearTimeout(timeoutId)

        if (error) {
          console.error("[AUTH] Auth error:", error)
          if (isMounted) {
            setUser(null)
            setProfile(null)
            setIsLoading(false)
          }
          return
        }

        if (isMounted) {
          console.log("[AUTH] Initial session check:", session?.user?.id ? "user found" : "no user")
          setUser(session?.user || null)

          if (session?.user) {
            await fetchProfile(session.user.id)
          } else {
            setProfile(null)
          }
          setIsLoading(false)
        }
      } catch (err) {
        console.error("[AUTH] Auth initialization failed:", err)
        clearTimeout(timeoutId)
        if (isMounted) {
          setUser(null)
          setProfile(null)
          setIsLoading(false)
        }
      }
    }

    initializeAuth()

    return () => {
      isMounted = false
      clearTimeout(timeoutId)
    }

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("[AUTH] Auth state changed:", event, session?.user?.id ? "user found" : "no user")

      if (isMounted) {
        setUser(session?.user || null)

        if (session?.user) {
          await fetchProfile(session.user.id)
        } else {
          setProfile(null)
        }
        setIsLoading(false)
      }
    })

    return () => {
      isMounted = false
      subscription?.unsubscribe()
    }
  }, [])

  return <AuthContext.Provider value={{ user, profile, isLoading, refreshProfile }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (undefined === context) {
    throw new Error("useAuth must be used within AuthProvider")
  }
  return context
}
