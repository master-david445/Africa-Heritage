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
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<SupabaseUser | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const fetchProfile = async (userId: string) => {
    try {
      const supabase = createClient()
      const { data, error } = await supabase.from("profiles").select("*").eq("id", userId).single()

      if (error) {
        console.log("[AUTH] Profile fetch error:", error.message)
        // On mobile, retry once after a short delay
        if (isMobile()) {
          console.log("[AUTH] Retrying profile fetch on mobile...")
          await new Promise(resolve => setTimeout(resolve, 500))
          const retry = await supabase.from("profiles").select("*").eq("id", userId).single()
          if (!retry.error) {
            console.log("[AUTH] Profile loaded on retry:", retry.data)
            setProfile(retry.data)
            return
          }
        }
        setProfile(null)
        return
      }

      console.log("[AUTH] Profile loaded:", data)
      setProfile(data)
    } catch (err) {
      console.log("[AUTH] Profile fetch exception:", err)
      setProfile(null)
    }
  }

  useEffect(() => {
    const supabase = createClient()
    let isMounted = true

    const initializeAuth = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession()

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
        console.log("[AUTH] Session check error:", err)
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    initializeAuth()

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

  return <AuthContext.Provider value={{ user, profile, isLoading }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (undefined === context) {
    throw new Error("useAuth must be used within AuthProvider")
  }
  return context
}
