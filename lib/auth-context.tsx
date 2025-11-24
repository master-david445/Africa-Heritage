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
  login: (email: string, password: string) => Promise<void>
  signup: (name: string, email: string, password: string) => Promise<void>
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

  const login = async (email: string, password: string) => {
    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
  }

  const signup = async (name: string, email: string, password: string) => {
    const supabase = createClient()
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name }
      }
    })
    if (error) throw error
  }

  const refreshProfile = async () => {
    if (user?.id) {
      await fetchProfile(user.id)
    }
  }

  useEffect(() => {
    const supabase = createClient()
    let isMounted = true

    const initializeAuth = async (): Promise<void> => {
      if (!isMounted) return

      setAuthError(null)

      try {
        const { data: { session }, error } = await supabase.auth.getSession()

        if (error) {
          console.error('Auth session error:', error)
          if (isMounted) {
            setAuthError(`Connection error: ${error.message}`)
            setUser(null)
            setProfile(null)
            setIsLoading(false)
          }
          return
        }

        if (isMounted) {
          setUser(session?.user || null)

          // Don't block the UI on profile fetch
          setIsLoading(false)

          if (session?.user) {
            fetchProfile(session.user.id).catch(profileError => {
              console.error('Profile fetch error:', profileError)
            })
          } else {
            setProfile(null)
          }
        }
      } catch (err) {
        console.error('Auth initialization error:', err)
        if (isMounted) {
          setAuthError('Unable to connect. Please refresh the page.')
          setUser(null)
          setProfile(null)
          setIsLoading(false)
        }
      }
    }

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
          fetchProfile(session.user.id).catch(profileError => {
            console.error('Profile fetch error in auth state change:', profileError)
          })
        } else {
          setProfile(null)
        }
        setIsLoading(false)
      }
    })

    return () => {
      isMounted = false
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
      subscription?.unsubscribe()
    }
  }, [fetchProfile])

  return <AuthContext.Provider value={{ user, profile, isLoading, authError, login, signup, refreshProfile }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (undefined === context) {
    throw new Error("useAuth must be used within AuthProvider")
  }
  return context
}
