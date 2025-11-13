"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { updateProfile, updateEmail, updatePassword, checkUsernameAvailability } from "@/app/actions/profile"
import { updateProfileSchema, updateEmailSchema, updatePasswordSchema } from "@/lib/validations/profile"
import type { Profile } from "@/lib/types"
import type { UpdateProfileInput, UpdateEmailInput, UpdatePasswordInput } from "@/lib/validations/profile"
import { AlertTriangle, CheckCircle, Loader2 } from "lucide-react"

interface ProfileSettingsProps {
  profile: Profile
  onProfileUpdate: (updates: Partial<Profile>) => void
}

export default function ProfileSettings({ profile, onProfileUpdate }: ProfileSettingsProps) {
  const [loading, setLoading] = useState(false)
  const [successMessage, setSuccessMessage] = useState<string>("")
  const [errorMessage, setErrorMessage] = useState<string>("")

  // Confirmation dialogs state
  const [showEmailConfirm, setShowEmailConfirm] = useState(false)
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false)
  const [pendingEmailData, setPendingEmailData] = useState<UpdateEmailInput | null>(null)
  const [pendingPasswordData, setPendingPasswordData] = useState<UpdatePasswordInput | null>(null)

  // Profile form
  const profileForm = useForm<UpdateProfileInput>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      username: profile.username,
      bio: profile.bio || "",
      country: profile.country || "",
    },
  })

  // Email form
  const emailForm = useForm<Omit<UpdateEmailInput, 'currentPassword'>>({
    defaultValues: {
      email: profile.email || "",
    },
  })

  // Password form
  const passwordForm = useForm<Omit<UpdatePasswordInput, 'currentPassword'>>({
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
  })

  const clearMessages = () => {
    setSuccessMessage("")
    setErrorMessage("")
  }

  const handleProfileSubmit = async (data: UpdateProfileInput) => {
    clearMessages()
    setLoading(true)

    try {
      // Check username availability if changed
      if (data.username !== profile.username) {
        const isAvailable = await checkUsernameAvailability(data.username)
        if (!isAvailable) {
          profileForm.setError("username", {
            message: "Username is already taken"
          })
          return
        }
      }

      const result = await updateProfile(data)
      onProfileUpdate(result)
      setSuccessMessage("Profile updated successfully!")

      // Clear success message after 5 seconds
      setTimeout(() => setSuccessMessage(""), 5000)
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Failed to update profile")
    } finally {
      setLoading(false)
    }
  }

  const handleEmailSubmit = (data: Omit<UpdateEmailInput, 'currentPassword'>) => {
    setPendingEmailData({ ...data, currentPassword: "" })
    setShowEmailConfirm(true)
  }

  const confirmEmailUpdate = async () => {
    if (!pendingEmailData) return

    clearMessages()
    setLoading(true)
    setShowEmailConfirm(false)

    try {
      await updateEmail(pendingEmailData)
      setSuccessMessage("Email update initiated. Please check your email for confirmation.")
      emailForm.reset()
      setPendingEmailData(null)

      // Clear success message after 10 seconds
      setTimeout(() => setSuccessMessage(""), 10000)
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Failed to update email")
    } finally {
      setLoading(false)
    }
  }

  const handlePasswordSubmit = (data: Omit<UpdatePasswordInput, 'currentPassword'>) => {
    setPendingPasswordData({ ...data, currentPassword: "" })
    setShowPasswordConfirm(true)
  }

  const confirmPasswordUpdate = async () => {
    if (!pendingPasswordData) return

    clearMessages()
    setLoading(true)
    setShowPasswordConfirm(false)

    try {
      await updatePassword(pendingPasswordData)
      setSuccessMessage("Password updated successfully!")
      passwordForm.reset()
      setPendingPasswordData(null)

      // Clear success message after 5 seconds
      setTimeout(() => setSuccessMessage(""), 5000)
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Failed to update password")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Success Message */}
      {successMessage && (
        <Alert className="border-green-200 bg-green-50">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            {successMessage}
          </AlertDescription>
        </Alert>
      )}

      {/* Error Message */}
      {errorMessage && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            {errorMessage}
          </AlertDescription>
        </Alert>
      )}

      {/* Profile Information Form */}
      <Card>
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
          <CardDescription>Update your public profile details</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={profileForm.handleSubmit(handleProfileSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  {...profileForm.register("username")}
                  className={profileForm.formState.errors.username ? "border-red-500" : ""}
                />
                {profileForm.formState.errors.username && (
                  <p className="text-sm text-red-500 mt-1">
                    {profileForm.formState.errors.username.message}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="country">Country</Label>
                <Input
                  id="country"
                  {...profileForm.register("country")}
                  placeholder="Your country"
                />
                {profileForm.formState.errors.country && (
                  <p className="text-sm text-red-500 mt-1">
                    {profileForm.formState.errors.country.message}
                  </p>
                )}
              </div>
            </div>
            <div>
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                {...profileForm.register("bio")}
                placeholder="Tell us about yourself..."
                rows={3}
              />
              {profileForm.formState.errors.bio && (
                <p className="text-sm text-red-500 mt-1">
                  {profileForm.formState.errors.bio.message}
                </p>
              )}
            </div>
            <Button
              type="submit"
              disabled={loading || !profileForm.formState.isDirty}
              className="w-full md:w-auto"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                "Update Profile"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Account Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Account Settings</CardTitle>
          <CardDescription>Manage your account security</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Email Update Form */}
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <form onSubmit={emailForm.handleSubmit(handleEmailSubmit)} className="flex flex-col sm:flex-row gap-2">
              <Input
                id="email"
                type="email"
                {...emailForm.register("email")}
                placeholder="your.email@example.com"
                className={`flex-1 ${emailForm.formState.errors.email ? "border-red-500" : ""}`}
              />
              <Button
                type="submit"
                variant="outline"
                disabled={loading || !emailForm.formState.isDirty}
              >
                Update Email
              </Button>
            </form>
            {emailForm.formState.errors.email && (
              <p className="text-sm text-red-500">
                {emailForm.formState.errors.email.message}
              </p>
            )}
          </div>

          {/* Password Update Form */}
          <div className="space-y-4">
            <form onSubmit={passwordForm.handleSubmit(handlePasswordSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="new-password">New Password</Label>
                  <Input
                    id="new-password"
                    type="password"
                    {...passwordForm.register("newPassword")}
                    className={passwordForm.formState.errors.newPassword ? "border-red-500" : ""}
                  />
                  {passwordForm.formState.errors.newPassword && (
                    <p className="text-sm text-red-500 mt-1">
                      {passwordForm.formState.errors.newPassword.message}
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="confirm-password">Confirm New Password</Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    {...passwordForm.register("confirmPassword")}
                    className={passwordForm.formState.errors.confirmPassword ? "border-red-500" : ""}
                  />
                  {passwordForm.formState.errors.confirmPassword && (
                    <p className="text-sm text-red-500 mt-1">
                      {passwordForm.formState.errors.confirmPassword.message}
                    </p>
                  )}
                </div>
              </div>
              <Button
                type="submit"
                variant="outline"
                disabled={loading || !passwordForm.formState.isDirty}
                className="w-full md:w-auto"
              >
                Update Password
              </Button>
            </form>
          </div>
        </CardContent>
      </Card>

      {/* Email Confirmation Dialog */}
      <Dialog open={showEmailConfirm} onOpenChange={setShowEmailConfirm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Email Change</DialogTitle>
            <DialogDescription>
              Changing your email address will require verification. Please enter your current password to confirm this action.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="confirm-email-password">Current Password</Label>
              <Input
                id="confirm-email-password"
                type="password"
                value={pendingEmailData?.currentPassword || ""}
                onChange={(e) => setPendingEmailData(prev => prev ? { ...prev, currentPassword: e.target.value } : null)}
                placeholder="Enter your current password"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEmailConfirm(false)}>
              Cancel
            </Button>
            <Button
              onClick={confirmEmailUpdate}
              disabled={!pendingEmailData?.currentPassword || loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                "Confirm Change"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Password Confirmation Dialog */}
      <Dialog open={showPasswordConfirm} onOpenChange={setShowPasswordConfirm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Password Change</DialogTitle>
            <DialogDescription>
              Please enter your current password to confirm this security-sensitive action.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="confirm-password-current">Current Password</Label>
              <Input
                id="confirm-password-current"
                type="password"
                value={pendingPasswordData?.currentPassword || ""}
                onChange={(e) => setPendingPasswordData(prev => prev ? { ...prev, currentPassword: e.target.value } : null)}
                placeholder="Enter your current password"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPasswordConfirm(false)}>
              Cancel
            </Button>
            <Button
              onClick={confirmPasswordUpdate}
              disabled={!pendingPasswordData?.currentPassword || loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                "Confirm Change"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}