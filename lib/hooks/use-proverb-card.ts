import { useState, useEffect, useCallback } from "react"
import { toast } from "sonner"
import { toggleLike, isProverbLikedByUser } from "@/app/actions/likes"
import { toggleBookmark } from "@/app/actions/bookmarks"
import { createComment, getProverbComments } from "@/app/actions/comments"
import type { Proverb, Profile, Comment, ProverbCardState, Collection } from "@/lib/types"

export function useProverbCard(proverb: Proverb, currentUser: Profile | null) {
  const [state, setState] = useState<ProverbCardState>({
    isLiked: false,
    isBookmarked: false,
    likeCount: proverb.likes_count || 0,
    commentCount: proverb.comments_count || 0,
    showComments: false,
    comments: [],
    isLoading: false,
    error: null,
  })

  const [showAddToCollectionModal, setShowAddToCollectionModal] = useState(false)

  // Load initial user interactions
  useEffect(() => {
    const loadUserInteractions = async () => {
      if (!currentUser) return

      try {
        const liked = await isProverbLikedByUser(proverb.id)
        setState(prev => ({ ...prev, isLiked: liked }))
      } catch (error) {
        console.error("[v0] Error loading like status:", error)
      }
    }

    loadUserInteractions()
  }, [currentUser, proverb.id])

  // Load comments when comments section is opened
  useEffect(() => {
    const loadComments = async () => {
      if (!state.showComments) return

      setState(prev => ({ ...prev, isLoading: true, error: null }))

      try {
        const fetchedComments = await getProverbComments(proverb.id)
        setState(prev => ({
          ...prev,
          comments: fetchedComments,
          commentCount: fetchedComments.length,
          isLoading: false
        }))
      } catch (error) {
        console.error("[v0] Error loading comments:", error)
        setState(prev => ({
          ...prev,
          error: "Failed to load comments",
          isLoading: false
        }))
        toast.error("Failed to load comments")
      }
    }

    loadComments()
  }, [state.showComments, proverb.id])

  const handleLike = useCallback(async () => {
    if (!currentUser) {
      setState(prev => ({ ...prev, error: "Please log in to like proverbs" }))
      return
    }

    setState(prev => ({ ...prev, isLoading: true, error: null }))

    try {
      const result = await toggleLike(proverb.id)
      setState(prev => ({
        ...prev,
        isLiked: result.liked,
        likeCount: result.liked ? prev.likeCount + 1 : Math.max(0, prev.likeCount - 1),
        isLoading: false
      }))

      toast.success(result.liked ? "Proverb liked!" : "Like removed")
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Error toggling like"
      console.error("[v0] Like error:", errorMessage)
      setState(prev => ({
        ...prev,
        error: errorMessage,
        isLoading: false
      }))
      toast.error("Failed to toggle like")
    }
  }, [currentUser, proverb.id])

  const handleBookmark = useCallback(async () => {
    if (!currentUser) {
      setState(prev => ({ ...prev, error: "Please log in to bookmark proverbs" }))
      return
    }

    setState(prev => ({ ...prev, isLoading: true, error: null }))

    try {
      const result = await toggleBookmark(proverb.id)
      setState(prev => ({
        ...prev,
        isBookmarked: result.bookmarked,
        isLoading: false
      }))

      toast.success(result.bookmarked ? "Proverb bookmarked!" : "Bookmark removed")
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Error toggling bookmark"
      console.error("[v0] Bookmark error:", errorMessage)
      setState(prev => ({
        ...prev,
        error: errorMessage,
        isLoading: false
      }))
      toast.error("Failed to toggle bookmark")
    }
  }, [currentUser, proverb.id])

  const handleToggleComments = useCallback(() => {
    if (!currentUser) {
      setState(prev => ({ ...prev, error: "Please log in to view comments" }))
      return
    }

    setState(prev => ({
      ...prev,
      showComments: !prev.showComments,
      error: null
    }))
  }, [currentUser])

  const handleAddComment = useCallback(async (text: string) => {
    if (!currentUser) {
      throw new Error("Please log in to comment")
    }

    setState(prev => ({ ...prev, isLoading: true, error: null }))

    try {
      const comment = await createComment(proverb.id, text)
      setState(prev => ({
        ...prev,
        comments: [comment, ...prev.comments],
        commentCount: prev.commentCount + 1,
        isLoading: false
      }))
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Error posting comment"
      console.error("[v0] Comment error:", errorMessage)
      setState(prev => ({
        ...prev,
        error: errorMessage,
        isLoading: false
      }))
      throw error
    }
  }, [currentUser, proverb.id])

  const handleShare = useCallback(async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: "African Heritage Proverb",
          text: proverb.proverb,
          url: window.location.href,
        })
        toast.success("Proverb shared successfully!")
      } else {
        await navigator.clipboard.writeText(`${proverb.proverb} - ${window.location.href}`)
        toast.success("Link copied to clipboard!")
      }
    } catch (error) {
      console.error("[v0] Share error:", error)
      toast.error("Failed to share proverb")
    }
  }, [proverb.proverb])

  const handleAddToCollection = useCallback(() => {
    if (!currentUser) {
      setState(prev => ({ ...prev, error: "Please log in to add proverbs to collections" }))
      return
    }
    setShowAddToCollectionModal(true)
  }, [currentUser])

  const handleAddToCollectionSubmit = useCallback(async (collectionId: string) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }))

    try {
      // TODO: Implement actual API call to add proverb to collection
      // await addProverbToCollection(proverb.id, collectionId)

      toast.success("Proverb added to collection!")
      setShowAddToCollectionModal(false)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Error adding proverb to collection"
      console.error("[v0] Add to collection error:", errorMessage)
      setState(prev => ({
        ...prev,
        error: errorMessage,
        isLoading: false
      }))
      toast.error("Failed to add proverb to collection")
    } finally {
      setState(prev => ({ ...prev, isLoading: false }))
    }
  }, [proverb.id])

  const handleCreateCollection = useCallback(async (collectionData: { title: string; description: string; isPublic: boolean; isCollaborative: boolean }) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }))

    try {
      // TODO: Implement actual API call to create collection
      // const newCollection = await createCollection(collectionData)

      toast.success("Collection created and proverb added!")
      setShowAddToCollectionModal(false)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Error creating collection"
      console.error("[v0] Create collection error:", errorMessage)
      setState(prev => ({
        ...prev,
        error: errorMessage,
        isLoading: false
      }))
      toast.error("Failed to create collection")
    } finally {
      setState(prev => ({ ...prev, isLoading: false }))
    }
  }, [])

  return {
    ...state,
    showAddToCollectionModal,
    setShowAddToCollectionModal,
    handleLike,
    handleBookmark,
    handleToggleComments,
    handleAddComment,
    handleShare,
    handleAddToCollection,
    handleAddToCollectionSubmit,
    handleCreateCollection,
  }
}