import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { getProfilePageData, updateProfile, checkUsernameAvailability } from "@/app/actions/profile"
import type { ProfilePageData, UpdateProfileRequest } from "@/lib/types/profile"

// Query keys
export const profileKeys = {
  all: ['profile'] as const,
  profile: (userId: string) => [...profileKeys.all, 'profile', userId] as const,
  stats: (userId: string) => [...profileKeys.all, 'stats', userId] as const,
  usernameCheck: (username: string) => [...profileKeys.all, 'username-check', username] as const,
}

// Hook for getting profile page data
export function useProfilePageData(userId: string) {
  return useQuery({
    queryKey: profileKeys.profile(userId),
    queryFn: () => getProfilePageData(userId),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  })
}

// Hook for checking username availability
export function useUsernameAvailability(username: string) {
  return useQuery({
    queryKey: profileKeys.usernameCheck(username),
    queryFn: () => checkUsernameAvailability(username),
    enabled: !!username && username.length >= 3,
    staleTime: 30 * 1000, // 30 seconds
    gcTime: 5 * 60 * 1000, // 5 minutes
  })
}

// Hook for updating profile
export function useUpdateProfile() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: UpdateProfileRequest) => updateProfile(data),
    onSuccess: (result, variables) => {
      // Invalidate and refetch profile data
      queryClient.invalidateQueries({
        queryKey: profileKeys.profile(result.id)
      })

      // Update the profile in cache optimistically
      queryClient.setQueryData(
        profileKeys.profile(result.id),
        (oldData: ProfilePageData | undefined) => {
          if (!oldData) return oldData
          return {
            ...oldData,
            profile: result,
          }
        }
      )
    },
    onError: (error) => {
      console.error("[PROFILE_MUTATION] Update failed:", error)
    },
  })
}

// Hook for optimistic updates on profile changes
export function useOptimisticProfileUpdate(userId: string) {
  const queryClient = useQueryClient()

  const updateProfileOptimistically = (updates: Partial<ProfilePageData['profile']>) => {
    queryClient.setQueryData(
      profileKeys.profile(userId),
      (oldData: ProfilePageData | undefined) => {
        if (!oldData) return oldData
        return {
          ...oldData,
          profile: {
            ...oldData.profile,
            ...updates,
          },
        }
      }
    )
  }

  return { updateProfileOptimistically }
}