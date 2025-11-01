"use client"

import { useState } from "react"
import { Menu, X, LogOut, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/auth-context"
import AuthModal from "./auth-modal"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [authModalOpen, setAuthModalOpen] = useState(false)
  const [authMode, setAuthMode] = useState<"login" | "signup">("login")
  const { user, logout } = useAuth()
  const router = useRouter()

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/")
    router.refresh()
  }

  const handleAuthClick = (mode: "login" | "signup") => {
    setAuthMode(mode)
    setAuthModalOpen(true)
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
              <Link href="/search" className="hover:opacity-80 transition">
                Search
              </Link>
              <Link href="/leaderboard" className="hover:opacity-80 transition">
                Leaderboard
              </Link>
              {user?.isAdmin && (
                <Link href="/admin" className="hover:opacity-80 transition font-semibold">
                  Admin
                </Link>
              )}
            </nav>

            {/* Auth Buttons */}
            <div className="flex items-center gap-2">
              {user ? (
                <div className="flex items-center gap-3">
                  <span className="hidden sm:inline text-sm">{user.name}</span>
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

              {/* Mobile Menu Button */}
              <button className="md:hidden text-white" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden pb-4 border-t border-white/20">
              <nav className="flex flex-col gap-3 pt-4">
                <Link href="/" className="hover:opacity-80 transition">
                  Home
                </Link>
                <Link href="/explore" className="hover:opacity-80 transition">
                  Explore
                </Link>
                <Link href="/search" className="hover:opacity-80 transition">
                  Search
                </Link>
                <Link href="/leaderboard" className="hover:opacity-80 transition">
                  Leaderboard
                </Link>
                {!user && (
                  <div className="flex gap-2 pt-2">
                    <Link href="/auth/login" className="flex-1">
                      <Button variant="ghost" size="sm" className="text-white hover:bg-white/20 w-full">
                        Login
                      </Button>
                    </Link>
                    <Link href="/auth/sign-up" className="flex-1">
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

      {/* Auth Modal */}
      {authModalOpen && <AuthModal open={authModalOpen} onOpenChange={setAuthModalOpen} mode={authMode} />}
    </>
  )
}
