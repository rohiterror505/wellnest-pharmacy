"use client"

import { Pill, Heart, Leaf, TestTube, Stethoscope, Package } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { useSeniorMode } from "@/components/senior-mode-provider"

const categories = [
  {
    id: 1,
    name: "Medicines",
    icon: Pill,
    color: "bg-red-100 text-red-600",
    count: "2000+ items",
  },
  {
    id: 2,
    name: "Wellness",
    icon: Heart,
    color: "bg-pink-100 text-pink-600",
    count: "500+ items",
  },
  {
    id: 3,
    name: "Ayurveda",
    icon: Leaf,
    color: "bg-green-100 text-green-600",
    count: "300+ items",
  },
  {
    id: 4,
    name: "Lab Tests",
    icon: TestTube,
    color: "bg-blue-100 text-blue-600",
    count: "100+ tests",
  },
  {
    id: 5,
    name: "Consultation",
    icon: Stethoscope,
    color: "bg-purple-100 text-purple-600",
    count: "50+ doctors",
  },
  {
    id: 6,
    name: "Health Packages",
    icon: Package,
    color: "bg-orange-100 text-orange-600",
    count: "20+ packages",
  },
]

export function CategoryGrid() {
  const { isSeniorMode } = useSeniorMode()

  return (
    <div className="space-y-4">
      <h2 className={`font-bold ${isSeniorMode ? "text-3xl" : "text-2xl"}`}>Shop by Category</h2>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {categories.map((category) => {
          const IconComponent = category.icon
          return (
            <Card key={category.id} className="cursor-pointer hover:shadow-lg transition-shadow duration-200">
              <CardContent className={`p-4 text-center space-y-3 ${isSeniorMode ? "p-6" : ""}`}>
                <div
                  className={`mx-auto w-12 h-12 rounded-full ${category.color} flex items-center justify-center ${isSeniorMode ? "w-16 h-16" : ""}`}
                >
                  <IconComponent className={`${isSeniorMode ? "h-8 w-8" : "h-6 w-6"}`} />
                </div>
                <div className="space-y-1">
                  <h3 className={`font-semibold ${isSeniorMode ? "text-lg" : "text-sm"}`}>{category.name}</h3>
                  <p className={`text-muted-foreground ${isSeniorMode ? "text-base" : "text-xs"}`}>{category.count}</p>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
