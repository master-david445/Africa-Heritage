"use client"

import type React from "react"

import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { logger } from "@/lib/utils/logger"

export default function LoginPage() {
  const [identifier, setIdentifier] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const validateIdentifier = (value: string): string | null => {
    if (!value.trim()) return "Email or username is required"

    // Use proper email regex validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    const isEmail = emailRegex.test(value)

    if (isEmail) {
      // Additional email validation for common issues
      if (value.includes('..') || value.startsWith('.') || value.endsWith('.')) {
        return "Please enter a valid email address"
      }
    } else {
      // Username validation
      if (value.length < 3) return "Username must be at least 3 characters"
      if (value.length > 30) return "Username must be less than 30 characters"
      if (!/^[a-zA-Z0-9_]+$/.test(value)) return "Username can only contain letters, numbers, and underscores"
    }

    return null
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()

    const validationError = validateIdentifier(identifier)
    if (validationError) {
      setError(validationError)
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      logger.info("[LOGIN] Attempting login for:", { identifier })

      // Check rate limit
      try {
        const rateLimitRes = await fetch('/api/auth/check-rate-limit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ identifier }),
        })

        if (!rateLimitRes.ok) {
          const data = await rateLimitRes.json()
          setError(data.error || "Too many login attempts. Please try again later.")
          setIsLoading(false)
          return
        }
      } catch (err) {
        // Ignore rate limit check errors (fail open)
        logger.error("Rate limit check failed:", err)
      }

      // Import AuthService dynamically to avoid SSR issues
      const { AuthService } = await import("@/lib/services/auth")

      // Use enhanced sign-in with proper identifier parsing
      const result = await AuthService.signIn({
        identifier,
        password,
      })

      logger.info("[LOGIN] Login successful, user:", { userId: result.user?.id })
      logger.info("[LOGIN] Session:", { exists: !!result.session })

      // Wait a moment for auth state to propagate
      await new Promise(resolve => setTimeout(resolve, 100))

      // Redirect to home after successful login
      router.push("/")
      router.refresh()
    } catch (error: unknown) {
      logger.error("[LOGIN] Login failed:", error)

      // Provide more specific error messages
      let errorMessage = "An error occurred during login"
      if (error instanceof Error) {
        if (error.message.includes("Invalid login credentials")) {
          errorMessage = "Invalid email/username or password. Please check your credentials and try again."
        } else if (error.message.includes("Email not confirmed")) {
          errorMessage = "Please check your email and click the confirmation link before logging in."
        } else if (error.message.includes("Too many requests")) {
          errorMessage = "Too many login attempts. Please wait a few minutes before trying again."
        } else {
          errorMessage = error.message
        }
      }

      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10 bg-gradient-to-br from-orange-50 to-amber-50">
      <div className="w-full max-w-sm">
        <div className="flex flex-col gap-6">
          <Card className="border-0 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-t-lg">
              <CardTitle className="text-2xl">Welcome Back</CardTitle>
              <CardDescription className="text-orange-50">Login to your Koroba account</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <form onSubmit={handleLogin}>
                <div className="flex flex-col gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="identifier">Email or Username</Label>
                    <Input
                      id="identifier"
                      type="text"
                      placeholder="Enter email or username"
                      required
                      value={identifier}
                      onChange={(e) => setIdentifier(e.target.value)}
                      className="border-orange-200 focus:border-orange-500"
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="border-orange-200 focus:border-orange-500"
                    />
                  </div>

                  {error && <p className="text-sm text-red-500 font-medium">{error}</p>}

                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-semibold"
                    disabled={isLoading}
                  >
                    {isLoading ? "Logging in..." : "Login"}
                  </Button>
                </div>

                <div className="mt-4 text-center text-sm text-gray-600">
                  Don&apos;t have an account?{" "}
                  <Link href="/auth/sign-up" className="text-orange-600 font-semibold hover:underline">
                    Sign up
                  </Link>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
