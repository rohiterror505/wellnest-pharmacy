"use client"

import type React from "react"

import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { ArrowLeft, Eye, EyeOff } from "lucide-react"
import { useAuth } from "../contexts/AuthContext"
import { useSeniorMode } from "../contexts/SeniorModeContext"
import toast from "react-hot-toast"

export default function SignupPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const { login } = useAuth()
  const { isSeniorMode } = useSeniorMode()
  const navigate = useNavigate()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords don't match")
      return
    }

    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters")
      return
    }

    if (formData.phone.length !== 10) {
      toast.error("Please enter a valid 10-digit phone number")
      return
    }

    setIsLoading(true)

    try {
      // Simulate API call
      setTimeout(() => {
        const userData = {
          id: "1",
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
        }

        login(userData)
        localStorage.setItem("wellnest_token", "dummy_jwt_token_" + Date.now())
        toast.success("Account created successfully!")
        navigate("/")
        setIsLoading(false)
      }, 1500)
    } catch (error) {
      toast.error("Registration failed. Please try again.")
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <Link to="/" className="inline-flex items-center text-green-600 hover:text-green-700 mb-4">
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Home
          </Link>

          <h2 className={`font-bold text-gray-900 ${isSeniorMode ? "text-4xl" : "text-3xl"}`}>Create Account</h2>
          <p className={`mt-2 text-gray-600 ${isSeniorMode ? "text-lg" : "text-sm"}`}>
            Join Wellnest for better healthcare
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className={`block text-gray-700 font-medium mb-2 ${isSeniorMode ? "text-lg" : "text-sm"}`}>
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Enter your full name"
                className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                  isSeniorMode ? "py-4 text-lg" : ""
                }`}
              />
            </div>

            <div>
              <label className={`block text-gray-700 font-medium mb-2 ${isSeniorMode ? "text-lg" : "text-sm"}`}>
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="Enter your email"
                className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                  isSeniorMode ? "py-4 text-lg" : ""
                }`}
              />
            </div>

            <div>
              <label className={`block text-gray-700 font-medium mb-2 ${isSeniorMode ? "text-lg" : "text-sm"}`}>
                Phone Number
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">+91</span>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      phone: e.target.value.replace(/\D/g, "").slice(0, 10),
                    }))
                  }
                  required
                  placeholder="Enter 10-digit phone number"
                  className={`w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                    isSeniorMode ? "py-4 text-lg" : ""
                  }`}
                />
              </div>
            </div>

            <div>
              <label className={`block text-gray-700 font-medium mb-2 ${isSeniorMode ? "text-lg" : "text-sm"}`}>
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  placeholder="Create a password (min 6 characters)"
                  className={`w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                    isSeniorMode ? "py-4 text-lg" : ""
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <div>
              <label className={`block text-gray-700 font-medium mb-2 ${isSeniorMode ? "text-lg" : "text-sm"}`}>
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  placeholder="Confirm your password"
                  className={`w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                    isSeniorMode ? "py-4 text-lg" : ""
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed font-medium ${
                isSeniorMode ? "py-4 text-lg" : ""
              }`}
            >
              {isLoading ? "Creating Account..." : "Create Account"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className={`text-gray-600 ${isSeniorMode ? "text-lg" : "text-sm"}`}>
              Already have an account?{" "}
              <Link to="/login" className="text-green-600 hover:text-green-700 font-medium">
                Sign in
              </Link>
            </p>
          </div>
        </div>

        {/* Terms */}
        <div className="text-center">
          <p className={`text-gray-500 ${isSeniorMode ? "text-base" : "text-xs"}`}>
            By creating an account, you agree to our{" "}
            <Link to="/terms" className="text-green-600 hover:text-green-700">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link to="/privacy" className="text-green-600 hover:text-green-700">
              Privacy Policy
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
