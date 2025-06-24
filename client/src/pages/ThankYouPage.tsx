"use client"

import { useEffect, useState } from "react"
import { Link, useLocation } from "react-router-dom"
import { CheckCircle, Package, Bell, Home, FileText } from "lucide-react"
import { useSeniorMode } from "../contexts/SeniorModeContext"

export default function ThankYouPage() {
  const location = useLocation()
  const { isSeniorMode } = useSeniorMode()
  const [showConfetti, setShowConfetti] = useState(true)

  const { type, orderId, prescriptionId, total, estimatedDelivery, reminders, message } = location.state || {}

  useEffect(() => {
    // Hide confetti after 3 seconds
    const timer = setTimeout(() => setShowConfetti(false), 3000)
    return () => clearTimeout(timer)
  }, [])

  // Set up reminder notifications (demo)
  useEffect(() => {
    if (reminders && reminders.length > 0) {
      // In a real app, this would set up actual push notifications
      console.log("Setting up medicine reminders:", reminders)
    }
  }, [reminders])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="text-center space-y-8">
        {/* Confetti Effect */}
        {showConfetti && (
          <div className="fixed inset-0 pointer-events-none z-50">
            <div className="absolute inset-0 bg-gradient-to-b from-green-100/20 to-transparent animate-pulse"></div>
          </div>
        )}

        {/* Success Icon */}
        <div className="flex justify-center">
          <div className="bg-green-100 rounded-full p-6">
            <CheckCircle className={`text-green-600 ${isSeniorMode ? "h-24 w-24" : "h-16 w-16"}`} />
          </div>
        </div>

        {/* Main Message */}
        <div className="space-y-4">
          <h1 className={`font-bold text-gray-900 ${isSeniorMode ? "text-4xl" : "text-3xl"}`}>
            {type === "prescription" ? "Prescription Uploaded!" : "Order Placed Successfully!"}
          </h1>

          <p className={`text-gray-600 max-w-2xl mx-auto ${isSeniorMode ? "text-xl" : "text-lg"}`}>
            {message || "Thank you for choosing Wellnest. Your order has been confirmed and will be processed shortly."}
          </p>
        </div>

        {/* Order/Prescription Details */}
        <div className="bg-white rounded-lg shadow-md p-8 text-left max-w-2xl mx-auto">
          <div className="space-y-6">
            {/* Order ID */}
            <div className="flex items-center justify-between border-b pb-4">
              <div>
                <p className={`text-gray-600 ${isSeniorMode ? "text-lg" : "text-sm"}`}>
                  {type === "prescription" ? "Prescription ID" : "Order ID"}
                </p>
                <p className={`font-bold ${isSeniorMode ? "text-2xl" : "text-xl"}`}>{prescriptionId || orderId}</p>
              </div>
              {type === "order" && total && (
                <div className="text-right">
                  <p className={`text-gray-600 ${isSeniorMode ? "text-lg" : "text-sm"}`}>Total Amount</p>
                  <p className={`font-bold text-green-600 ${isSeniorMode ? "text-2xl" : "text-xl"}`}>₹{total}</p>
                </div>
              )}
            </div>

            {/* Delivery Information */}
            {type === "order" && estimatedDelivery && (
              <div className="flex items-start space-x-4">
                <Package className={`text-blue-600 mt-1 ${isSeniorMode ? "h-6 w-6" : "h-5 w-5"}`} />
                <div>
                  <h3 className={`font-semibold ${isSeniorMode ? "text-xl" : "text-lg"}`}>Estimated Delivery</h3>
                  <p className={`text-gray-600 ${isSeniorMode ? "text-lg" : "text-base"}`}>
                    {formatDate(estimatedDelivery)}
                  </p>
                  <p className={`text-gray-500 ${isSeniorMode ? "text-base" : "text-sm"}`}>
                    We'll send you tracking details via SMS and email
                  </p>
                </div>
              </div>
            )}

            {/* Prescription Processing */}
            {type === "prescription" && (
              <div className="flex items-start space-x-4">
                <FileText className={`text-purple-600 mt-1 ${isSeniorMode ? "h-6 w-6" : "h-5 w-5"}`} />
                <div>
                  <h3 className={`font-semibold ${isSeniorMode ? "text-xl" : "text-lg"}`}>Next Steps</h3>
                  <p className={`text-gray-600 ${isSeniorMode ? "text-lg" : "text-base"}`}>
                    Our licensed pharmacist will verify your prescription within 2 hours
                  </p>
                  <p className={`text-gray-500 ${isSeniorMode ? "text-base" : "text-sm"}`}>
                    You'll receive a call to confirm your order and delivery details
                  </p>
                </div>
              </div>
            )}

            {/* Medicine Reminders */}
            {reminders && reminders.length > 0 && (
              <div className="flex items-start space-x-4">
                <Bell className={`text-orange-600 mt-1 ${isSeniorMode ? "h-6 w-6" : "h-5 w-5"}`} />
                <div>
                  <h3 className={`font-semibold ${isSeniorMode ? "text-xl" : "text-lg"}`}>Medicine Reminders Set</h3>
                  <p className={`text-gray-600 ${isSeniorMode ? "text-lg" : "text-base"}`}>
                    We've set up reminders for {reminders.length} medicine(s)
                  </p>
                  <div className="mt-2 space-y-1">
                    {reminders.map((reminder: any, index: number) => (
                      <p key={index} className={`text-gray-500 ${isSeniorMode ? "text-base" : "text-sm"}`}>
                        • {reminder.medicineName} - {reminder.frequency.replace("-", " ")} for {reminder.duration} days
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* What's Next */}
            <div className="bg-blue-50 rounded-lg p-4">
              <h3 className={`font-semibold text-blue-900 mb-2 ${isSeniorMode ? "text-xl" : "text-lg"}`}>
                What happens next?
              </h3>
              <ul className={`text-blue-800 space-y-1 ${isSeniorMode ? "text-lg" : "text-sm"}`}>
                {type === "order" ? (
                  <>
                    <li>• Order confirmation SMS/email sent</li>
                    <li>• Medicines packed and quality checked</li>
                    <li>• Out for delivery notification</li>
                    <li>• Safe delivery to your doorstep</li>
                  </>
                ) : (
                  <>
                    <li>• Prescription reviewed by licensed pharmacist</li>
                    <li>• Verification call within 2 hours</li>
                    <li>• Order confirmation and payment</li>
                    <li>• Medicine delivery as per schedule</li>
                  </>
                )}
              </ul>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/"
            className={`bg-green-500 text-white px-8 py-3 rounded-lg hover:bg-green-600 font-medium inline-flex items-center justify-center space-x-2 ${
              isSeniorMode ? "px-12 py-4 text-lg" : ""
            }`}
          >
            <Home className={`${isSeniorMode ? "h-6 w-6" : "h-5 w-5"}`} />
            <span>Continue Shopping</span>
          </Link>

          {type === "order" && (
            <Link
              to="/orders"
              className={`border border-green-500 text-green-600 px-8 py-3 rounded-lg hover:bg-green-50 font-medium inline-flex items-center justify-center space-x-2 ${
                isSeniorMode ? "px-12 py-4 text-lg" : ""
              }`}
            >
              <Package className={`${isSeniorMode ? "h-6 w-6" : "h-5 w-5"}`} />
              <span>Track Order</span>
            </Link>
          )}
        </div>

        {/* Support Information */}
        <div className="bg-gray-50 rounded-lg p-6 max-w-2xl mx-auto">
          <h3 className={`font-semibold text-gray-900 mb-3 ${isSeniorMode ? "text-xl" : "text-lg"}`}>Need Help?</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
            <div>
              <p className={`font-medium text-gray-700 ${isSeniorMode ? "text-lg" : "text-base"}`}>Call Us</p>
              <p className={`text-green-600 ${isSeniorMode ? "text-lg" : "text-base"}`}>+91 98765 43210</p>
              <p className={`text-gray-500 ${isSeniorMode ? "text-base" : "text-sm"}`}>24/7 Customer Support</p>
            </div>
            <div>
              <p className={`font-medium text-gray-700 ${isSeniorMode ? "text-lg" : "text-base"}`}>Email Us</p>
              <p className={`text-green-600 ${isSeniorMode ? "text-lg" : "text-base"}`}>support@wellnest.com</p>
              <p className={`text-gray-500 ${isSeniorMode ? "text-base" : "text-sm"}`}>We reply within 2 hours</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
