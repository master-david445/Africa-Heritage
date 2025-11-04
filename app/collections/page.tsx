"use client"

import { useState, useEffect } from "react"
import Header from "@/components/header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Lock, Users, Loader2 } from "lucide-react"
import Link from "next/link"
import CreateCollectionModal from "@/components/create-collection-modal"
import CollectionCard from "@/components/collection-card"
import { toast } from "sonner"
import { getUserCollections, createCollection } from "@/app/actions/collections"
import type { Collection } from "@/lib/types"

// Mock collections data
const mockCollections: Collection[] = [
  {
    id: "col1",
    user_id: "user1",
    title: "Wisdom for Daily Life",
    description: "Essential proverbs that guide us through everyday challenges and decisions.",
    cover_image: "/placeholder.jpg",
    is_public: true,
    is_collaborative: false,
    contributors: ["user1"],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "col2",
    user_id: "user5",
    title: "Ubuntu Philosophy",
    description: "Proverbs centered around community, unity, and interconnectedness.",
    cover_image: "/placeholder.jpg",
    is_public: true,
    is_collaborative: true,
    contributors: ["user5", "user1", "user3"],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "col3",
    user_id: "user2",
    title: "Leadership Lessons",
    description: "Proverbs about leadership, strength, and making wise decisions.",
    cover_image: "/placeholder.jpg",
    is_public: true,
    is_collaborative: false,
    contributors: ["user2"],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "col4",
    user_id: "user8",
    title: "Teamwork & Cooperation",
    description: "Proverbs emphasizing the power of working together.",
    cover_image: "/placeholder.jpg",
    is_public: false,
    is_collaborative: true,
    contributors: ["user8", "user1"],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
]

export default function CollectionsPage() {
  const [collections, setCollections] = useState<Collection[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [filterType, setFilterType] = useState<"all" | "public" | "collaborative">("all")
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const filteredCollections = collections.filter((col) => {
    const matchesSearch =
      col.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      col.description?.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFilter =
      filterType === "all" ||
      (filterType === "public" && col.is_public) ||
      (filterType === "collaborative" && col.is_collaborative)
    return matchesSearch && matchesFilter
  })

  useEffect(() => {
    const loadCollections = async () => {
      try {
        setIsLoading(true)
        setError(null)
        // For now, use mock data since we don't have auth context
        // In a real app: const collections = await getUserCollections(userId)
        setCollections(mockCollections)
      } catch (err) {
        console.error("[v0] Error loading collections:", err)
        setError("Failed to load collections")
        toast.error("Failed to load collections")
      } finally {
        setIsLoading(false)
      }
    }

    loadCollections()
  }, [])

  const handleCreateCollection = async (collectionData: { title: string; description: string; isPublic: boolean; isCollaborative: boolean }) => {
    try {
      // In a real app: const newCollection = await createCollection(collectionData)
      const newCollection: Collection = {
        id: `col${Date.now()}`,
        user_id: "user1", // Mock current user
        title: collectionData.title,
        description: collectionData.description,
        cover_image: null,
        is_public: collectionData.isPublic,
        is_collaborative: collectionData.isCollaborative,
        contributors: ["user1"],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }
      setCollections(prev => [newCollection, ...prev])
      toast.success("Collection created successfully!")
    } catch (err) {
      console.error("[v0] Error creating collection:", err)
      toast.error("Failed to create collection")
    }
  }

  return (
    <>
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Collections</h1>
              <p className="text-gray-600 mt-2">Curate and organize proverbs into meaningful collections</p>
            </div>
            <Button
              onClick={() => setShowCreateModal(true)}
              className="bg-orange-600 hover:bg-orange-700 text-white flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Create Collection
            </Button>
          </div>

          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Input
              placeholder="Search collections..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1"
            />
            <div className="flex gap-2">
              {(["all", "public", "collaborative"] as const).map((type) => (
                <Button
                  key={type}
                  onClick={() => setFilterType(type)}
                  className={`${
                    filterType === type ? "bg-orange-600 text-white" : "bg-gray-200 text-gray-900 hover:bg-gray-300"
                  }`}
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Collections Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
                <div className="h-40 bg-gray-200"></div>
                <div className="p-6">
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded mb-4"></div>
                  <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="bg-red-50 rounded-lg p-8 text-center">
            <p className="text-red-600 text-lg mb-4">{error}</p>
            <Button onClick={() => window.location.reload()} variant="outline">
              Try Again
            </Button>
          </div>
        ) : filteredCollections.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <p className="text-gray-500 text-lg">No collections found.</p>
            <p className="text-gray-400 text-sm mt-2">Create your first collection to get started!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCollections.map((collection) => (
              <CollectionCard key={collection.id} collection={collection} />
            ))}
          </div>
        )}
      </main>

      <CreateCollectionModal
        open={showCreateModal}
        onOpenChange={setShowCreateModal}
        onCreate={handleCreateCollection}
      />
    </>
  )
}
