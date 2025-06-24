"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useSeniorMode } from "@/components/senior-mode-provider"

const banners = [
  {
    id: 1,
    title: "Free Home Delivery",
    subtitle: "On orders above ₹299",
    image: "/placeholder.svg?height=200&width=400",
    color: "bg-green-500",
  },
  {
    id: 2,
    title: "Upload Prescription",
    subtitle: "Get medicines delivered",
    image: "/placeholder.svg?height=200&width=400",
    color: "bg-blue-500",
  },
  {
    id: 3,
    title: "Lab Tests at Home",
    subtitle: "Book now, get tested tomorrow",
    image: "/placeholder.svg?height=200&width=400",
    color: "bg-purple-500",
  },
]

export function Banner() {
  const [currentBanner, setCurrentBanner] = useState(0)
  const { isSeniorMode } = useSeniorMode()

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % banners.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  const nextBanner = () => {
    setCurrentBanner((prev) => (prev + 1) % banners.length)
  }

  const prevBanner = () => {
    setCurrentBanner((prev) => (prev - 1 + banners.length) % banners.length)
  }

  return (
    <div className="relative overflow-hidden rounded-lg">
      <div
        className={`flex transition-transform duration-500 ease-in-out`}
        style={{ transform: `translateX(-${currentBanner * 100}%)` }}
      >
        {banners.map((banner) => (
          <div key={banner.id} className={`w-full flex-shrink-0 ${banner.color} text-white p-8 md:p-12`}>
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <h2 className={`font-bold ${isSeniorMode ? "text-3xl md:text-4xl" : "text-2xl md:text-3xl"}`}>
                  {banner.title}
                </h2>
                <p className={`${isSeniorMode ? "text-xl" : "text-lg"} opacity-90`}>{banner.subtitle}</p>
              </div>
              <div className="hidden md:block">
                <img
                  src={banner.image || "/placeholder.svg"}
                  alt={banner.title}
                  className="w-32 h-32 object-cover rounded-lg"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <Button
        variant="outline"
        size="icon"
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 border-white/30 text-white hover:bg-white/30"
        onClick={prevBanner}
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      <Button
        variant="outline"
        size="icon"
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 border-white/30 text-white hover:bg-white/30"
        onClick={nextBanner}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>

      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {banners.map((_, index) => (
          <button
            key={index}
            className={`w-2 h-2 rounded-full transition-colors ${index === currentBanner ? "bg-white" : "bg-white/50"}`}
            onClick={() => setCurrentBanner(index)}
          />
        ))}
      </div>
    </div>
  )
}
