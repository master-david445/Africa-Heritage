"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import type { Collection } from "@/lib/types"

interface EditCollectionModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  collection: Collection | null
  onSave?: (collectionData: { title: string; description: string; isPublic: boolean; isCollaborative: boolean }) => void
}

export default function EditCollectionModal({
  open,
  onOpenChange,
  collection,
  onSave,
}: EditCollectionModalProps) {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [isPublic, setIsPublic] = useState(true)
  const [isCollaborative, setIsCollaborative] = useState(false)

  useEffect(() => {
    if (collection && open) {
      setTitle(collection.title)
      setDescription(collection.description || "")
      setIsPublic(collection.is_public)
      setIsCollaborative(collection.is_collaborative)
    }
  }, [collection, open])

  const handleSave = () => {
    if (!title.trim()) return
    onSave?.({ title, description, isPublic, isCollaborative })
    onOpenChange(false)
  }

  const handleCancel = () => {
    // Reset to original values
    if (collection) {
      setTitle(collection.title)
      setDescription(collection.description || "")
      setIsPublic(collection.is_public)
      setIsCollaborative(collection.is_collaborative)
    }
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Collection</DialogTitle>
          <DialogDescription>Update your collection details</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label htmlFor="edit-title" className="text-gray-900">
              Collection Title
            </Label>
            <Input
              id="edit-title"
              placeholder="e.g., Wisdom for Daily Life"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="edit-description" className="text-gray-900">
              Description
            </Label>
            <Textarea
              id="edit-description"
              placeholder="Describe what this collection is about..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-1"
              rows={3}
            />
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Checkbox
                id="edit-public"
                checked={isPublic}
                onCheckedChange={(checked) => setIsPublic(checked as boolean)}
              />
              <Label htmlFor="edit-public" className="text-gray-700 cursor-pointer">
                Make this collection public
              </Label>
            </div>

            <div className="flex items-center gap-2">
              <Checkbox
                id="edit-collaborative"
                checked={isCollaborative}
                onCheckedChange={(checked) => setIsCollaborative(checked as boolean)}
              />
              <Label htmlFor="edit-collaborative" className="text-gray-700 cursor-pointer">
                Allow others to contribute
              </Label>
            </div>
          </div>

          <div className="flex gap-2 pt-4">
            <Button onClick={handleCancel} variant="outline" className="flex-1">
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={!title.trim()}
              className="flex-1 bg-orange-600 hover:bg-orange-700 text-white"
            >
              Save Changes
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}