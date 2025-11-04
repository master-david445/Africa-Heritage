"use client"

import { useState } from "react"
import { Lock, Users, Share2, Edit, Trash2, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import ProverbCard from "@/components/proverb-card"
import EditCollectionModal from "@/components/edit-collection-modal"
import { toast } from "sonner"
import type { Collection, Proverb } from "@/lib/types"

interface CollectionDetailProps {
  collection: Collection
  proverbs: Proverb[]
  currentUser: Profile | null
  onEdit?: () => void
  onDelete?: () => void
  onShare?: () => void
  onAddProverbs?: () => void
  onUpdateCollection?: (updatedCollection: Collection) => void
}

import type { Profile } from "@/lib/types"

export default function CollectionDetail({
  collection,
  proverbs,
  currentUser,
  onEdit,
  onDelete,
  onShare,
  onAddProverbs,
  onUpdateCollection,
}: CollectionDetailProps) {
  const [showEditModal, setShowEditModal] = useState(false)
  return (
    <div>
      {/* Collection Header */}
      <div className="mb-8">
        <div className="bg-gradient-to-r from-orange-400 to-red-400 rounded-lg h-48 mb-6"></div>

        <div className="flex items-start justify-between mb-6">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold text-gray-900">{collection.title}</h1>
              {!collection.is_public && <Lock className="w-6 h-6 text-gray-500" />}
            </div>
            <p className="text-gray-600 mb-4">{collection.description}</p>

            {/* Collection Info */}
            <div className="flex flex-wrap gap-6 text-sm text-gray-600">
              <div>
                <span className="font-semibold text-gray-900">{proverbs.length}</span> proverbs
              </div>
              <div>
                By <span className="font-semibold text-gray-900">{collection.user_id}</span>
              </div>
              {collection.is_collaborative && (
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  <span>
                    <span className="font-semibold text-gray-900">{collection.contributors.length}</span> contributors
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 ml-4">
            {onAddProverbs && (
              <Button variant="outline" size="sm" className="flex items-center gap-2 bg-transparent" onClick={onAddProverbs}>
                <Plus className="w-4 h-4" />
                Add Proverbs
              </Button>
            )}
            {onShare && (
              <Button variant="outline" size="sm" className="flex items-center gap-2 bg-transparent" onClick={onShare}>
                <Share2 className="w-4 h-4" />
                Share
              </Button>
            )}
            {onEdit && (
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-2 bg-transparent"
                onClick={() => setShowEditModal(true)}
              >
                <Edit className="w-4 h-4" />
                Edit
              </Button>
            )}
            {onDelete && (
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-2 text-red-600 hover:text-red-700 bg-transparent"
                onClick={onDelete}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>

        {/* Contributors */}
        {collection.is_collaborative && collection.contributors.length > 0 && (
          <div className="bg-orange-50 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-gray-900 mb-3">Contributors</h3>
            <div className="flex flex-wrap gap-3">
              {collection.contributors.map((contributor) => (
                <div key={contributor} className="flex items-center gap-2 bg-white rounded-full px-3 py-1">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-orange-400 to-red-400 flex items-center justify-center text-white font-bold text-xs">
                    {contributor.substring(0, 1).toUpperCase()}
                  </div>
                  <span className="text-sm text-gray-700">{contributor}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Proverbs */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Proverbs in this collection</h2>
        {proverbs.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <p className="text-gray-500 text-lg">No proverbs in this collection yet.</p>
            {onAddProverbs && (
              <Button
                onClick={onAddProverbs}
                className="mt-4 bg-orange-600 hover:bg-orange-700 text-white flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Proverbs
              </Button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {proverbs.map((proverb) => (
              <ProverbCard key={proverb.id} proverb={proverb} currentUser={currentUser} />
            ))}
          </div>
        )}
      </div>

      {/* Edit Collection Modal */}
      <EditCollectionModal
        open={showEditModal}
        onOpenChange={setShowEditModal}
        collection={collection}
        onSave={async (collectionData) => {
          try {
            // TODO: Implement actual API call to update collection
            // const updatedCollection = await updateCollection(collection.id, collectionData)

            const updatedCollection: Collection = {
              ...collection,
              title: collectionData.title,
              description: collectionData.description,
              is_public: collectionData.isPublic,
              is_collaborative: collectionData.isCollaborative,
              updated_at: new Date().toISOString(),
            }
            onUpdateCollection?.(updatedCollection)
            toast.success("Collection updated successfully!")
          } catch (error) {
            console.error("[v0] Update collection error:", error)
            if (error instanceof Error) {
              toast.error(`Failed to update collection: ${error.message}`)
            } else {
              toast.error("Failed to update collection")
            }
          }
        }}
      />
    </div>
  )
}