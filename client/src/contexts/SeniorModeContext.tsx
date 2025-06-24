"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

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
    const saved = localStorage.getItem("wellnest_senior_mode")
    if (saved) {
      setIsSeniorMode(JSON.parse(saved))
    }
  }, [])

  const toggleSeniorMode = () => {
    const newMode = !isSeniorMode
    setIsSeniorMode(newMode)
    localStorage.setItem("wellnest_senior_mode", JSON.stringify(newMode))
  }

  return (
    <SeniorModeContext.Provider value={{ isSeniorMode, toggleSeniorMode }}>
      <div className={isSeniorMode ? "senior-mode" : ""}>{children}</div>
    </SeniorModeContext.Provider>
  )
}
