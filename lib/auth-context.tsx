"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import type { User } from "./types"

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  signup: (name: string, email: string, password: string) => Promise<void>
  logout: () => void
  followUser: (userId: string) => void
  unfollowUser: (userId: string) => void
  isFollowing: (userId: string) => boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [following, setFollowing] = useState<string[]>([])

  useEffect(() => {
    // Check localStorage for existing session
    const storedUser = localStorage.getItem("user")
    const storedFollowing = localStorage.getItem("following")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    if (storedFollowing) {
      setFollowing(JSON.parse(storedFollowing))
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    // Mock login - in production, call your API
    const mockUser: User = {
      id: "1",
      name: "User",
      email,
      bio: "Passionate about African wisdom and culture",
      country: "Ghana",
      avatar: "/placeholder-user.jpg",
      joinedDate: new Date(),
      proverbsCount: 0,
      followersCount: 0,
      followingCount: 0,
      points: 0,
      badges: [],
      isAdmin: false,
      isVerified: false,
      isSuspended: false,
    }
    setUser(mockUser)
    localStorage.setItem("user", JSON.stringify(mockUser))
  }

  const signup = async (name: string, email: string, password: string) => {
    // Mock signup - in production, call your API
    const mockUser: User = {
      id: Math.random().toString(),
      name,
      email,
      bio: "",
      country: "",
      avatar: "/placeholder-user.jpg",
      joinedDate: new Date(),
      proverbsCount: 0,
      followersCount: 0,
      followingCount: 0,
      points: 0,
      badges: [],
      isAdmin: false,
      isVerified: false,
      isSuspended: false,
    }
    setUser(mockUser)
    localStorage.setItem("user", JSON.stringify(mockUser))
  }

  const logout = () => {
    setUser(null)
    setFollowing([])
    localStorage.removeItem("user")
    localStorage.removeItem("following")
  }

  const followUser = (userId: string) => {
    if (!following.includes(userId)) {
      const newFollowing = [...following, userId]
      setFollowing(newFollowing)
      localStorage.setItem("following", JSON.stringify(newFollowing))
      if (user) {
        setUser({ ...user, followingCount: user.followingCount + 1 })
      }
    }
  }

  const unfollowUser = (userId: string) => {
    const newFollowing = following.filter((id) => id !== userId)
    setFollowing(newFollowing)
    localStorage.setItem("following", JSON.stringify(newFollowing))
    if (user) {
      setUser({ ...user, followingCount: Math.max(0, user.followingCount - 1) })
    }
  }

  const isFollowing = (userId: string) => following.includes(userId)

  return (
    <AuthContext.Provider value={{ user, isLoading, login, signup, logout, followUser, unfollowUser, isFollowing }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (undefined === context) {
    throw new Error("useAuth must be used within AuthProvider")
  }
  return context
}
