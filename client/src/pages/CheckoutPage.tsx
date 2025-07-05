"use client"

import type React from "react"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { CreditCard, Smartphone, Building, Truck, MapPin, Clock } from "lucide-react"
import { useCart } from "../core/CartContext"
import { useSeniorMode } from "../components/senior-mode-provider"
import { useAuth } from "../core/AuthContext"
import toast from "react-hot-toast"

export default function CheckoutPage() {
  const { cartItems, getTotalPrice, clearCart } = useCart()
  const { isSeniorMode } = useSeniorMode()
  const { user } = useAuth()
  const navigate = useNavigate()

  const [deliveryAddress, setDeliveryAddress] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    landmark: "",
  })

  const [paymentMethod, setPaymentMethod] = useState("cod")
  const [isProcessing, setIsProcessing] = useState(false)
  const [reminders, setReminders] = useState(
    cartItems.map((item) => ({
      medicineId: item.id,
      medicineName: item.medicine.name,
      frequency: "twice-daily",
      duration: 7,
      enabled: true,
    })),
  )

  const subtotal = getTotalPrice()
  const deliveryFee = subtotal >= 299 ? 0 : 50
  const total = subtotal + deliveryFee

  const handleAddressChange = (field: string, value: string) => {
    setDeliveryAddress((prev) => ({ ...prev, [field]: value }))
  }

  const handleReminderChange = (medicineId: number, field: string, value: any) => {
    setReminders((prev) =>
      prev.map((reminder) => (reminder.medicineId === medicineId ? { ...reminder, [field]: value } : reminder)),
    )
  }

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validation
    if (!deliveryAddress.name || !deliveryAddress.phone || !deliveryAddress.address || !deliveryAddress.pincode) {
      toast.error("Please fill in all required address fields")
      return
    }

    if (deliveryAddress.phone.length !== 10) {
      toast.error("Please enter a valid 10-digit phone number")
      return
    }

    if (deliveryAddress.pincode.length !== 6) {
      toast.error("Please enter a valid 6-digit pincode")
      return
    }

    setIsProcessing(true)

    try {
      // Simulate API call
      setTimeout(() => {
        const orderId = "WN" + Date.now()

        // Store order in localStorage for demo
        const orders = JSON.parse(localStorage.getItem("wellnest_orders") || "[]")
        const newOrder = {
          id: orderId,
          userId: user?.id,
          items: cartItems.map((item) => ({
            medicine: item.medicine,
            quantity: item.quantity,
            price: item.medicine.price,
          })),
          subtotal,
          deliveryFee,
          total,
          deliveryAddress,
          paymentMethod,
          status: "placed",
          estimatedDelivery: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
          placedAt: new Date().toISOString(),
          reminders: reminders.filter((r) => r.enabled),
        }

        orders.push(newOrder)
        localStorage.setItem("wellnest_orders", JSON.stringify(orders))

        // Set up medicine reminders
        const activeReminders = reminders.filter((r) => r.enabled)
        if (activeReminders.length > 0) {
          localStorage.setItem("wellnest_reminders", JSON.stringify(activeReminders))
        }

        clearCart()
        toast.success("Order placed successfully!")

        navigate("/thank-you", {
          state: {
            type: "order",
            orderId,
            total,
            estimatedDelivery: newOrder.estimatedDelivery,
            reminders: activeReminders,
          },
        })

        setIsProcessing(false)
      }, 2000)
    } catch (error) {
      toast.error("Failed to place order. Please try again.")
      setIsProcessing(false)
    }
  }

  if (cartItems.length === 0) {
    navigate("/cart")
    return null
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className={`font-bold text-gray-900 ${isSeniorMode ? "text-3xl" : "text-2xl"}`}>Checkout</h1>
          <p className={`text-gray-600 ${isSeniorMode ? "text-lg" : "text-base"}`}>
            Review your order and complete your purchase
          </p>
        </div>

        <form onSubmit={handlePlaceOrder}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Delivery Address */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center space-x-2 mb-4">
                  <MapPin className={`text-green-600 ${isSeniorMode ? "h-6 w-6" : "h-5 w-5"}`} />
                  <h2 className={`font-semibold ${isSeniorMode ? "text-2xl" : "text-xl"}`}>Delivery Address</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className={`block text-gray-700 font-medium mb-2 ${isSeniorMode ? "text-lg" : "text-sm"}`}>
                      Full Name *
                    </label>
                    <input
                      type="text"
                      value={deliveryAddress.name}
                      onChange={(e) => handleAddressChange("name", e.target.value)}
                      required
                      className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
                        isSeniorMode ? "py-4 text-lg" : ""
                      }`}
                    />
                  </div>

                  <div>
                    <label className={`block text-gray-700 font-medium mb-2 ${isSeniorMode ? "text-lg" : "text-sm"}`}>
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      value={deliveryAddress.phone}
                      onChange={(e) => handleAddressChange("phone", e.target.value.replace(/\D/g, "").slice(0, 10))}
                      required
                      className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
                        isSeniorMode ? "py-4 text-lg" : ""
                      }`}
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className={`block text-gray-700 font-medium mb-2 ${isSeniorMode ? "text-lg" : "text-sm"}`}>
                      Complete Address *
                    </label>
                    <textarea
                      value={deliveryAddress.address}
                      onChange={(e) => handleAddressChange("address", e.target.value)}
                      required
                      rows={3}
                      className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 resize-none ${
                        isSeniorMode ? "text-lg" : ""
                      }`}
                    />
                  </div>

                  <div>
                    <label className={`block text-gray-700 font-medium mb-2 ${isSeniorMode ? "text-lg" : "text-sm"}`}>
                      City *
                    </label>
                    <input
                      type="text"
                      value={deliveryAddress.city}
                      onChange={(e) => handleAddressChange("city", e.target.value)}
                      required
                      className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
                        isSeniorMode ? "py-4 text-lg" : ""
                      }`}
                    />
                  </div>

                  <div>
                    <label className={`block text-gray-700 font-medium mb-2 ${isSeniorMode ? "text-lg" : "text-sm"}`}>
                      State *
                    </label>
                    <input
                      type="text"
                      value={deliveryAddress.state}
                      onChange={(e) => handleAddressChange("state", e.target.value)}
                      required
                      className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
                        isSeniorMode ? "py-4 text-lg" : ""
                      }`}
                    />
                  </div>

                  <div>
                    <label className={`block text-gray-700 font-medium mb-2 ${isSeniorMode ? "text-lg" : "text-sm"}`}>
                      Pincode *
                    </label>
                    <input
                      type="text"
                      value={deliveryAddress.pincode}
                      onChange={(e) => handleAddressChange("pincode", e.target.value.replace(/\D/g, "").slice(0, 6))}
                      required
                      className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
                        isSeniorMode ? "py-4 text-lg" : ""
                      }`}
                    />
                  </div>

                  <div>
                    <label className={`block text-gray-700 font-medium mb-2 ${isSeniorMode ? "text-lg" : "text-sm"}`}>
                      Landmark (Optional)
                    </label>
                    <input
                      type="text"
                      value={deliveryAddress.landmark}
                      onChange={(e) => handleAddressChange("landmark", e.target.value)}
                      className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
                        isSeniorMode ? "py-4 text-lg" : ""
                      }`}
                    />
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center space-x-2 mb-4">
                  <CreditCard className={`text-green-600 ${isSeniorMode ? "h-6 w-6" : "h-5 w-5"}`} />
                  <h2 className={`font-semibold ${isSeniorMode ? "text-2xl" : "text-xl"}`}>Payment Method</h2>
                </div>

                <div className="space-y-3">
                  {[
                    { id: "cod", label: "Cash on Delivery", icon: Truck, desc: "Pay when you receive your order" },
                    { id: "upi", label: "UPI Payment", icon: Smartphone, desc: "Pay using UPI apps" },
                    { id: "card", label: "Credit/Debit Card", icon: CreditCard, desc: "Secure card payment" },
                    { id: "netbanking", label: "Net Banking", icon: Building, desc: "Pay using your bank account" },
                  ].map((method) => {
                    const IconComponent = method.icon
                    return (
                      <label
                        key={method.id}
                        className={`flex items-center space-x-3 p-4 border rounded-lg cursor-pointer hover:bg-gray-50 ${
                          paymentMethod === method.id ? "border-green-500 bg-green-50" : "border-gray-300"
                        }`}
                      >
                        <input
                          type="radio"
                          name="paymentMethod"
                          value={method.id}
                          checked={paymentMethod === method.id}
                          onChange={(e) => setPaymentMethod(e.target.value)}
                          className="text-green-600"
                        />
                        <IconComponent className={`text-gray-600 ${isSeniorMode ? "h-6 w-6" : "h-5 w-5"}`} />
                        <div>
                          <p className={`font-medium ${isSeniorMode ? "text-lg" : "text-base"}`}>{method.label}</p>
                          <p className={`text-gray-500 ${isSeniorMode ? "text-base" : "text-sm"}`}>{method.desc}</p>
                        </div>
                      </label>
                    )
                  })}
                </div>
              </div>

              {/* Medicine Reminders */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center space-x-2 mb-4">
                  <Clock className={`text-green-600 ${isSeniorMode ? "h-6 w-6" : "h-5 w-5"}`} />
                  <h2 className={`font-semibold ${isSeniorMode ? "text-2xl" : "text-xl"}`}>Medicine Reminders</h2>
                </div>

                <p className={`text-gray-600 mb-4 ${isSeniorMode ? "text-lg" : "text-sm"}`}>
                  Set up reminders to take your medicines on time
                </p>

                <div className="space-y-4">
                  {reminders.map((reminder) => (
                    <div key={reminder.medicineId} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className={`font-medium ${isSeniorMode ? "text-lg" : "text-base"}`}>
                          {reminder.medicineName}
                        </h3>
                        <label className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={reminder.enabled}
                            onChange={(e) => handleReminderChange(reminder.medicineId, "enabled", e.target.checked)}
                            className="text-green-600"
                          />
                          <span className={`${isSeniorMode ? "text-base" : "text-sm"}`}>Enable Reminder</span>
                        </label>
                      </div>

                      {reminder.enabled && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label
                              className={`block text-gray-700 font-medium mb-2 ${
                                isSeniorMode ? "text-base" : "text-sm"
                              }`}
                            >
                              Frequency
                            </label>
                            <select
                              value={reminder.frequency}
                              onChange={(e) => handleReminderChange(reminder.medicineId, "frequency", e.target.value)}
                              className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
                                isSeniorMode ? "py-3 text-lg" : ""
                              }`}
                            >
                              <option value="once-daily">Once Daily</option>
                              <option value="twice-daily">Twice Daily</option>
                              <option value="thrice-daily">Thrice Daily</option>
                              <option value="four-times-daily">Four Times Daily</option>
                            </select>
                          </div>

                          <div>
                            <label
                              className={`block text-gray-700 font-medium mb-2 ${
                                isSeniorMode ? "text-base" : "text-sm"
                              }`}
                            >
                              Duration (Days)
                            </label>
                            <input
                              type="number"
                              value={reminder.duration}
                              onChange={(e) =>
                                handleReminderChange(reminder.medicineId, "duration", Number(e.target.value))
                              }
                              min="1"
                              max="30"
                              className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
                                isSeniorMode ? "py-3 text-lg" : ""
                              }`}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
                <h2 className={`font-semibold mb-4 ${isSeniorMode ? "text-2xl" : "text-xl"}`}>Order Summary</h2>

                {/* Items */}
                <div className="space-y-3 mb-4">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex items-center space-x-3">
                      <img
                        src={item.medicine.image || "/placeholder.svg"}
                        alt={item.medicine.name}
                        className="w-12 h-12 object-cover rounded"
                      />
                      <div className="flex-1">
                        <p className={`font-medium ${isSeniorMode ? "text-base" : "text-sm"}`}>{item.medicine.name}</p>
                        <p className={`text-gray-500 ${isSeniorMode ? "text-sm" : "text-xs"}`}>Qty: {item.quantity}</p>
                      </div>
                      <p className={`font-medium ${isSeniorMode ? "text-base" : "text-sm"}`}>
                        ₹{item.medicine.price * item.quantity}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Totals */}
                <div className="border-t pt-4 space-y-3">
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

                  <div className="flex justify-between border-t pt-3">
                    <span className={`font-semibold ${isSeniorMode ? "text-xl" : "text-lg"}`}>Total</span>
                    <span className={`font-bold text-green-600 ${isSeniorMode ? "text-2xl" : "text-xl"}`}>
                      ₹{total}
                    </span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isProcessing}
                  className={`w-full bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed font-medium mt-6 ${
                    isSeniorMode ? "py-4 text-lg" : ""
                  }`}
                >
                  {isProcessing ? "Processing..." : `Place Order - ₹${total}`}
                </button>

                <p className={`text-gray-500 text-center mt-3 ${isSeniorMode ? "text-base" : "text-xs"}`}>
                  By placing this order, you agree to our Terms & Conditions
                </p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
