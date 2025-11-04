"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Search, Filter, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import ProverbCard from "@/components/proverb-card"
import ProverbCardSkeleton from "@/components/proverb-card-skeleton"
import { useAuth } from "@/lib/auth-context"
import { getCurrentUser } from "@/app/actions/profile"
import { searchProverbs, getSearchSuggestions } from "@/app/actions/search"
import type { Proverb, Profile, SearchFilters } from "@/lib/types"

export default function SearchPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user } = useAuth()

  const [query, setQuery] = useState(searchParams.get("q") || "")
  const [filters, setFilters] = useState<SearchFilters>({
    query: searchParams.get("q") || "",
    country: searchParams.get("country") || "",
    language: searchParams.get("language") || "",
    categories: searchParams.get("categories")?.split(",") || [],
  })

  const [results, setResults] = useState<Proverb[]>([])
  const [currentUser, setCurrentUser] = useState<Profile | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)

  // Suggestions state
  const [suggestions, setSuggestions] = useState<{
    categories: string[]
    countries: string[]
    languages: string[]
    authors: string[]
  }>({ categories: [], countries: [], languages: [], authors: [] })
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false)
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1)
  const searchInputRef = useRef<HTMLInputElement>(null)
  const suggestionsRef = useRef<HTMLDivElement>(null)

  // Load current user
  useEffect(() => {
    const loadUser = async () => {
      try {
        const user = await getCurrentUser()
        setCurrentUser(user)
      } catch (error) {
        console.error("[v0] Error loading user:", error)
      }
    }
    loadUser()
  }, [])

  // Perform search
  const performSearch = async (searchFilters: SearchFilters) => {
    setIsLoading(true)
    try {
      const searchResults = await searchProverbs({
        ...searchFilters,
        limit: 20,
        offset: 0,
      })
      setResults(searchResults)
      setHasSearched(true)
    } catch (error) {
      console.error("[v0] Search error:", error)
      setResults([])
      setHasSearched(true)
    } finally {
      setIsLoading(false)
    }
  }

  // Handle search submission
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const newFilters = { ...filters, query }
    setFilters(newFilters)

    // Update URL
    const params = new URLSearchParams()
    if (query) params.set("q", query)
    if (newFilters.country) params.set("country", newFilters.country)
    if (newFilters.language) params.set("language", newFilters.language)
    if (newFilters.categories?.length) params.set("categories", newFilters.categories.join(","))

    router.replace(`/search?${params.toString()}`)
    performSearch(newFilters)
  }

  // Handle filter changes
  const handleFilterChange = (key: keyof SearchFilters, value: any) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
  }

  // Clear all filters
  const clearFilters = () => {
    setFilters({ query: "", country: "", language: "", categories: [] })
    setQuery("")
    setResults([])
    setHasSearched(false)
    setShowSuggestions(false)
    setSuggestions({ categories: [], countries: [], languages: [], authors: [] })
    router.replace("/search")
  }

  // Fetch suggestions
  const fetchSuggestions = async (searchQuery: string) => {
    if (!searchQuery || searchQuery.length < 2) {
      setSuggestions({ categories: [], countries: [], languages: [], authors: [] })
      setShowSuggestions(false)
      return
    }

    setIsLoadingSuggestions(true)
    try {
      const suggestionResults = await getSearchSuggestions(searchQuery)
      if (Array.isArray(suggestionResults)) {
        setSuggestions({ categories: [], countries: [], languages: [], authors: [] })
      } else {
        setSuggestions(suggestionResults)
      }
      setShowSuggestions(true)
      setSelectedSuggestionIndex(-1)
    } catch (error) {
      console.error("[v0] Error fetching suggestions:", error)
      setSuggestions({ categories: [], countries: [], languages: [], authors: [] })
      setShowSuggestions(false)
    } finally {
      setIsLoadingSuggestions(false)
    }
  }

  // Handle input change with debouncing
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setQuery(value)
    fetchSuggestions(value)
  }

  // Get all suggestions as flat array for keyboard navigation
  const getAllSuggestions = () => {
    return [
      ...suggestions.categories.map(cat => ({ type: 'category', value: cat })),
      ...suggestions.countries.map(country => ({ type: 'country', value: country })),
      ...suggestions.languages.map(lang => ({ type: 'language', value: lang })),
      ...suggestions.authors.map(author => ({ type: 'author', value: author })),
    ]
  }

  // Handle suggestion selection
  const selectSuggestion = (suggestion: { type: string, value: string }) => {
    setQuery(suggestion.value)
    setShowSuggestions(false)
    setSelectedSuggestionIndex(-1)
    // Trigger search
    const newFilters = { ...filters, query: suggestion.value }
    setFilters(newFilters)
    performSearch(newFilters)
  }

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    const allSuggestions = getAllSuggestions()

    if (!showSuggestions || allSuggestions.length === 0) return

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setSelectedSuggestionIndex(prev =>
          prev < allSuggestions.length - 1 ? prev + 1 : 0
        )
        break
      case 'ArrowUp':
        e.preventDefault()
        setSelectedSuggestionIndex(prev =>
          prev > 0 ? prev - 1 : allSuggestions.length - 1
        )
        break
      case 'Enter':
        e.preventDefault()
        if (selectedSuggestionIndex >= 0) {
          selectSuggestion(allSuggestions[selectedSuggestionIndex])
        }
        break
      case 'Escape':
        setShowSuggestions(false)
        setSelectedSuggestionIndex(-1)
        break
    }
  }

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchInputRef.current &&
        !searchInputRef.current.contains(event.target as Node) &&
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false)
        setSelectedSuggestionIndex(-1)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-4 mb-4">
            <Search className="w-6 h-6 text-gray-400" />
            <h1 className="text-2xl font-bold text-gray-900">Search Proverbs</h1>
          </div>

          {/* Search Form */}
          <form onSubmit={handleSearch} className="flex gap-4">
            <div className="flex-1 relative">
              <Label htmlFor="search-query" className="sr-only">
                Search proverbs
              </Label>
              <Input
                ref={searchInputRef}
                id="search-query"
                type="text"
                placeholder="Search for proverbs, wisdom, or keywords..."
                value={query}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                className="w-full"
              />

              {/* Suggestions Dropdown */}
              {showSuggestions && (
                <div
                  ref={suggestionsRef}
                  className="absolute top-full left-0 right-0 z-50 bg-white border border-gray-200 rounded-md shadow-lg max-h-80 overflow-y-auto mt-1"
                >
                  {isLoadingSuggestions ? (
                    <div className="p-4 text-center text-gray-500">
                      Loading suggestions...
                    </div>
                  ) : getAllSuggestions().length > 0 ? (
                    <div className="py-2">
                      {suggestions.categories.length > 0 && (
                        <div className="px-4 py-2">
                          <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
                            Categories
                          </div>
                          {suggestions.categories.map((category, index) => (
                            <button
                              key={`category-${category}`}
                              className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-100 rounded ${
                                selectedSuggestionIndex === index ? 'bg-blue-50 text-blue-700' : 'text-gray-700'
                              }`}
                              onClick={() => selectSuggestion({ type: 'category', value: category })}
                            >
                              {category}
                            </button>
                          ))}
                        </div>
                      )}

                      {suggestions.countries.length > 0 && (
                        <div className="px-4 py-2 border-t border-gray-100">
                          <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
                            Countries
                          </div>
                          {suggestions.countries.map((country, index) => {
                            const globalIndex = index + suggestions.categories.length
                            return (
                              <button
                                key={`country-${country}`}
                                className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-100 rounded ${
                                  selectedSuggestionIndex === globalIndex ? 'bg-blue-50 text-blue-700' : 'text-gray-700'
                                }`}
                                onClick={() => selectSuggestion({ type: 'country', value: country })}
                              >
                                {country}
                              </button>
                            )
                          })}
                        </div>
                      )}

                      {suggestions.languages.length > 0 && (
                        <div className="px-4 py-2 border-t border-gray-100">
                          <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
                            Languages
                          </div>
                          {suggestions.languages.map((language, index) => {
                            const globalIndex = index + suggestions.categories.length + suggestions.countries.length
                            return (
                              <button
                                key={`language-${language}`}
                                className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-100 rounded ${
                                  selectedSuggestionIndex === globalIndex ? 'bg-blue-50 text-blue-700' : 'text-gray-700'
                                }`}
                                onClick={() => selectSuggestion({ type: 'language', value: language })}
                              >
                                {language}
                              </button>
                            )
                          })}
                        </div>
                      )}

                      {suggestions.authors.length > 0 && (
                        <div className="px-4 py-2 border-t border-gray-100">
                          <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
                            Authors
                          </div>
                          {suggestions.authors.map((author, index) => {
                            const globalIndex = index + suggestions.categories.length + suggestions.countries.length + suggestions.languages.length
                            return (
                              <button
                                key={`author-${author}`}
                                className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-100 rounded ${
                                  selectedSuggestionIndex === globalIndex ? 'bg-blue-50 text-blue-700' : 'text-gray-700'
                                }`}
                                onClick={() => selectSuggestion({ type: 'author', value: author })}
                              >
                                {author}
                              </button>
                            )
                          })}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="p-4 text-center text-gray-500">
                      No suggestions found
                    </div>
                  )}
                </div>
              )}
            </div>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Searching..." : "Search"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              aria-expanded={showFilters}
              aria-controls="search-filters"
            >
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </Button>
          </form>

          {/* Filters Panel */}
          {showFilters && (
            <div id="search-filters" className="mt-4 p-4 bg-gray-50 rounded-lg border">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="country-filter">Country</Label>
                  <Input
                    id="country-filter"
                    placeholder="e.g., Nigeria, Ghana"
                    value={filters.country || ""}
                    onChange={(e) => handleFilterChange("country", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="language-filter">Language</Label>
                  <Input
                    id="language-filter"
                    placeholder="e.g., Yoruba, Swahili"
                    value={filters.language || ""}
                    onChange={(e) => handleFilterChange("language", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="categories-filter">Categories</Label>
                  <Input
                    id="categories-filter"
                    placeholder="e.g., wisdom, family (comma-separated)"
                    value={filters.categories?.join(", ") || ""}
                    onChange={(e) => handleFilterChange("categories", e.target.value.split(",").map(s => s.trim()))}
                  />
                </div>
              </div>
              <div className="flex justify-between items-center mt-4">
                <Button type="button" variant="outline" onClick={clearFilters}>
                  <X className="w-4 h-4 mr-2" />
                  Clear Filters
                </Button>
                <Button type="button" onClick={() => performSearch(filters)}>
                  Apply Filters
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Results */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isLoading ? (
          <div className="space-y-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <ProverbCardSkeleton key={i} />
            ))}
          </div>
        ) : hasSearched ? (
          <div>
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                Search Results {results.length > 0 && `(${results.length})`}
              </h2>
              {query && (
                <p className="text-gray-600 mt-1">
                  Showing results for "{query}"
                </p>
              )}
            </div>

            {results.length > 0 ? (
              <div className="space-y-6">
                {results.map((proverb) => (
                  <ProverbCard key={proverb.id} proverb={proverb} currentUser={currentUser} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No proverbs found</h3>
                <p className="text-gray-600 mb-4">
                  Try adjusting your search terms or filters
                </p>
                <Button onClick={clearFilters} variant="outline">
                  Clear Search
                </Button>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-12">
            <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Search African Proverbs</h3>
            <p className="text-gray-600">
              Enter keywords, countries, or categories to find wisdom from African heritage
            </p>
          </div>
        )}
      </main>
    </div>
  )
}
