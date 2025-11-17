"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState, useCallback, useRef } from "react"
import { createClient } from "@/lib/supabase/client"
import type { User as SupabaseUser } from "@supabase/supabase-js"
import type { Database } from "@/lib/database.types"


type Profile = Database["public"]["Tables"]["profiles"]["Row"]

interface AuthContextType {
  user: SupabaseUser | null
  profile: Profile | null
  isLoading: boolean
  authError: string | null
  refreshProfile: () => Promise<void>
}

// Prevent duplicate profile fetches
const profileFetchCache = new Map<string, Promise<any>>();

function getCachedProfileFetch(userId: string, fetcher: () => Promise<any>) {
  if (profileFetchCache.has(userId)) {
    return profileFetchCache.get(userId)!;
  }

  const promise = fetcher().finally(() => {
    profileFetchCache.delete(userId);
  });

  profileFetchCache.set(userId, promise);
  return promise;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<SupabaseUser | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [authError, setAuthError] = useState<string | null>(null)

  const hasFetchedRef = useRef(false)
  const abortControllerRef = useRef<AbortController | null>(null)
  const isFetchingRef = useRef(false)
  const prevUserRef = useRef<SupabaseUser | null>(null)

  const fetchProfile = useCallback(async (userId: string) => {
    if (isFetchingRef.current) return

    hasFetchedRef.current = true
    isFetchingRef.current = true

    await getCachedProfileFetch(userId, async () => {
      try {
        const supabase = createClient()

        const controller = new AbortController()
        abortControllerRef.current = controller
        const timeoutId = setTimeout(() => controller.abort(), 10000)

        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", userId)
          .abortSignal(controller.signal)
          .single()

        clearTimeout(timeoutId)

        if (error) {
          setProfile(null)
        } else {
          setProfile(data)
        }
      } catch (err) {
        if (err instanceof Error && err.name === 'AbortError') {
          // Aborted
        } else {
          setProfile(null)
        }
      }
    })

    hasFetchedRef.current = false
    isFetchingRef.current = false
  }, [])

  const refreshProfile = async () => {
    if (user?.id) {
      await fetchProfile(user.id)
    }
  }

  useEffect(() => {
    const supabase = createClient()
    let isMounted = true
    let timeoutId: NodeJS.Timeout
    let timedOut = false

    const initializeAuth = async () => {
      setAuthError(null)

      try {
        const { data: { session }, error } = await supabase.auth.getSession()

        // Check if timed out
        if (timedOut) {
          return
        }

        // Clear the timeout since we got a response
        clearTimeout(timeoutId)

        if (error) {
          if (isMounted) {
            setAuthError(`Auth error: ${error.message}`)
            setUser(null)
            setProfile(null)
            setIsLoading(false)
          }
          return
        }

        if (isMounted) {
          setUser(session?.user || null)

          if (session?.user) {
            await fetchProfile(session.user.id)
          } else {
            setProfile(null)
          }
          setIsLoading(false)
        }
      } catch (err) {
        clearTimeout(timeoutId)
        if (isMounted) {
          setAuthError('Auth initialization failed')
          setUser(null)
          setProfile(null)
          setIsLoading(false)
        }
      }
    }

    // Set error state after timeout to prevent infinite loading
    timeoutId = setTimeout(() => {
      timedOut = true
      if (isMounted) {
        setAuthError('Authentication check timed out')
        setIsLoading(false)
      }
    }, 5000) // 5 second timeout

    initializeAuth()

    // Set up auth state change listener
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (isMounted) {
        if (session?.user?.id !== prevUserRef.current?.id) {
          hasFetchedRef.current = false
        }
        prevUserRef.current = session?.user || null
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
      clearTimeout(timeoutId)
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
      subscription?.unsubscribe()
    }
  }, [])

  return <AuthContext.Provider value={{ user, profile, isLoading, authError, refreshProfile }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (undefined === context) {
    throw new Error("useAuth must be used within AuthProvider")
  }
  return context
}
