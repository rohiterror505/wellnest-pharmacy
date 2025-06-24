"use client"

import { useState, useEffect } from "react"
import { useSearchParams, Link } from "react-router-dom"
import { Star, ShoppingCart, Filter, SlidersHorizontal } from "lucide-react"
import { useSeniorMode } from "../core/SeniorModeContext"
import { useCart } from "../core/CartContext"
import { searchMedicines, Medicine } from "../core/medicines"
import toast from "react-hot-toast"

export default function SearchResultsPage() {
  const [searchParams] = useSearchParams()
  const query = searchParams.get("q") || ""
  const [results, setResults] = useState<Medicine[]>([])
  const [filteredResults, setFilteredResults] = useState<Medicine[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState({
    category: "",
    minPrice: "",
    maxPrice: "",
    prescription: "",
    inStock: true,
    sortBy: "relevance",
  })

  const { isSeniorMode } = useSeniorMode()
  const { addToCart } = useCart()

  useEffect(() => {
    if (query) {
      setIsLoading(true)
      // Simulate API delay
      setTimeout(() => {
        const searchResults = searchMedicines(query)
        setResults(searchResults)
        setFilteredResults(searchResults)
        setIsLoading(false)
      }, 500)
    }
  }, [query])

  useEffect(() => {
    let filtered = [...results]

    // Apply filters
    if (filters.category) {
      filtered = filtered.filter((medicine: Medicine) => medicine.category === filters.category)
    }

    if (filters.minPrice) {
      filtered = filtered.filter((medicine: Medicine) => medicine.price >= Number(filters.minPrice))
    }

    if (filters.maxPrice) {
      filtered = filtered.filter((medicine: Medicine) => medicine.price <= Number(filters.maxPrice))
    }

    if (filters.prescription !== "") {
      filtered = filtered.filter((medicine: Medicine) => medicine.prescription === (filters.prescription === "true"))
    }

    if (filters.inStock) {
      filtered = filtered.filter((medicine: Medicine) => medicine.inStock)
    }

    // Apply sorting
    switch (filters.sortBy) {
      case "price-low":
        filtered.sort((a: Medicine, b: Medicine) => a.price - b.price)
        break
      case "price-high":
        filtered.sort((a: Medicine, b: Medicine) => b.price - a.price)
        break
      case "rating":
        filtered.sort((a: Medicine, b: Medicine) => b.rating - a.rating)
        break
      case "name":
        filtered.sort((a: Medicine, b: Medicine) => a.name.localeCompare(b.name))
        break
      default:
        // Keep original order for relevance
        break
    }

    setFilteredResults(filtered)
  }, [results, filters])

  const handleAddToCart = (medicineId: number, medicineName: string) => {
    addToCart(medicineId)
    toast.success(`${medicineName} added to cart!`)
  }

  const clearFilters = () => {
    setFilters({
      category: "",
      minPrice: "",
      maxPrice: "",
      prescription: "",
      inStock: true,
      sortBy: "relevance",
    })
  }

  const categories = [
    { value: "fever", label: "Fever & Pain" },
    { value: "vitamins", label: "Vitamins" },
    { value: "antibiotics", label: "Antibiotics" },
    { value: "cough", label: "Cough & Cold" },
    { value: "diabetes", label: "Diabetes" },
    { value: "skincare", label: "Skincare" },
    { value: "heart", label: "Heart & BP" },
    { value: "digestive", label: "Digestive" },
  ]

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className={`font-bold text-gray-900 ${isSeniorMode ? "text-3xl" : "text-2xl"}`}>
              Search Results for "{query}"
            </h1>
            <p className={`text-gray-600 ${isSeniorMode ? "text-lg" : "text-base"}`}>
              {filteredResults.length} medicines found
            </p>
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 ${
                isSeniorMode ? "px-6 py-3 text-lg" : ""
              }`}
            >
              <SlidersHorizontal className={`${isSeniorMode ? "h-6 w-6" : "h-5 w-5"}`} />
              <span>Filters</span>
            </button>

            <select
              value={filters.sortBy}
              onChange={(e) => setFilters((prev) => ({ ...prev, sortBy: e.target.value }))}
              className={`px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
                isSeniorMode ? "px-6 py-3 text-lg" : ""
              }`}
            >
              <option value="relevance">Sort by Relevance</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
              <option value="name">Name A-Z</option>
            </select>
          </div>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className={`font-semibold ${isSeniorMode ? "text-xl" : "text-lg"}`}>Filters</h2>
              <button
                onClick={clearFilters}
                className={`text-green-600 hover:text-green-700 ${isSeniorMode ? "text-lg" : "text-sm"}`}
              >
                Clear All
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className={`block text-gray-700 font-medium mb-2 ${isSeniorMode ? "text-lg" : "text-sm"}`}>
                  Category
                </label>
                <select
                  value={filters.category}
                  onChange={(e) => setFilters((prev) => ({ ...prev, category: e.target.value }))}
                  className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
                    isSeniorMode ? "py-3 text-lg" : ""
                  }`}
                >
                  <option value="">All Categories</option>
                  {categories.map((cat) => (
                    <option key={cat.value} value={cat.value}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className={`block text-gray-700 font-medium mb-2 ${isSeniorMode ? "text-lg" : "text-sm"}`}>
                  Min Price (₹)
                </label>
                <input
                  type="number"
                  value={filters.minPrice}
                  onChange={(e) => setFilters((prev) => ({ ...prev, minPrice: e.target.value }))}
                  placeholder="0"
                  className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
                    isSeniorMode ? "py-3 text-lg" : ""
                  }`}
                />
              </div>

              <div>
                <label className={`block text-gray-700 font-medium mb-2 ${isSeniorMode ? "text-lg" : "text-sm"}`}>
                  Max Price (₹)
                </label>
                <input
                  type="number"
                  value={filters.maxPrice}
                  onChange={(e) => setFilters((prev) => ({ ...prev, maxPrice: e.target.value }))}
                  placeholder="1000"
                  className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
                    isSeniorMode ? "py-3 text-lg" : ""
                  }`}
                />
              </div>

              <div>
                <label className={`block text-gray-700 font-medium mb-2 ${isSeniorMode ? "text-lg" : "text-sm"}`}>
                  Prescription
                </label>
                <select
                  value={filters.prescription}
                  onChange={(e) => setFilters((prev) => ({ ...prev, prescription: e.target.value }))}
                  className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
                    isSeniorMode ? "py-3 text-lg" : ""
                  }`}
                >
                  <option value="">All</option>
                  <option value="false">No Prescription Required</option>
                  <option value="true">Prescription Required</option>
                </select>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="inStock"
                  checked={filters.inStock}
                  onChange={(e) => setFilters((prev) => ({ ...prev, inStock: e.target.checked }))}
                  className="mr-2"
                />
                <label htmlFor="inStock" className={`text-gray-700 ${isSeniorMode ? "text-lg" : "text-sm"}`}>
                  In Stock Only
                </label>
              </div>
            </div>
          </div>
        )}

        {/* Results */}
        {filteredResults.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Filter className="h-16 w-16 mx-auto" />
            </div>
            <h3 className={`font-semibold text-gray-900 mb-2 ${isSeniorMode ? "text-2xl" : "text-xl"}`}>
              No medicines found
            </h3>
            <p className={`text-gray-600 ${isSeniorMode ? "text-lg" : "text-base"}`}>
              Try adjusting your search or filters
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredResults.map((medicine: Medicine) => (
              <div
                key={medicine.id}
                className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden"
              >
                <Link to={`/medicine/${medicine.id}`}>
                  <img
                    src={medicine.image || "/placeholder.svg"}
                    alt={medicine.name}
                    className="w-full h-48 object-cover"
                  />
                </Link>

                <div className={`p-4 space-y-3 ${isSeniorMode ? "p-6" : ""}`}>
                  {medicine.prescription && (
                    <span className="inline-block bg-red-100 text-red-600 text-xs px-2 py-1 rounded">Rx Required</span>
                  )}

                  <div className="space-y-1">
                    <Link to={`/medicine/${medicine.id}`}>
                      <h3
                        className={`font-semibold line-clamp-2 hover:text-green-600 ${
                          isSeniorMode ? "text-lg" : "text-sm"
                        }`}
                      >
                        {medicine.name}
                      </h3>
                    </Link>
                    <p className={`text-gray-500 ${isSeniorMode ? "text-base" : "text-xs"}`}>by {medicine.brand}</p>
                  </div>

                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className={`${isSeniorMode ? "text-base" : "text-sm"}`}>{medicine.rating}</span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <span className={`font-bold ${isSeniorMode ? "text-xl" : "text-lg"}`}>₹{medicine.price}</span>
                    <span className={`text-gray-500 line-through ${isSeniorMode ? "text-base" : "text-sm"}`}>
                      ₹{medicine.originalPrice}
                    </span>
                    <span
                      className={`bg-green-100 text-green-600 px-2 py-1 rounded text-xs font-medium ${
                        isSeniorMode ? "text-sm px-3 py-2" : ""
                      }`}
                    >
                      {Math.round(((medicine.originalPrice - medicine.price) / medicine.originalPrice) * 100)}% OFF
                    </span>
                  </div>

                  <button
                    onClick={() => handleAddToCart(medicine.id, medicine.name)}
                    disabled={!medicine.inStock}
                    className={`w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed font-medium flex items-center justify-center space-x-2 ${
                      isSeniorMode ? "py-3 text-lg" : ""
                    }`}
                  >
                    <ShoppingCart className={`${isSeniorMode ? "h-5 w-5" : "h-4 w-4"}`} />
                    <span>{medicine.inStock ? "Add to Cart" : "Out of Stock"}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
