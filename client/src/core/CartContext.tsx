"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { getMedicineById, Medicine } from "./medicines"

interface CartItem {
  id: number
  quantity: number
  medicine: Medicine
}

interface CartContextType {
  cartItems: CartItem[]
  addToCart: (medicineId: number, quantity?: number) => void
  removeFromCart: (medicineId: number) => void
  updateQuantity: (medicineId: number, quantity: number) => void
  clearCart: () => void
  getTotalPrice: () => number
  getTotalItems: () => number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}

interface CartProviderProps {
  children: ReactNode
}

export function CartProvider({ children }: CartProviderProps) {
  const [cartItems, setCartItems] = useState<CartItem[]>([])

  useEffect(() => {
    const storedCart = localStorage.getItem("wellnest_cart")
    if (storedCart) {
      setCartItems(JSON.parse(storedCart))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem("wellnest_cart", JSON.stringify(cartItems))
  }, [cartItems])

  const addToCart = (medicineId: number, quantity = 1) => {
    const medicine = getMedicineById(medicineId)
    if (!medicine) return

    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.id === medicineId)

      if (existingItem) {
        return prevItems.map((item) =>
          item.id === medicineId ? { ...item, quantity: item.quantity + quantity } : item,
        )
      } else {
        return [...prevItems, { id: medicineId, quantity, medicine }]
      }
    })
  }

  const removeFromCart = (medicineId: number) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== medicineId))
  }

  const updateQuantity = (medicineId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(medicineId)
      return
    }

    setCartItems((prevItems) => prevItems.map((item) => (item.id === medicineId ? { ...item, quantity } : item)))
  }

  const clearCart = () => {
    setCartItems([])
  }

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + item.medicine.price * item.quantity, 0)
  }

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0)
  }

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getTotalPrice,
        getTotalItems,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}
