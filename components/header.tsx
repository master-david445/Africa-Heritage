"use client"

import { useState, useEffect } from "react"
import { Menu, X, LogOut, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/auth-context"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import NotificationBell from "@/components/notification-bell"

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [headerError, setHeaderError] = useState<string | null>(null)
  const { user, profile, isLoading, refreshProfile } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading) {
      setHeaderError(null)
      return
    }
    const timeout = setTimeout(() => {
      setHeaderError('Authentication is taking longer than expected')
    }, 10000)
    return () => clearTimeout(timeout)
  }, [isLoading])

  // Removed console.log for production

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/")
    router.refresh()
  }

  return (
    <>
      <header className="sticky top-0 z-50 gradient-african text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition">
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center font-bold text-orange-600">
                AH
              </div>
              <span className="font-serif text-xl font-bold hidden sm:inline">African Heritage</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-6">
              <Link href="/" className="hover:opacity-80 transition">
                Home
              </Link>
              <Link href="/explore" className="hover:opacity-80 transition">
                Explore
              </Link>
              <Link href="/share" className="hover:opacity-80 transition">
                Share Proverb
              </Link>
              <Link href="/search" className="hover:opacity-80 transition">
                Search
              </Link>
              <Link href="/leaderboard" className="hover:opacity-80 transition">
                Leaderboard
              </Link>
              {user && profile && (
                <Link href={`/profile/${user.id}`} className="hover:opacity-80 transition">
                  My Profile
                </Link>
              )}
              {profile?.is_admin && (
                <Link href="/admin" className="hover:opacity-80 transition font-semibold">
                  Admin
                </Link>
              )}
            </nav>

            {/* Auth Buttons */}
            <div className="flex items-center gap-2">
              {isLoading ? (
                // Loading state - show spinner or error
                headerError ? (
                  <div className="text-xs text-red-300 max-w-32 text-right">
                    {headerError}
                  </div>
                ) : (
                  <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                )
              ) : user && profile ? (
                <div className="flex items-center gap-3">
                  <NotificationBell />
                   <span className="hidden sm:inline text-sm">{profile.username}</span>
                   <button
                     onClick={refreshProfile}
                     className="text-white hover:bg-white/20 px-2 py-1 rounded text-xs"
                     title="Refresh Profile"
                   >
                     ↻
                   </button>
                   <Link href={`/profile/${user.id}`}>
                     <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
                       <User className="w-4 h-4" />
                     </Button>
                   </Link>
                   <Button variant="ghost" size="sm" className="text-white hover:bg-white/20" onClick={handleLogout}>
                     <LogOut className="w-4 h-4" />
                   </Button>
                 </div>
               ) : (
                 /* Show login/signup buttons when not loading and no user */
                 <div className="hidden sm:flex gap-2">
                   <Link href="/auth/login">
                     <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
                       Login
                     </Button>
                   </Link>
                   <Link href="/auth/sign-up">
                     <Button size="sm" className="bg-white text-orange-600 hover:bg-gray-100">
                       Sign Up
                     </Button>
                   </Link>
                 </div>
               )}

              {/* Mobile Menu Button - Always visible on mobile */}
              <button className="md:hidden text-white p-1" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="mobile-menu md:hidden pb-4 border-t border-white/20 bg-gradient-to-br from-orange-600 to-red-600">
              <nav className="flex flex-col gap-3 pt-4">
                <Link href="/" className="hover:opacity-80 transition" onClick={() => setMobileMenuOpen(false)}>
                  Home
                </Link>
                <Link href="/explore" className="hover:opacity-80 transition" onClick={() => setMobileMenuOpen(false)}>
                  Explore
                </Link>
                <Link href="/share" className="hover:opacity-80 transition" onClick={() => setMobileMenuOpen(false)}>
                  Share Proverb
                </Link>
                <Link href="/search" className="hover:opacity-80 transition" onClick={() => setMobileMenuOpen(false)}>
                  Search
                </Link>
                <Link href="/leaderboard" className="hover:opacity-80 transition" onClick={() => setMobileMenuOpen(false)}>
                  Leaderboard
                </Link>

                {/* User-specific mobile menu items */}
                {isLoading ? (
                  <div className="flex items-center justify-center py-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  </div>
                ) : user && profile ? (
                  <>
                    <Link href={`/profile/${user.id}`} className="hover:opacity-80 transition" onClick={() => setMobileMenuOpen(false)}>
                      My Profile
                    </Link>
                    {profile.is_admin && (
                      <Link href="/admin" className="hover:opacity-80 transition font-semibold" onClick={() => setMobileMenuOpen(false)}>
                        Admin
                      </Link>
                    )}
                    <div className="flex gap-2 pt-2 border-t border-white/20 mt-2">
                      <button
                        onClick={() => {
                          refreshProfile()
                          setMobileMenuOpen(false)
                        }}
                        className="flex-1 px-3 py-2 text-white hover:bg-white/20 rounded text-sm"
                      >
                        Refresh Profile
                      </button>
                      <button
                        onClick={() => {
                          handleLogout()
                          setMobileMenuOpen(false)
                        }}
                        className="flex-1 px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded text-sm"
                      >
                        Logout
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="flex gap-2 pt-2 border-t border-white/20 mt-2">
                    <Link href="/auth/login" className="flex-1" onClick={() => setMobileMenuOpen(false)}>
                      <Button variant="ghost" size="sm" className="text-white hover:bg-white/20 w-full">
                        Login
                      </Button>
                    </Link>
                    <Link href="/auth/sign-up" className="flex-1" onClick={() => setMobileMenuOpen(false)}>
                      <Button size="sm" className="bg-white text-orange-600 hover:bg-gray-100 w-full">
                        Sign Up
                      </Button>
                    </Link>
                  </div>
                )}
              </nav>
            </div>
          )}
        </div>
      </header>
    </>
  )
}
