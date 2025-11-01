"use client"

import { useState } from "react"
import Header from "@/components/header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Lock, Users } from "lucide-react"
import Link from "next/link"
import type { Collection } from "@/lib/types"

// Mock collections data
const mockCollections: Collection[] = [
  {
    id: "col1",
    userId: "user1",
    userName: "Amara Kofi",
    title: "Wisdom for Daily Life",
    description: "Essential proverbs that guide us through everyday challenges and decisions.",
    coverImage: "/placeholder.jpg",
    proverbs: ["1", "2", "3"],
    isPublic: true,
    isCollaborative: false,
    contributors: ["user1"],
  },
  {
    id: "col2",
    userId: "user5",
    userName: "Zainab Hassan",
    title: "Ubuntu Philosophy",
    description: "Proverbs centered around community, unity, and interconnectedness.",
    coverImage: "/placeholder.jpg",
    proverbs: ["2", "5"],
    isPublic: true,
    isCollaborative: true,
    contributors: ["user5", "user1", "user3"],
  },
  {
    id: "col3",
    userId: "user2",
    userName: "Kwame Mensah",
    title: "Leadership Lessons",
    description: "Proverbs about leadership, strength, and making wise decisions.",
    coverImage: "/placeholder.jpg",
    proverbs: ["4"],
    isPublic: true,
    isCollaborative: false,
    contributors: ["user2"],
  },
  {
    id: "col4",
    userId: "user8",
    userName: "Chidi Okafor",
    title: "Teamwork & Cooperation",
    description: "Proverbs emphasizing the power of working together.",
    coverImage: "/placeholder.jpg",
    proverbs: ["3"],
    isPublic: false,
    isCollaborative: true,
    contributors: ["user8", "user1"],
  },
]

export default function CollectionsPage() {
  const [collections, setCollections] = useState(mockCollections)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterType, setFilterType] = useState<"all" | "public" | "collaborative">("all")

  const filteredCollections = collections.filter((col) => {
    const matchesSearch =
      col.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      col.description?.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFilter =
      filterType === "all" ||
      (filterType === "public" && col.isPublic) ||
      (filterType === "collaborative" && col.isCollaborative)
    return matchesSearch && matchesFilter
  })

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
            <Button className="bg-orange-600 hover:bg-orange-700 text-white flex items-center gap-2">
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
        {filteredCollections.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <p className="text-gray-500 text-lg">No collections found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCollections.map((collection) => (
              <Link key={collection.id} href={`/collections/${collection.id}`}>
                <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition cursor-pointer h-full">
                  {/* Cover Image */}
                  <div className="h-40 bg-gradient-to-br from-orange-400 to-red-400"></div>

                  {/* Content */}
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-serif text-lg font-bold text-gray-900 flex-1">{collection.title}</h3>
                      {!collection.isPublic && <Lock className="w-4 h-4 text-gray-500 flex-shrink-0" />}
                    </div>

                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">{collection.description}</p>

                    {/* Stats */}
                    <div className="flex items-center justify-between text-sm text-gray-500 mb-4 pb-4 border-b border-gray-200">
                      <span>{collection.proverbs.length} proverbs</span>
                      {collection.isCollaborative && (
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          {collection.contributors.length}
                        </div>
                      )}
                    </div>

                    {/* Creator */}
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-400 to-red-400 flex items-center justify-center text-white font-bold text-xs">
                        {collection.userName.substring(0, 2).toUpperCase()}
                      </div>
                      <div className="text-sm">
                        <div className="font-semibold text-gray-900">By {collection.userName}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </>
  )
}
