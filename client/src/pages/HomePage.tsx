"use client"

import { Link } from "react-router-dom"
import { Pill, TestTube, Stethoscope, Upload, Star, ShoppingCart, ChevronRight } from "lucide-react"
import { useSeniorMode } from "../contexts/SeniorModeContext"
import { useCart } from "../contexts/CartContext"
import { getTrendingMedicines, categories, medicines, Medicine } from "../data/medicines"
import toast from "react-hot-toast"

// Add a type for categories with icon and count
interface Category {
  id: string;
  name: string;
  icon: React.ReactNode;
  count: number;
}

const categoryIcons: { [key: string]: React.ReactNode } = {
  fever: <Pill />,
  antibiotics: <TestTube />,
  "lab-tests": <TestTube />,
  "consult-doctor": <Stethoscope />,
  "upload-prescription": <Upload />,
  // Add more mappings as needed
};

const categoriesWithExtras: Category[] = categories.map((cat) => ({
  ...cat,
  icon: categoryIcons[cat.id] || <Pill />,
  count: medicines.filter((m: Medicine) => m.category === cat.id).length,
}));

export default function HomePage() {
  const { isSeniorMode } = useSeniorMode()
  const { addToCart } = useCart()
  const trendingMedicines: Medicine[] = getTrendingMedicines()

  const handleAddToCart = (medicineId: number, medicineName: string) => {
    addToCart(medicineId)
    toast.success(`${medicineName} added to cart!`)
  }

  const banners = [
    {
      id: 1,
      title: "Free Home Delivery",
      subtitle: "On orders above ₹299",
      image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=200&fit=crop",
      color: "bg-green-500",
    },
    {
      id: 2,
      title: "Upload Prescription",
      subtitle: "Get medicines delivered",
      image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=400&h=200&fit=crop",
      color: "bg-blue-500",
    },
    {
      id: 3,
      title: "Lab Tests at Home",
      subtitle: "Book now, get tested tomorrow",
      image: "https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=400&h=200&fit=crop",
      color: "bg-purple-500",
    },
  ]

  return (
    <div className="space-y-8">
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-green-500 to-blue-600 text-white rounded-lg p-8 md:p-12">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <h1 className={`font-bold ${isSeniorMode ? "text-5xl" : "text-4xl"}`}>Welcome to Wellnest</h1>
          <p className={`${isSeniorMode ? "text-xl" : "text-lg"} opacity-90`}>
            Your trusted online pharmacy for medicines, wellness products, and healthcare services
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-6">
            <Link
              to="/upload-prescription"
              className={`bg-white text-green-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors ${
                isSeniorMode ? "px-8 py-4 text-lg" : ""
              }`}
            >
              Upload Prescription
            </Link>
            <Link
              to="/category/medicines"
              className={`border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-green-600 transition-colors ${
                isSeniorMode ? "px-8 py-4 text-lg" : ""
              }`}
            >
              Browse Medicines
            </Link>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { name: "Order Medicines", icon: Pill, link: "/category/medicines", color: "bg-red-100 text-red-600" },
          {
            name: "Upload Prescription",
            icon: Upload,
            link: "/upload-prescription",
            color: "bg-blue-100 text-blue-600",
          },
          { name: "Lab Tests", icon: TestTube, link: "/lab-tests", color: "bg-green-100 text-green-600" },
          {
            name: "Consult Doctor",
            icon: Stethoscope,
            link: "/consult-doctor",
            color: "bg-purple-100 text-purple-600",
          },
        ].map((action, index) => {
          const IconComponent = action.icon
          return (
            <Link
              key={index}
              to={action.link}
              className={`p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow text-center space-y-3 ${
                isSeniorMode ? "p-8" : ""
              }`}
            >
              <div
                className={`mx-auto w-12 h-12 rounded-full ${action.color} flex items-center justify-center ${
                  isSeniorMode ? "w-16 h-16" : ""
                }`}
              >
                <IconComponent className={`${isSeniorMode ? "h-8 w-8" : "h-6 w-6"}`} />
              </div>
              <h3 className={`font-semibold ${isSeniorMode ? "text-lg" : "text-sm"}`}>{action.name}</h3>
            </Link>
          )
        })}
      </div>

      {/* Categories */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className={`font-bold ${isSeniorMode ? "text-3xl" : "text-2xl"}`}>Shop by Category</h2>
          <Link
            to="/category/medicines"
            className={`text-green-600 hover:text-green-700 flex items-center ${isSeniorMode ? "text-lg" : "text-sm"}`}
          >
            View All <ChevronRight className="h-4 w-4 ml-1" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
          {categoriesWithExtras.map((category: Category) => (
            <Link
              key={category.id}
              to={`/category/${category.id}`}
              className={`bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-4 text-center space-y-2 ${
                isSeniorMode ? "p-6" : ""
              }`}
            >
              <div className={`text-2xl ${isSeniorMode ? "text-4xl" : ""}`}>{category.icon}</div>
              <h3 className={`font-semibold ${isSeniorMode ? "text-lg" : "text-sm"}`}>{category.name}</h3>
              <p className={`text-gray-500 ${isSeniorMode ? "text-base" : "text-xs"}`}>{category.count} items</p>
            </Link>
          ))}
        </div>
      </div>

      {/* Trending Products */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className={`font-bold ${isSeniorMode ? "text-3xl" : "text-2xl"}`}>Trending Products</h2>
          <Link
            to="/search"
            className={`text-green-600 hover:text-green-700 flex items-center ${isSeniorMode ? "text-lg" : "text-sm"}`}
          >
            View All <ChevronRight className="h-4 w-4 ml-1" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {trendingMedicines.slice(0, 8).map((medicine: Medicine) => (
            <div
              key={medicine.id}
              className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden"
            >
              <Link to={`/medicine/${medicine.id}`}>
                <img
                  src={medicine.image || "/placeholder.svg"}
                  alt={medicine.name}
                  className="w-full h-40 object-cover"
                />
              </Link>

              <div className={`p-4 space-y-3 ${isSeniorMode ? "p-6" : ""}`}>
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
      </div>

      {/* Features */}
      <div className="bg-gray-50 rounded-lg p-8">
        <h2 className={`font-bold text-center mb-8 ${isSeniorMode ? "text-3xl" : "text-2xl"}`}>Why Choose Wellnest?</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              icon: "🚚",
              title: "Free Home Delivery",
              description: "Free delivery on orders above ₹299. Same-day delivery available in select cities.",
            },
            {
              icon: "👨‍⚕️",
              title: "Licensed Pharmacists",
              description: "All prescriptions verified by licensed pharmacists before dispatch.",
            },
            {
              icon: "🔒",
              title: "Secure & Safe",
              description: "100% genuine medicines with secure payment and data protection.",
            },
          ].map((feature, index) => (
            <div key={index} className="text-center space-y-3">
              <div className={`text-4xl ${isSeniorMode ? "text-6xl" : ""}`}>{feature.icon}</div>
              <h3 className={`font-semibold ${isSeniorMode ? "text-xl" : "text-lg"}`}>{feature.title}</h3>
              <p className={`text-gray-600 ${isSeniorMode ? "text-lg" : "text-sm"}`}>{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
