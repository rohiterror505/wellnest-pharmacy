"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"

interface OTPInputProps {
  length: number
  onComplete: (otp: string) => void
  isSeniorMode?: boolean
}

export default function OTPInput({ length, onComplete, isSeniorMode = false }: OTPInputProps) {
  const [otp, setOtp] = useState(new Array(length).fill(""))
  const inputRefs = useRef<Array<HTMLInputElement | null>>([])

  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus()
    }
  }, [])

  const handleChange = (element: HTMLInputElement, index: number) => {
    if (isNaN(Number(element.value))) return false

    setOtp([...otp.map((d, idx) => (idx === index ? element.value : d))])

    // Focus next input
    if (element.nextSibling && element.value !== "") {
      ;(element.nextSibling as HTMLInputElement).focus()
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace") {
      if (otp[index] === "" && index > 0) {
        // Focus previous input if current is empty
        inputRefs.current[index - 1]?.focus()
      }
      setOtp([...otp.map((d, idx) => (idx === index ? "" : d))])
    }
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const pasteData = e.clipboardData.getData("text/plain").slice(0, length)
    const pasteArray = pasteData.split("").filter((char) => !isNaN(Number(char)))

    if (pasteArray.length === length) {
      setOtp(pasteArray)
      inputRefs.current[length - 1]?.focus()
    }
  }

  useEffect(() => {
    const otpString = otp.join("")
    if (otpString.length === length) {
      onComplete(otpString)
    }
  }, [otp, length, onComplete])

  return (
    <div className="flex justify-center space-x-3">
      {otp.map((data, index) => (
        <input
          key={index}
          type="text"
          maxLength={1}
          value={data}
          ref={(el) => { inputRefs.current[index] = el; }}
          onChange={(e) => handleChange(e.target, index)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          onPaste={handlePaste}
          className={`border border-gray-300 rounded-lg text-center font-bold focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent ${
            isSeniorMode ? "w-16 h-16 text-2xl" : "w-12 h-12 text-xl"
          }`}
        />
      ))}
    </div>
  )
}
