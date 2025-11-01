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

export default function SignUpPage() {
  const [email, setEmail] = useState("")
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [repeatPassword, setRepeatPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [usernameError, setUsernameError] = useState<string | null>(null)
  const router = useRouter()

  // Check username availability
  const checkUsernameAvailability = async (username: string) => {
    if (!username) return
    const supabase = createClient()
    const { data, error } = await supabase.from("profiles").select("id").eq("username", username).single()

    if (error?.code === "PGRST116") {
      // No rows found - username is available
      setUsernameError(null)
      return true
    } else if (data) {
      // Username already exists
      setUsernameError("Username already taken")
      return false
    }
  }

  const handleUsernameChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setUsername(value)
    if (value.length > 2) {
      await checkUsernameAvailability(value)
    }
  }

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    const supabase = createClient()
    setIsLoading(true)
    setError(null)

    // Validation
    if (password !== repeatPassword) {
      setError("Passwords do not match")
      setIsLoading(false)
      return
    }

    if (username.length < 3) {
      setUsernameError("Username must be at least 3 characters")
      setIsLoading(false)
      return
    }

    if (usernameError) {
      setError("Please choose a different username")
      setIsLoading(false)
      return
    }

    try {
      // Sign up with email and password, pass username as metadata
      const { error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username,
          },
          emailRedirectTo: process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL || window.location.origin,
        },
      })

      if (authError) throw authError

      // Show success message
      router.push("/auth/sign-up-success")
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred during signup")
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
              <CardTitle className="text-2xl">Join African Heritage</CardTitle>
              <CardDescription className="text-orange-50">Create your account to share proverbs</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <form onSubmit={handleSignUp}>
                <div className="flex flex-col gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="username">Username</Label>
                    <Input
                      id="username"
                      type="text"
                      placeholder="Choose your unique username"
                      required
                      value={username}
                      onChange={handleUsernameChange}
                      className="border-orange-200 focus:border-orange-500"
                    />
                    {usernameError && <p className="text-sm text-red-500">{usernameError}</p>}
                    {!usernameError && username.length > 2 && (
                      <p className="text-sm text-green-600">Username available</p>
                    )}
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="m@example.com"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
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

                  <div className="grid gap-2">
                    <Label htmlFor="repeat-password">Confirm Password</Label>
                    <Input
                      id="repeat-password"
                      type="password"
                      required
                      value={repeatPassword}
                      onChange={(e) => setRepeatPassword(e.target.value)}
                      className="border-orange-200 focus:border-orange-500"
                    />
                  </div>

                  {error && <p className="text-sm text-red-500 font-medium">{error}</p>}

                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-semibold"
                    disabled={isLoading || !!usernameError}
                  >
                    {isLoading ? "Creating account..." : "Sign Up"}
                  </Button>
                </div>

                <div className="mt-4 text-center text-sm text-gray-600">
                  Already have an account?{" "}
                  <Link href="/auth/login" className="text-orange-600 font-semibold hover:underline">
                    Login
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
