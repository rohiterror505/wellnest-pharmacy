"use client"

import { useState, useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { Search, X } from "lucide-react"
import { useSeniorMode } from "../contexts/SeniorModeContext"
import { searchMedicines, Medicine } from "../data/medicines"

export default function SearchBar() {
  const [query, setQuery] = useState("")
  const [suggestions, setSuggestions] = useState<Medicine[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { isSeniorMode } = useSeniorMode()
  const navigate = useNavigate()
  const searchRef = useRef(null)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current)
    }

    if (query.trim().length > 0) {
      setIsLoading(true)
      debounceRef.current = setTimeout(() => {
        const results = searchMedicines(query)
        setSuggestions(results.slice(0, 5)) // Show top 5 suggestions
        setShowSuggestions(true)
        setIsLoading(false)
      }, 300)
    } else {
      setSuggestions([])
      setShowSuggestions(false)
      setIsLoading(false)
    }

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current)
      }
    }
  }, [query])

  const handleSearch = (searchQuery = query) => {
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
      setShowSuggestions(false)
      setQuery("")
    }
  }

  const handleSuggestionClick = (suggestion: Medicine) => {
    setQuery(suggestion.name)
    handleSearch(suggestion.name)
  }

  const clearSearch = () => {
    setQuery("")
    setSuggestions([])
    setShowSuggestions(false)
  }

  return (
    <div className="relative w-full" ref={searchRef}>
      <div className="relative">
        <input
          type="text"
          placeholder="Search medicines, wellness products..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleSearch()}
          className={`w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent ${
            isSeniorMode ? "py-3 text-lg" : ""
          }`}
        />

        <Search
          className={`absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 ${
            isSeniorMode ? "h-6 w-6" : "h-5 w-5"
          }`}
        />

        {query && (
          <button
            onClick={clearSearch}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X className={`${isSeniorMode ? "h-6 w-6" : "h-5 w-5"}`} />
          </button>
        )}
      </div>

      {/* Suggestions Dropdown */}
      {showSuggestions && (
        <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg mt-1 z-50 max-h-60 overflow-y-auto">
          {isLoading ? (
            <div className="p-4 text-center text-gray-500">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-500 mx-auto"></div>
            </div>
          ) : suggestions.length > 0 ? (
            <>
              {suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className={`w-full text-left px-4 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0 ${
                    isSeniorMode ? "py-4" : ""
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <img
                      src={suggestion.image || "/placeholder.svg"}
                      alt={suggestion.name}
                      className="w-8 h-8 object-cover rounded"
                    />
                    <div>
                      <p className={`font-medium ${isSeniorMode ? "text-lg" : "text-sm"}`}>{suggestion.name}</p>
                      <p className={`text-gray-500 ${isSeniorMode ? "text-base" : "text-xs"}`}>
                        by {suggestion.brand} • ₹{suggestion.price}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
              <button
                onClick={() => handleSearch()}
                className={`w-full text-left px-4 py-3 text-green-600 hover:bg-green-50 font-medium ${
                  isSeniorMode ? "py-4 text-lg" : "text-sm"
                }`}
              >
                View all results for "{query}"
              </button>
            </>
          ) : (
            <div className={`p-4 text-center text-gray-500 ${isSeniorMode ? "text-lg" : "text-sm"}`}>
              No medicines found for "{query}"
            </div>
          )}
        </div>
      )}
    </div>
  )
}
