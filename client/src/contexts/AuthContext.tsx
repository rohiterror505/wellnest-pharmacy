"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

interface User {
  id: string
  name: string
  email: string
  phone: string
}

interface AuthContextType {
  user: User | null
  login: (userData: User) => void
  logout: () => void
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    // Check for stored user data on app load
    const storedUser = localStorage.getItem("wellnest_user")
    const storedToken = localStorage.getItem("wellnest_token")

    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser))
    }
  }, [])

  const login = (userData: User) => {
    setUser(userData)
    localStorage.setItem("wellnest_user", JSON.stringify(userData))
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("wellnest_user")
    localStorage.removeItem("wellnest_token")
  }

  const isAuthenticated = !!user

  return <AuthContext.Provider value={{ user, login, logout, isAuthenticated }}>{children}</AuthContext.Provider>
}
