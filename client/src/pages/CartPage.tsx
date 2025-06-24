"use client"

import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from "lucide-react"
import { useCart } from "../core/CartContext"
import { useSeniorMode } from "../core/SeniorModeContext"
import toast from "react-hot-toast"

export default function CartPage() {
  const { cartItems, updateQuantity, removeFromCart, getTotalPrice, clearCart } = useCart()
  const { isSeniorMode } = useSeniorMode()
  const navigate = useNavigate()
  const [isClearing, setIsClearing] = useState(false)

  const handleQuantityChange = (medicineId: number, newQuantity: number) => {
    if (newQuantity < 1) {
      removeFromCart(medicineId)
      toast.success("Item removed from cart")
    } else {
      updateQuantity(medicineId, newQuantity)
    }
  }

  const handleRemoveItem = (medicineId: number, medicineName: string) => {
    removeFromCart(medicineId)
    toast.success(`${medicineName} removed from cart`)
  }

  const handleClearCart = () => {
    setIsClearing(true)
    setTimeout(() => {
      clearCart()
      toast.success("Cart cleared")
      setIsClearing(false)
    }, 500)
  }

  const subtotal = getTotalPrice()
  const deliveryFee = subtotal >= 299 ? 0 : 50
  const total = subtotal + deliveryFee

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <ShoppingBag className="h-24 w-24 text-gray-300 mx-auto mb-4" />
          <h2 className={`font-bold text-gray-900 mb-4 ${isSeniorMode ? "text-3xl" : "text-2xl"}`}>
            Your cart is empty
          </h2>
          <p className={`text-gray-600 mb-8 ${isSeniorMode ? "text-lg" : "text-base"}`}>
            Add some medicines to get started
          </p>
          <Link
            to="/"
            className={`bg-green-500 text-white px-8 py-3 rounded-lg hover:bg-green-600 font-medium ${
              isSeniorMode ? "px-12 py-4 text-lg" : ""
            }`}
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className={`font-bold text-gray-900 ${isSeniorMode ? "text-3xl" : "text-2xl"}`}>
            Shopping Cart ({cartItems.length} items)
          </h1>
          <button
            onClick={handleClearCart}
            disabled={isClearing}
            className={`text-red-600 hover:text-red-700 font-medium ${isSeniorMode ? "text-lg" : "text-sm"}`}
          >
            {isClearing ? "Clearing..." : "Clear Cart"}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <div key={item.id} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-start space-x-4">
                  <Link to={`/medicine/${item.medicine.id}`}>
                    <img
                      src={item.medicine.image || "/placeholder.svg"}
                      alt={item.medicine.name}
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                  </Link>

                  <div className="flex-1 space-y-2">
                    <Link to={`/medicine/${item.medicine.id}`}>
                      <h3 className={`font-semibold hover:text-green-600 ${isSeniorMode ? "text-xl" : "text-lg"}`}>
                        {item.medicine.name}
                      </h3>
                    </Link>
                    <p className={`text-gray-600 ${isSeniorMode ? "text-base" : "text-sm"}`}>
                      by {item.medicine.brand}
                    </p>

                    {item.medicine.prescription && (
                      <span className="inline-block bg-red-100 text-red-600 text-xs px-2 py-1 rounded">
                        Prescription Required
                      </span>
                    )}

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                          className={`p-2 border border-gray-300 rounded-lg hover:bg-gray-50 ${
                            isSeniorMode ? "p-3" : ""
                          }`}
                        >
                          <Minus className={`${isSeniorMode ? "h-5 w-5" : "h-4 w-4"}`} />
                        </button>

                        <span className={`font-medium min-w-[2rem] text-center ${isSeniorMode ? "text-lg" : ""}`}>
                          {item.quantity}
                        </span>

                        <button
                          onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                          className={`p-2 border border-gray-300 rounded-lg hover:bg-gray-50 ${
                            isSeniorMode ? "p-3" : ""
                          }`}
                        >
                          <Plus className={`${isSeniorMode ? "h-5 w-5" : "h-4 w-4"}`} />
                        </button>
                      </div>

                      <button
                        onClick={() => handleRemoveItem(item.id, item.medicine.name)}
                        className={`text-red-600 hover:text-red-700 p-2 ${isSeniorMode ? "p-3" : ""}`}
                      >
                        <Trash2 className={`${isSeniorMode ? "h-6 w-6" : "h-5 w-5"}`} />
                      </button>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className={`font-bold ${isSeniorMode ? "text-xl" : "text-lg"}`}>
                      ₹{item.medicine.price * item.quantity}
                    </p>
                    <p className={`text-gray-500 line-through ${isSeniorMode ? "text-base" : "text-sm"}`}>
                      ₹{item.medicine.originalPrice * item.quantity}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className={`font-semibold mb-4 ${isSeniorMode ? "text-2xl" : "text-xl"}`}>Order Summary</h2>

              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className={`${isSeniorMode ? "text-lg" : "text-base"}`}>Subtotal</span>
                  <span className={`font-medium ${isSeniorMode ? "text-lg" : "text-base"}`}>₹{subtotal}</span>
                </div>

                <div className="flex justify-between">
                  <span className={`${isSeniorMode ? "text-lg" : "text-base"}`}>Delivery Fee</span>
                  <span className={`font-medium ${isSeniorMode ? "text-lg" : "text-base"}`}>
                    {deliveryFee === 0 ? "FREE" : `₹${deliveryFee}`}
                  </span>
                </div>

                {subtotal < 299 && (
                  <div className="text-green-600 text-sm bg-green-50 p-3 rounded-lg">
                    Add ₹{299 - subtotal} more for free delivery!
                  </div>
                )}

                <div className="border-t pt-3">
                  <div className="flex justify-between">
                    <span className={`font-semibold ${isSeniorMode ? "text-xl" : "text-lg"}`}>Total</span>
                    <span className={`font-bold text-green-600 ${isSeniorMode ? "text-2xl" : "text-xl"}`}>
                      ₹{total}
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => navigate("/checkout")}
                className={`w-full bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 font-medium flex items-center justify-center space-x-2 mt-6 ${
                  isSeniorMode ? "py-4 text-lg" : ""
                }`}
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className={`${isSeniorMode ? "h-6 w-6" : "h-5 w-5"}`} />
              </button>
            </div>

            {/* Prescription Notice */}
            {cartItems.some((item) => item.medicine.prescription) && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h3 className={`font-semibold text-yellow-800 mb-2 ${isSeniorMode ? "text-lg" : "text-base"}`}>
                  Prescription Required
                </h3>
                <p className={`text-yellow-700 ${isSeniorMode ? "text-base" : "text-sm"}`}>
                  Some items in your cart require a prescription. You'll need to upload it during checkout.
                </p>
                <Link
                  to="/upload-prescription"
                  className={`text-yellow-800 hover:text-yellow-900 font-medium ${
                    isSeniorMode ? "text-base" : "text-sm"
                  }`}
                >
                  Upload Prescription →
                </Link>
              </div>
            )}

            {/* Continue Shopping */}
            <Link
              to="/"
              className={`block text-center text-green-600 hover:text-green-700 font-medium ${
                isSeniorMode ? "text-lg" : "text-base"
              }`}
            >
              ← Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
