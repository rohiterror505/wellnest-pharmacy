"use client"

import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Phone, Mail, ArrowLeft } from "lucide-react"
import { useAuth } from "../core/AuthContext"
import { useSeniorMode } from "../components/senior-mode-provider"
import OTPInput from "../components/OTPInput"
import toast from "react-hot-toast"

export default function LoginPage() {
  const [loginMethod, setLoginMethod] = useState("phone") // 'phone' or 'email'
  const [step, setStep] = useState(1) // 1: input, 2: otp
  const [phoneNumber, setPhoneNumber] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [otp, setOtp] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const { login } = useAuth()
  const { isSeniorMode } = useSeniorMode()
  const navigate = useNavigate()

  const handleSendOTP = async () => {
    if (loginMethod === "phone" && phoneNumber.length !== 10) {
      toast.error("Please enter a valid 10-digit phone number")
      return
    }

    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      setStep(2)
      toast.success(`OTP sent to ${loginMethod === "phone" ? phoneNumber : email}`)
    }, 1500)
  }

  const handleVerifyOTP = async () => {
    if (otp.length !== 6) {
      toast.error("Please enter a valid 6-digit OTP")
      return
    }

    setIsLoading(true)

    // Simulate OTP verification
    setTimeout(() => {
      if (otp === "123456") {
        const userData = {
          id: "1",
          name: loginMethod === "phone" ? `User ${phoneNumber}` : email.split("@")[0],
          phone: loginMethod === "phone" ? phoneNumber : "",
          email: loginMethod === "email" ? email : "",
        }

        login(userData)
        localStorage.setItem("wellnest_token", "dummy_jwt_token_" + Date.now())
        toast.success("Login successful!")
        navigate("/")
      } else {
        toast.error("Invalid OTP. Please try 123456")
      }
      setIsLoading(false)
    }, 1500)
  }

  const handleEmailLogin = async () => {
    if (!email || !password) {
      toast.error("Please fill in all fields")
      return
    }

    setIsLoading(true)

    // Simulate email login
    setTimeout(() => {
      const userData = {
        id: "1",
        name: email.split("@")[0],
        email: email,
        phone: "",
      }

      login(userData)
      localStorage.setItem("wellnest_token", "dummy_jwt_token_" + Date.now())
      toast.success("Login successful!")
      navigate("/")
      setIsLoading(false)
    }, 1500)
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <Link to="/" className="inline-flex items-center text-green-600 hover:text-green-700 mb-4">
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Home
          </Link>

          <h2 className={`font-bold text-gray-900 ${isSeniorMode ? "text-4xl" : "text-3xl"}`}>Welcome Back</h2>
          <p className={`mt-2 text-gray-600 ${isSeniorMode ? "text-lg" : "text-sm"}`}>
            Sign in to your Wellnest account
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8">
          {step === 1 ? (
            <>
              {/* Login Method Toggle */}
              <div className="flex rounded-lg bg-gray-100 p-1 mb-6">
                <button
                  onClick={() => setLoginMethod("phone")}
                  className={`flex-1 flex items-center justify-center py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                    loginMethod === "phone" ? "bg-white text-green-600 shadow-sm" : "text-gray-500 hover:text-gray-700"
                  } ${isSeniorMode ? "py-3 text-base" : ""}`}
                >
                  <Phone className={`mr-2 ${isSeniorMode ? "h-5 w-5" : "h-4 w-4"}`} />
                  Phone
                </button>
                <button
                  onClick={() => setLoginMethod("email")}
                  className={`flex-1 flex items-center justify-center py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                    loginMethod === "email" ? "bg-white text-green-600 shadow-sm" : "text-gray-500 hover:text-gray-700"
                  } ${isSeniorMode ? "py-3 text-base" : ""}`}
                >
                  <Mail className={`mr-2 ${isSeniorMode ? "h-5 w-5" : "h-4 w-4"}`} />
                  Email
                </button>
              </div>

              {loginMethod === "phone" ? (
                <div className="space-y-4">
                  <div>
                    <label className={`block text-gray-700 font-medium mb-2 ${isSeniorMode ? "text-lg" : "text-sm"}`}>
                      Phone Number
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">+91</span>
                      <input
                        type="tel"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, "").slice(0, 10))}
                        placeholder="Enter 10-digit phone number"
                        className={`w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                          isSeniorMode ? "py-4 text-lg" : ""
                        }`}
                      />
                    </div>
                  </div>

                  <button
                    onClick={handleSendOTP}
                    disabled={isLoading || phoneNumber.length !== 10}
                    className={`w-full bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed font-medium ${
                      isSeniorMode ? "py-4 text-lg" : ""
                    }`}
                  >
                    {isLoading ? "Sending OTP..." : "Send OTP"}
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className={`block text-gray-700 font-medium mb-2 ${isSeniorMode ? "text-lg" : "text-sm"}`}>
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                        isSeniorMode ? "py-4 text-lg" : ""
                      }`}
                    />
                  </div>

                  <div>
                    <label className={`block text-gray-700 font-medium mb-2 ${isSeniorMode ? "text-lg" : "text-sm"}`}>
                      Password
                    </label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                        isSeniorMode ? "py-4 text-lg" : ""
                      }`}
                    />
                  </div>

                  <button
                    onClick={handleEmailLogin}
                    disabled={isLoading}
                    className={`w-full bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed font-medium ${
                      isSeniorMode ? "py-4 text-lg" : ""
                    }`}
                  >
                    {isLoading ? "Signing In..." : "Sign In"}
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="space-y-6">
              <div className="text-center">
                <h3 className={`font-semibold text-gray-900 ${isSeniorMode ? "text-2xl" : "text-lg"}`}>Enter OTP</h3>
                <p className={`mt-2 text-gray-600 ${isSeniorMode ? "text-lg" : "text-sm"}`}>
                  We've sent a 6-digit code to {loginMethod === "phone" ? `+91 ${phoneNumber}` : email}
                </p>
              </div>

              <OTPInput length={6} onComplete={setOtp} isSeniorMode={isSeniorMode} />

              <button
                onClick={handleVerifyOTP}
                disabled={isLoading || otp.length !== 6}
                className={`w-full bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed font-medium ${
                  isSeniorMode ? "py-4 text-lg" : ""
                }`}
              >
                {isLoading ? "Verifying..." : "Verify OTP"}
              </button>

              <div className="text-center">
                <button
                  onClick={() => setStep(1)}
                  className={`text-green-600 hover:text-green-700 ${isSeniorMode ? "text-lg" : "text-sm"}`}
                >
                  Change phone number
                </button>
              </div>

              <div className="text-center">
                <p className={`text-gray-600 ${isSeniorMode ? "text-base" : "text-sm"}`}>
                  Didn't receive the code?{" "}
                  <button onClick={handleSendOTP} className="text-green-600 hover:text-green-700 font-medium">
                    Resend OTP
                  </button>
                </p>
              </div>
            </div>
          )}

          <div className="mt-6 text-center">
            <p className={`text-gray-600 ${isSeniorMode ? "text-lg" : "text-sm"}`}>
              Don't have an account?{" "}
              <Link to="/signup" className="text-green-600 hover:text-green-700 font-medium">
                Sign up
              </Link>
            </p>
          </div>
        </div>

        {/* Demo Instructions */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className={`text-blue-800 ${isSeniorMode ? "text-lg" : "text-sm"}`}>
            <strong>Demo Instructions:</strong> Use OTP <strong>123456</strong> for phone login, or any email/password
            for email login.
          </p>
        </div>
      </div>
    </div>
  )
}
