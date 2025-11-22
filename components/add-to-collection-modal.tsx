"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Plus, Search, Lock, Users, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { getUserCollections } from "@/app/actions/collections"
import type { Collection, Proverb } from "@/lib/types"

interface AddToCollectionModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  proverb: Proverb | null
  currentUser: { id: string } | null
  onAddToCollection?: (collectionId: string) => Promise<void>
  onCreateCollection?: (collectionData: { title: string; description: string; isPublic: boolean; isCollaborative: boolean }) => Promise<void>
}

export default function AddToCollectionModal({
  open,
  onOpenChange,
  proverb,
  currentUser,
  onAddToCollection,
  onCreateCollection,
}: AddToCollectionModalProps) {
  const [collections, setCollections] = useState<Collection[]>([])
  const [isLoadingCollections, setIsLoadingCollections] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [showCreateForm, setShowCreateForm] = useState(false)

  // New collection form state
  const [newCollectionTitle, setNewCollectionTitle] = useState("")
  const [newCollectionDescription, setNewCollectionDescription] = useState("")
  const [newCollectionIsPublic, setNewCollectionIsPublic] = useState(true)
  const [newCollectionIsCollaborative, setNewCollectionIsCollaborative] = useState(false)

  const [isSubmitting, setIsSubmitting] = useState(false)

  // Fetch collections when modal opens
  useEffect(() => {
    const fetchCollections = async () => {
      if (open && currentUser) {
        setIsLoadingCollections(true)
        try {
          const userCollections = await getUserCollections(currentUser.id)
          setCollections(userCollections)
        } catch (error) {
          console.error("Error fetching collections:", error)
          toast.error("Failed to load collections")
        } finally {
          setIsLoadingCollections(false)
        }
      }
    }

    fetchCollections()
  }, [open, currentUser])

  // Reset form when modal closes
  useEffect(() => {
    if (!open) {
      setSearchQuery("")
      setShowCreateForm(false)
      setNewCollectionTitle("")
      setNewCollectionDescription("")
      setNewCollectionIsPublic(true)
      setNewCollectionIsCollaborative(false)
    }
  }, [open])

  const filteredCollections = collections.filter((col) =>
    col.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    col.description?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleAddToCollection = async (collectionId: string) => {
    if (isSubmitting || !onAddToCollection) return

    setIsSubmitting(true)
    try {
      await onAddToCollection(collectionId)
      onOpenChange(false)
    } catch (error) {
      // Error handling is done in the parent/hook
      console.error("Error adding to collection:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCreateCollection = async () => {
    if (!newCollectionTitle.trim() || isSubmitting || !onCreateCollection) return

    setIsSubmitting(true)
    try {
      await onCreateCollection({
        title: newCollectionTitle,
        description: newCollectionDescription,
        isPublic: newCollectionIsPublic,
        isCollaborative: newCollectionIsCollaborative,
      })
      // We don't close the modal here because we might want to add the proverb to the new collection immediately
      // But the hook implementation might handle it. 
      // For now, let's assume the parent handles the flow.

      setShowCreateForm(false)
      // Refresh collections
      if (currentUser) {
        const userCollections = await getUserCollections(currentUser.id)
        setCollections(userCollections)
      }
    } catch (error) {
      console.error("Error creating collection:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add to Collection</DialogTitle>
          <DialogDescription>
            Choose a collection to add this proverb to, or create a new one.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {!showCreateForm ? (
            <>
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search collections..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Collections List */}
              <div className="max-h-60 overflow-y-auto space-y-2">
                {isLoadingCollections ? (
                  <div className="flex justify-center py-4">
                    <Loader2 className="w-6 h-6 animate-spin text-orange-600" />
                  </div>
                ) : filteredCollections.length === 0 ? (
                  <p className="text-sm text-gray-500 text-center py-4">No collections found.</p>
                ) : (
                  filteredCollections.map((collection) => (
                    <div
                      key={collection.id}
                      className={`flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 cursor-pointer ${isSubmitting ? 'opacity-50 pointer-events-none' : ''
                        }`}
                      onClick={() => handleAddToCollection(collection.id)}
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium text-sm">{collection.title}</h4>
                          {!collection.is_public && <Lock className="w-3 h-3 text-gray-500" />}
                          {collection.is_collaborative && <Users className="w-3 h-3 text-gray-500" />}
                        </div>
                        <p className="text-xs text-gray-500 line-clamp-1">{collection.description}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Create New Collection Button */}
              <Button
                onClick={() => setShowCreateForm(true)}
                variant="outline"
                className="w-full flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Create New Collection
              </Button>
            </>
          ) : (
            /* Create Collection Form */
            <div className="space-y-4">
              <div>
                <Label htmlFor="new-title" className="text-gray-900">
                  Collection Title
                </Label>
                <Input
                  id="new-title"
                  placeholder="e.g., Wisdom for Daily Life"
                  value={newCollectionTitle}
                  onChange={(e) => setNewCollectionTitle(e.target.value)}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="new-description" className="text-gray-900">
                  Description (Optional)
                </Label>
                <Input
                  id="new-description"
                  placeholder="Describe what this collection is about..."
                  value={newCollectionDescription}
                  onChange={(e) => setNewCollectionDescription(e.target.value)}
                  className="mt-1"
                />
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="new-public"
                    checked={newCollectionIsPublic}
                    onCheckedChange={(checked) => setNewCollectionIsPublic(checked as boolean)}
                  />
                  <Label htmlFor="new-public" className="text-gray-700 cursor-pointer">
                    Make this collection public
                  </Label>
                </div>

                <div className="flex items-center gap-2">
                  <Checkbox
                    id="new-collaborative"
                    checked={newCollectionIsCollaborative}
                    onCheckedChange={(checked) => setNewCollectionIsCollaborative(checked as boolean)}
                  />
                  <Label htmlFor="new-collaborative" className="text-gray-700 cursor-pointer">
                    Allow others to contribute
                  </Label>
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <Button onClick={() => setShowCreateForm(false)} variant="outline" className="flex-1">
                  Cancel
                </Button>
                <Button
                  onClick={handleCreateCollection}
                  disabled={!newCollectionTitle.trim() || isSubmitting}
                  className="flex-1 bg-orange-600 hover:bg-orange-700 text-white"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    "Create & Add"
                  )}
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}