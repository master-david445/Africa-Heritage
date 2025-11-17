"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { toggleFollow, isFollowing } from "@/app/actions/follows"
import { useAuth } from "@/lib/auth-context"

export function useFollow(targetUserId: string) {
  const { user } = useAuth()
  const queryClient = useQueryClient()

  const { data: isFollowingStatus, isLoading: isLoadingStatus } = useQuery({
    queryKey: ['follow', user?.id, targetUserId],
    queryFn: () => isFollowing(targetUserId),
    enabled: !!user?.id,
  })

  const mutation = useMutation({
    mutationFn: toggleFollow,
    onSuccess: () => {
      // Invalidate and refetch the follow status
      queryClient.invalidateQueries({ queryKey: ['follow', user?.id, targetUserId] })
    },
  })

  return {
    isFollowing: isFollowingStatus ?? false,
    toggleFollow: mutation.mutate,
    isLoading: mutation.isPending || isLoadingStatus,
    error: mutation.error?.message || null,
  }
}