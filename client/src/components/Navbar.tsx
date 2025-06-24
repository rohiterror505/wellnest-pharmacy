"use client"

import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { ShoppingCart, User, Menu, X, Eye, EyeOff } from "lucide-react"
import { useAuth } from "../contexts/AuthContext"
import { useCart } from "../contexts/CartContext"
import { useSeniorMode } from "../contexts/SeniorModeContext"
import SearchBar from "./SearchBar"

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { user, logout } = useAuth()
  const { cartItems } = useCart()
  const { isSeniorMode, toggleSeniorMode } = useSeniorMode()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate("/")
  }

  const cartItemsCount = cartItems.reduce((total, item) => total + item.quantity, 0)

  return (
    <nav className={`bg-white shadow-md sticky top-0 z-50 ${isSeniorMode ? "py-4" : "py-3"}`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="bg-green-500 text-white p-2 rounded-lg">
              <span className={`font-bold ${isSeniorMode ? "text-xl" : "text-lg"}`}>W</span>
            </div>
            <span className={`font-bold text-green-600 ${isSeniorMode ? "text-2xl" : "text-xl"}`}>Wellnest</span>
          </Link>

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <SearchBar />
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Senior Mode Toggle */}
            <button
              onClick={toggleSeniorMode}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg border hover:bg-gray-50 ${
                isSeniorMode ? "text-lg px-4 py-3" : ""
              }`}
            >
              {isSeniorMode ? <EyeOff className="h-5 w-5" /> : <Eye className="h-4 w-4" />}
              <span className={isSeniorMode ? "text-base" : "text-sm"}>
                {isSeniorMode ? "Exit Senior" : "Senior Mode"}
              </span>
            </button>

            {/* Cart */}
            <Link to="/cart" className={`relative p-2 hover:bg-gray-100 rounded-lg ${isSeniorMode ? "p-3" : ""}`}>
              <ShoppingCart className={`${isSeniorMode ? "h-6 w-6" : "h-5 w-5"}`} />
              {cartItemsCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartItemsCount}
                </span>
              )}
            </Link>

            {/* User Menu */}
            {user ? (
              <div className="relative group">
                <button
                  className={`flex items-center space-x-2 p-2 hover:bg-gray-100 rounded-lg ${isSeniorMode ? "p-3" : ""}`}
                >
                  <User className={`${isSeniorMode ? "h-6 w-6" : "h-5 w-5"}`} />
                  <span className={isSeniorMode ? "text-base" : "text-sm"}>{user.name}</span>
                </button>
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  <div className="py-2">
                    <Link to="/orders" className="block px-4 py-2 text-sm hover:bg-gray-100">
                      My Orders
                    </Link>
                    <Link to="/profile" className="block px-4 py-2 text-sm hover:bg-gray-100">
                      Profile
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className={`px-4 py-2 text-green-600 hover:bg-green-50 rounded-lg ${
                    isSeniorMode ? "px-6 py-3 text-lg" : ""
                  }`}
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className={`px-4 py-2 bg-green-500 text-white hover:bg-green-600 rounded-lg ${
                    isSeniorMode ? "px-6 py-3 text-lg" : ""
                  }`}
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden p-2 hover:bg-gray-100 rounded-lg">
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Search Bar */}
        <div className="md:hidden mt-4">
          <SearchBar />
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t pt-4">
            <div className="space-y-2">
              <button
                onClick={toggleSeniorMode}
                className="flex items-center space-x-2 w-full p-3 hover:bg-gray-50 rounded-lg"
              >
                {isSeniorMode ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                <span>{isSeniorMode ? "Exit Senior Mode" : "Senior Mode"}</span>
              </button>

              <Link
                to="/cart"
                className="flex items-center space-x-2 w-full p-3 hover:bg-gray-50 rounded-lg"
                onClick={() => setIsMenuOpen(false)}
              >
                <ShoppingCart className="h-5 w-5" />
                <span>Cart ({cartItemsCount})</span>
              </Link>

              {user ? (
                <>
                  <Link
                    to="/orders"
                    className="block w-full p-3 hover:bg-gray-50 rounded-lg"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    My Orders
                  </Link>
                  <Link
                    to="/profile"
                    className="block w-full p-3 hover:bg-gray-50 rounded-lg"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Profile
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout()
                      setIsMenuOpen(false)
                    }}
                    className="block w-full text-left p-3 hover:bg-gray-50 rounded-lg"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <div className="space-y-2">
                  <Link
                    to="/login"
                    className="block w-full p-3 text-center text-green-600 hover:bg-green-50 rounded-lg"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    className="block w-full p-3 text-center bg-green-500 text-white hover:bg-green-600 rounded-lg"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
