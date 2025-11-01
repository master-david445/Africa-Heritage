"use client"

import { useState, useMemo } from "react"
import Header from "@/components/header"
import ProverbCard from "@/components/proverb-card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, Filter } from "lucide-react"
import type { Proverb } from "@/lib/types"

// Mock proverbs data
const allProverbs: Proverb[] = [
  {
    id: "1",
    userId: "user1",
    userName: "Amara Kofi",
    userAvatar: "/placeholder-user.jpg",
    proverb: "Se wo were fi na wosankofa a yenkyi",
    meaning: "It is not wrong to go back for that which you have forgotten.",
    context: "This proverb teaches the importance of retrieving lost knowledge and wisdom.",
    country: "Ghana",
    language: "Twi",
    categories: ["Wisdom", "Learning"],
    timestamp: new Date(Date.now() - 86400000),
    likes: ["user2", "user3"],
    comments: [],
    bookmarks: ["user4"],
    reactions: {},
    views: 234,
    shares: 12,
    isVerified: true,
    isFeatured: false,
  },
  {
    id: "2",
    userId: "user5",
    userName: "Zainab Hassan",
    userAvatar: "/placeholder-user.jpg",
    proverb: "Ubuntu ngumuntu ngabantu",
    meaning: "A person is a person through other people.",
    context: "A Zulu proverb emphasizing the interconnectedness of humanity.",
    country: "South Africa",
    language: "Zulu",
    categories: ["Community", "Unity"],
    timestamp: new Date(Date.now() - 172800000),
    likes: ["user1", "user2", "user3", "user6"],
    comments: [],
    bookmarks: ["user2", "user7"],
    reactions: {},
    views: 456,
    shares: 34,
    isVerified: true,
    isFeatured: true,
  },
  {
    id: "3",
    userId: "user8",
    userName: "Chidi Okafor",
    userAvatar: "/placeholder-user.jpg",
    proverb: "A single hand cannot tie a bundle",
    meaning: "Cooperation and teamwork are essential for success.",
    context: "An Igbo proverb highlighting the power of collective effort.",
    country: "Nigeria",
    language: "Igbo",
    categories: ["Teamwork", "Success"],
    timestamp: new Date(Date.now() - 259200000),
    likes: ["user1", "user3"],
    comments: [],
    bookmarks: ["user5", "user9"],
    reactions: {},
    views: 189,
    shares: 8,
    isVerified: false,
    isFeatured: false,
  },
  {
    id: "4",
    userId: "user2",
    userName: "Kwame Mensah",
    userAvatar: "/placeholder-user.jpg",
    proverb: "When the root is deep, there is no reason to fear the wind",
    meaning: "Strong foundations provide security and stability.",
    context: "A proverb about the importance of building strong roots.",
    country: "Ghana",
    language: "Akan",
    categories: ["Strength", "Foundation"],
    timestamp: new Date(Date.now() - 345600000),
    likes: ["user1", "user4", "user5"],
    comments: [],
    bookmarks: ["user3"],
    reactions: {},
    views: 312,
    shares: 18,
    isVerified: true,
    isFeatured: false,
  },
  {
    id: "5",
    userId: "user9",
    userName: "Amina Diallo",
    userAvatar: "/placeholder-user.jpg",
    proverb: "The lion does not turn around when a small dog barks",
    meaning: "Do not be distracted by insignificant matters.",
    context: "A proverb about maintaining focus and dignity.",
    country: "Mali",
    language: "Bambara",
    categories: ["Wisdom", "Focus"],
    timestamp: new Date(Date.now() - 432000000),
    likes: ["user2", "user6"],
    comments: [],
    bookmarks: ["user1", "user8"],
    reactions: {},
    views: 267,
    shares: 15,
    isVerified: false,
    isFeatured: false,
  },
]

