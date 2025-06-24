"use client"

import { Star, ShoppingCart } from "lucide-react"
import { Card, CardContent } from "./card"
import { Button } from "./button"
import { Badge } from "./badge"
import { useSeniorMode } from "./senior-mode-provider"

const products = [
  {
    id: 1,
    name: "Paracetamol 500mg",
    brand: "Crocin",
    price: 25,
    originalPrice: 30,
    rating: 4.5,
    image: "/placeholder.svg?height=150&width=150",
    prescription: false,
    inStock: true,
  },
  {
    id: 2,
    name: "Vitamin D3 Tablets",
    brand: "HealthKart",
    price: 299,
    originalPrice: 399,
    rating: 4.3,
    image: "/placeholder.svg?height=150&width=150",
    prescription: false,
    inStock: true,
  },
  {
    id: 3,
    name: "Amoxicillin 250mg",
    brand: "Cipla",
    price: 45,
    originalPrice: 50,
    rating: 4.7,
    image: "/placeholder.svg?height=150&width=150",
    prescription: true,
    inStock: true,
  },
  {
    id: 4,
    name: "Omega 3 Capsules",
    brand: "Neuherbs",
    price: 599,
    originalPrice: 799,
    rating: 4.4,
    image: "/placeholder.svg?height=150&width=150",
    prescription: false,
    inStock: false,
  },
]

export function TrendingProducts() {
  const { isSeniorMode } = useSeniorMode()

  return (
    <div className="space-y-4">
      <h2 className={`font-bold ${isSeniorMode ? "text-3xl" : "text-2xl"}`}>Trending Products</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {products.map((product) => (
          <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-200">
            <CardContent className="p-0">
              <div className="relative">
                <img
                  src={product.image || "/placeholder.svg"}
                  alt={product.name}
                  className="w-full h-40 object-cover"
                />
                {product.prescription && <Badge className="absolute top-2 left-2 bg-red-500">Rx Required</Badge>}
                {!product.inStock && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <Badge variant="destructive">Out of Stock</Badge>
                  </div>
                )}
              </div>

              <div className={`p-4 space-y-3 ${isSeniorMode ? "p-6" : ""}`}>
                <div className="space-y-1">
                  <h3 className={`font-semibold line-clamp-2 ${isSeniorMode ? "text-lg" : "text-sm"}`}>
                    {product.name}
                  </h3>
                  <p className={`text-muted-foreground ${isSeniorMode ? "text-base" : "text-xs"}`}>
                    by {product.brand}
                  </p>
                </div>

                <div className="flex items-center space-x-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className={`${isSeniorMode ? "text-base" : "text-sm"}`}>{product.rating}</span>
                </div>

                <div className="flex items-center space-x-2">
                  <span className={`font-bold ${isSeniorMode ? "text-xl" : "text-lg"}`}>₹{product.price}</span>
                  <span className={`text-muted-foreground line-through ${isSeniorMode ? "text-base" : "text-sm"}`}>
                    ₹{product.originalPrice}
                  </span>
                  <Badge variant="secondary" className={isSeniorMode ? "text-sm" : "text-xs"}>
                    {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                  </Badge>
                </div>

                <Button className={`w-full ${isSeniorMode ? "h-12 text-lg" : ""}`} disabled={!product.inStock}>
                  <ShoppingCart className={`mr-2 ${isSeniorMode ? "h-5 w-5" : "h-4 w-4"}`} />
                  {product.inStock ? "Add to Cart" : "Out of Stock"}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
