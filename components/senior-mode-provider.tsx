"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { Button } from "@/components/ui/button"
import { Eye, EyeOff } from "lucide-react"

interface SeniorModeContextType {
  isSeniorMode: boolean
  toggleSeniorMode: () => void
}

const SeniorModeContext = createContext<SeniorModeContextType | undefined>(undefined)

export function useSeniorMode() {
  const context = useContext(SeniorModeContext)
  if (!context) {
    throw new Error("useSeniorMode must be used within a SeniorModeProvider")
  }
  return context
}

interface SeniorModeProviderProps {
  children: ReactNode
}

export function SeniorModeProvider({ children }: SeniorModeProviderProps) {
  const [isSeniorMode, setIsSeniorMode] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem("seniorMode")
    if (saved) {
      setIsSeniorMode(JSON.parse(saved))
    }
  }, [])

  const toggleSeniorMode = () => {
    const newMode = !isSeniorMode
    setIsSeniorMode(newMode)
    localStorage.setItem("seniorMode", JSON.stringify(newMode))
  }

  return (
    <SeniorModeContext.Provider value={{ isSeniorMode, toggleSeniorMode }}>
      <div className={isSeniorMode ? "senior-mode" : ""}>
        {/* Senior Mode Toggle Button */}
        <div className="fixed top-4 right-4 z-50">
          <Button
            variant="outline"
            size={isSeniorMode ? "lg" : "default"}
            onClick={toggleSeniorMode}
            className={`bg-background/80 backdrop-blur-sm ${isSeniorMode ? "text-lg px-6 py-3" : ""}`}
          >
            {isSeniorMode ? (
              <>
                <EyeOff className="mr-2 h-5 w-5" />
                Exit Senior Mode
              </>
            ) : (
              <>
                <Eye className="mr-2 h-4 w-4" />
                Senior Mode
              </>
            )}
          </Button>
        </div>

        {children}
      </div>
    </SeniorModeContext.Provider>
  )
}
