"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { getSearchSuggestions } from "@/app/actions/search"

interface SearchBarProps {
  placeholder?: string
  className?: string
}

export default function SearchBar({ placeholder = "Search for proverbs, wisdom, or topics...", className = "" }: SearchBarProps) {
  const router = useRouter()
  const [query, setQuery] = useState("")
  const [suggestions, setSuggestions] = useState<{
    categories: string[]
    countries: string[]
    languages: string[]
    authors: string[]
  }>({ categories: [], countries: [], languages: [], authors: [] })
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false)
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1)
  const inputRef = useRef<HTMLInputElement>(null)
  const suggestionsRef = useRef<HTMLDivElement>(null)

  // Debounced search suggestions
  useEffect(() => {
    const timer = setTimeout(() => {
      if (query.length >= 2) {
        fetchSuggestions(query)
      } else {
        setSuggestions({ categories: [], countries: [], languages: [], authors: [] })
        setShowSuggestions(false)
      }
    }, 300) // 300ms debounce

    return () => clearTimeout(timer)
  }, [query])

  const fetchSuggestions = async (searchQuery: string) => {
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
      console.error("Error fetching suggestions:", error)
      setSuggestions({ categories: [], countries: [], languages: [], authors: [] })
      setShowSuggestions(false)
    } finally {
      setIsLoadingSuggestions(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`)
    }
  }

  const getAllSuggestions = () => {
    return [
      ...suggestions.categories.map(cat => ({ type: 'category', value: cat })),
      ...suggestions.countries.map(country => ({ type: 'country', value: country })),
      ...suggestions.languages.map(lang => ({ type: 'language', value: lang })),
      ...suggestions.authors.map(author => ({ type: 'author', value: author })),
    ]
  }

  const selectSuggestion = (suggestion: { type: string, value: string }) => {
    setQuery(suggestion.value)
    setShowSuggestions(false)
    setSelectedSuggestionIndex(-1)
    // Navigate to search with the selected suggestion
    router.push(`/search?q=${encodeURIComponent(suggestion.value)}`)
  }

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
        } else if (query.trim()) {
          router.push(`/search?q=${encodeURIComponent(query.trim())}`)
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
        inputRef.current &&
        !inputRef.current.contains(event.target as Node) &&
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
    <form onSubmit={handleSubmit} className={`relative w-full max-w-2xl ${className}`}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-5 h-5" />
        <Input
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          className="pl-10 pr-4 py-3 text-lg bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 focus:border-orange-500 dark:focus:border-orange-400 rounded-lg shadow-sm text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500"
          aria-label="Search proverbs"
        />

        {/* Suggestions Dropdown */}
        {showSuggestions && (
          <div
            ref={suggestionsRef}
            className="absolute top-full left-0 right-0 z-50 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg shadow-lg dark:shadow-2xl dark:shadow-black/50 max-h-80 overflow-y-auto mt-2"
          >
            {isLoadingSuggestions ? (
              <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                Loading suggestions...
              </div>
            ) : getAllSuggestions().length > 0 ? (
              <div className="py-2">
                {suggestions.categories.length > 0 && (
                  <div className="px-4 py-2">
                    <div className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
                      Categories
                    </div>
                    {suggestions.categories.map((category, index) => (
                      <button
                        key={`category-${category}`}
                        className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800 rounded ${selectedSuggestionIndex === index ? 'bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-400' : 'text-gray-700 dark:text-gray-300'
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
                          className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-100 rounded ${selectedSuggestionIndex === globalIndex ? 'bg-orange-50 text-orange-700' : 'text-gray-700'
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
                          className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-100 rounded ${selectedSuggestionIndex === globalIndex ? 'bg-orange-50 text-orange-700' : 'text-gray-700'
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
                          className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-100 rounded ${selectedSuggestionIndex === globalIndex ? 'bg-orange-50 text-orange-700' : 'text-gray-700'
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
              <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                No suggestions found
              </div>
            )}
          </div>
        )}
      </div>
    </form>
  )
}