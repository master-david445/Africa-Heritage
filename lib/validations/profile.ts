import { z } from "zod"

// Base profile validation schemas
export const usernameSchema = z
  .string()
  .min(3, "Username must be at least 3 characters")
  .max(30, "Username must be less than 30 characters")
  .regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores")

export const emailSchema = z
  .string()
  .email("Please enter a valid email address")
  .max(255, "Email must be less than 255 characters")

export const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .max(128, "Password must be less than 128 characters")
  .regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
    "Password must contain at least one lowercase letter, one uppercase letter, and one number"
  )

export const bioSchema = z
  .string()
  .max(500, "Bio must be less than 500 characters")
  .optional()

export const countrySchema = z
  .string()
  .max(100, "Country must be less than 100 characters")
  .optional()

// Profile update schema
export const updateProfileSchema = z.object({
  username: usernameSchema,
  bio: bioSchema,
  country: countrySchema,
})

// Email update schema (requires current password)
export const updateEmailSchema = z.object({
  email: emailSchema,
  currentPassword: z.string().min(1, "Current password is required"),
})

// Password update schema (requires current password)
export const updatePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: passwordSchema,
  confirmPassword: passwordSchema,
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
})

// Username availability check schema
export const checkUsernameAvailabilitySchema = z.object({
  username: usernameSchema,
})

// Authentication schemas
export const signInSchema = z.object({
  identifier: z.string().min(1, "Email or username is required"),
  password: z.string().min(1, "Password is required"),
})

// Type exports for use in components and services
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>
export type UpdateEmailInput = z.infer<typeof updateEmailSchema>
export type UpdatePasswordInput = z.infer<typeof updatePasswordSchema>
export type CheckUsernameAvailabilityInput = z.infer<typeof checkUsernameAvailabilitySchema>
export type SignInInput = z.infer<typeof signInSchema>

// Validation helper functions
export function validateEmail(email: string): boolean {
  return emailSchema.safeParse(email).success
}

export function validateUsername(username: string): boolean {
  return usernameSchema.safeParse(username).success
}

export function validatePassword(password: string): boolean {
  return passwordSchema.safeParse(password).success
}