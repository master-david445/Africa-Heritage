"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"

interface CreateCollectionModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onCreate?: (collection: { title: string; description: string; isPublic: boolean; isCollaborative: boolean }) => void
}

export default function CreateCollectionModal({ open, onOpenChange, onCreate }: CreateCollectionModalProps) {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [isPublic, setIsPublic] = useState(true)
  const [isCollaborative, setIsCollaborative] = useState(false)

  const handleCreate = () => {
    if (!title.trim()) return
    onCreate?.({ title, description, isPublic, isCollaborative })
    setTitle("")
    setDescription("")
    setIsPublic(true)
    setIsCollaborative(false)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create New Collection</DialogTitle>
          <DialogDescription>Organize proverbs into a meaningful collection</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label htmlFor="title" className="text-gray-900">
              Collection Title
            </Label>
            <Input
              id="title"
              placeholder="e.g., Wisdom for Daily Life"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="description" className="text-gray-900">
              Description
            </Label>
            <Textarea
              id="description"
              placeholder="Describe what this collection is about..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-1"
              rows={3}
            />
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Checkbox id="public" checked={isPublic} onCheckedChange={(checked) => setIsPublic(checked as boolean)} />
              <Label htmlFor="public" className="text-gray-700 cursor-pointer">
                Make this collection public
              </Label>
            </div>

            <div className="flex items-center gap-2">
              <Checkbox
                id="collaborative"
                checked={isCollaborative}
                onCheckedChange={(checked) => setIsCollaborative(checked as boolean)}
              />
              <Label htmlFor="collaborative" className="text-gray-700 cursor-pointer">
                Allow others to contribute
              </Label>
            </div>
          </div>

          <div className="flex gap-2 pt-4">
            <Button onClick={() => onOpenChange(false)} variant="outline" className="flex-1">
              Cancel
            </Button>
            <Button
              onClick={handleCreate}
              disabled={!title.trim()}
              className="flex-1 bg-orange-600 hover:bg-orange-700 text-white"
            >
              Create Collection
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
