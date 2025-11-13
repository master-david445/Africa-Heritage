"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { updateProfile, updateEmail, updatePassword, checkUsernameAvailability } from "@/app/actions/profile"
import type { Profile } from "@/lib/types"

interface ProfileSettingsProps {
  profile: Profile
  onProfileUpdate: (updates: Partial<Profile>) => void
}

export default function ProfileSettings({ profile, onProfileUpdate }: ProfileSettingsProps) {
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [success, setSuccess] = useState<string>("")

  // Form states
  const [username, setUsername] = useState(profile.username)
  const [email, setEmail] = useState(profile.email || "")
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [bio, setBio] = useState(profile.bio || "")
  const [country, setCountry] = useState(profile.country || "")

  const clearMessages = () => {
    setErrors({})
    setSuccess("")
  }

  const handleProfileUpdate = async () => {
    clearMessages()
    setLoading(true)

    try {
      // Validate username
      if (username.length < 3) {
        setErrors({ username: "Username must be at least 3 characters" })
        return
      }
      if (username.length > 30) {
        setErrors({ username: "Username must be less than 30 characters" })
        return
      }
      if (!/^[a-zA-Z0-9_]+$/.test(username)) {
        setErrors({ username: "Username can only contain letters, numbers, and underscores" })
        return
      }

      // Check username availability if changed
      if (username !== profile.username) {
        const isAvailable = await checkUsernameAvailability(username)
        if (!isAvailable) {
          setErrors({ username: "Username is already taken" })
          return
        }
      }

      const result = await updateProfile({
        username,
        bio: bio || undefined,
        country: country || undefined
      })

      onProfileUpdate(result)
      setSuccess("Profile updated successfully!")
    } catch (error) {
      setErrors({ general: error instanceof Error ? error.message : "Update failed" })
    } finally {
      setLoading(false)
    }
  }

  const handleEmailUpdate = async () => {
    clearMessages()
    setLoading(true)

    try {
      // Basic email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(email)) {
        setErrors({ email: "Please enter a valid email address" })
        return
      }

      await updateEmail(email)
      setSuccess("Email update initiated. Please check your email for confirmation.")
    } catch (error) {
      setErrors({ email: error instanceof Error ? error.message : "Email update failed" })
    } finally {
      setLoading(false)
    }
  }

  const handlePasswordUpdate = async () => {
    clearMessages()
    setLoading(true)

    try {
      if (!currentPassword) {
        setErrors({ password: "Current password is required" })
        return
      }
      if (newPassword.length < 6) {
        setErrors({ password: "New password must be at least 6 characters" })
        return
      }
      if (newPassword !== confirmPassword) {
        setErrors({ password: "Passwords do not match" })
        return
      }

      await updatePassword(newPassword)
      setSuccess("Password updated successfully!")
      setCurrentPassword("")
      setNewPassword("")
      setConfirmPassword("")
    } catch (error) {
      setErrors({ password: error instanceof Error ? error.message : "Password update failed" })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
          {success}
        </div>
      )}

      {errors.general && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {errors.general}
        </div>
      )}

      {/* Profile Information */}
      <Card>
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
          <CardDescription>Update your public profile details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className={errors.username ? "border-red-500" : ""}
              />
              {errors.username && <p className="text-sm text-red-500 mt-1">{errors.username}</p>}
            </div>
            <div>
              <Label htmlFor="country">Country</Label>
              <Input
                id="country"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                placeholder="Your country"
              />
            </div>
          </div>
          <div>
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell us about yourself..."
              rows={3}
            />
          </div>
          <Button onClick={handleProfileUpdate} disabled={loading} className="w-full md:w-auto">
            {loading ? "Updating..." : "Update Profile"}
          </Button>
        </CardContent>
      </Card>

      {/* Account Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Account Settings</CardTitle>
          <CardDescription>Manage your account security</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Email Update Section */}
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <div className="flex flex-col sm:flex-row gap-2">
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your.email@example.com"
                className={`flex-1 ${errors.email ? "border-red-500" : ""}`}
              />
              <Button variant="outline" onClick={handleEmailUpdate} disabled={loading}>
                Update Email
              </Button>
            </div>
            {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
          </div>

          {/* Password Update Section */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="current-password">Current Password</Label>
              <Input
                id="current-password"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className={errors.password ? "border-red-500" : ""}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="new-password">New Password</Label>
                <Input
                  id="new-password"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className={errors.password ? "border-red-500" : ""}
                />
              </div>
              <div>
                <Label htmlFor="confirm-password">Confirm New Password</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={errors.password ? "border-red-500" : ""}
                />
              </div>
            </div>
            {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
            <Button variant="outline" onClick={handlePasswordUpdate} disabled={loading} className="w-full md:w-auto">
              Update Password
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}