const allCategories = [
  "Wisdom",
  "Learning",
  "Community",
  "Unity",
  "Teamwork",
  "Success",
  "Strength",
  "Foundation",
  "Focus",
]
const allCountries = ["Ghana", "South Africa", "Nigeria", "Mali", "Kenya", "Ethiopia", "Senegal", "Tanzania"]
const allLanguages = ["Twi", "Zulu", "Igbo", "Akan", "Bambara", "Swahili", "Wolof", "Amharic"]

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null)
  const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null)
  const [sortBy, setSortBy] = useState<"recent" | "popular" | "trending">("recent")

  const filteredProverbs = useMemo(() => {
    let results = allProverbs

    // Text search
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      results = results.filter(
        (p) =>
          p.proverb.toLowerCase().includes(query) ||
          p.meaning.toLowerCase().includes(query) ||
          p.userName.toLowerCase().includes(query),
      )
    }

    // Category filter
    if (selectedCategory) {
      results = results.filter((p) => p.categories.includes(selectedCategory))
    }

    // Country filter
    if (selectedCountry) {
      results = results.filter((p) => p.country === selectedCountry)
    }

    // Language filter
    if (selectedLanguage) {
      results = results.filter((p) => p.language === selectedLanguage)
    }

    // Sorting
    if (sortBy === "popular") {
      results.sort((a, b) => b.likes.length - a.likes.length)
    } else if (sortBy === "trending") {
      results.sort((a, b) => b.views - a.views)
    } else {
      results.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    }

    return results
  }, [searchQuery, selectedCategory, selectedCountry, selectedLanguage, sortBy])

  return (
    <>
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Search Proverbs</h1>
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <Input
                placeholder="Search by proverb, meaning, or author..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-20">
              <h2 className="font-serif text-lg font-bold mb-4 text-gray-900 flex items-center gap-2">
                <Filter className="w-5 h-5" />
                Filters
              </h2>

              {/* Sort */}
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-3">Sort By</h3>
                <div className="space-y-2">
                  {(["recent", "popular", "trending"] as const).map((option) => (
                    <label key={option} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="sort"
                        value={option}
                        checked={sortBy === option}
                        onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                        className="w-4 h-4"
                      />
                      <span className="text-gray-700 capitalize">{option}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Categories */}
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-3">Categories</h3>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {allCategories.map((category) => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(selectedCategory === category ? null : category)}
                      className={`block w-full text-left px-3 py-2 rounded transition ${
                        selectedCategory === category
                          ? "bg-orange-600 text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>

              {/* Countries */}
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-3">Countries</h3>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {allCountries.map((country) => (
                    <button
                      key={country}
                      onClick={() => setSelectedCountry(selectedCountry === country ? null : country)}
                      className={`block w-full text-left px-3 py-2 rounded transition ${
                        selectedCountry === country
                          ? "bg-orange-600 text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {country}
                    </button>
                  ))}
                </div>
              </div>

              {/* Languages */}
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-3">Languages</h3>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {allLanguages.map((language) => (
                    <button
                      key={language}
                      onClick={() => setSelectedLanguage(selectedLanguage === language ? null : language)}
                      className={`block w-full text-left px-3 py-2 rounded transition ${
                        selectedLanguage === language
                          ? "bg-orange-600 text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {language}
                    </button>
                  ))}
                </div>
              </div>

              {/* Clear Filters */}
              {(selectedCategory || selectedCountry || selectedLanguage || searchQuery) && (
                <Button
                  onClick={() => {
                    setSearchQuery("")
                    setSelectedCategory(null)
                    setSelectedCountry(null)
                    setSelectedLanguage(null)
                  }}
                  variant="outline"
                  className="w-full"
                >
                  Clear Filters
                </Button>
              )}
            </div>
          </div>

          {/* Results */}
          <div className="lg:col-span-3">
            <div className="mb-4">
              <p className="text-gray-600">
                Found <span className="font-bold text-orange-600">{filteredProverbs.length}</span> proverb
                {filteredProverbs.length !== 1 ? "s" : ""}
              </p>
            </div>

            {filteredProverbs.length === 0 ? (
              <div className="bg-white rounded-lg shadow-md p-12 text-center">
                <p className="text-gray-500 text-lg">No proverbs found matching your search.</p>
                <p className="text-gray-400 mt-2">Try adjusting your filters or search terms.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredProverbs.map((proverb) => (
                  <ProverbCard key={proverb.id} proverb={proverb} />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  )
}
