"use client"

import { useState, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { Mic, MicOff, Volume2, X } from "lucide-react"
import { useSeniorMode } from "../contexts/SeniorModeContext"
import toast from "react-hot-toast"

export default function VoiceAssistant() {
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState("")
  const [isVisible, setIsVisible] = useState(false)
  const recognitionRef = useRef<any>(null)
  const { isSeniorMode } = useSeniorMode()
  const navigate = useNavigate()

  const startListening = () => {
    if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition
      recognitionRef.current = new SpeechRecognition()

      recognitionRef.current.continuous = false
      recognitionRef.current.interimResults = true
      recognitionRef.current.lang = "en-IN"

      recognitionRef.current.onstart = () => {
        setIsListening(true)
        setIsVisible(true)
      }

      recognitionRef.current.onresult = (event: any) => {
        const current = event.resultIndex
        const transcript = event.results[current][0].transcript
        setTranscript(transcript)
      }

      recognitionRef.current.onend = () => {
        setIsListening(false)
        if (transcript) {
          handleVoiceCommand(transcript)
        }
      }

      recognitionRef.current.start()
    } else {
      toast.error("Speech recognition not supported in this browser")
    }
  }

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop()
    }
    setIsListening(false)
  }

  const handleVoiceCommand = (command: string) => {
    const lowerCommand = command.toLowerCase()

    if (lowerCommand.includes("order") && (lowerCommand.includes("paracetamol") || lowerCommand.includes("medicine"))) {
      speak("Searching for medicines. Redirecting to search page.")
      navigate(`/search?q=${encodeURIComponent(command)}`)
    } else if (lowerCommand.includes("upload") && lowerCommand.includes("prescription")) {
      speak("Opening prescription upload page.")
      navigate("/upload-prescription")
    } else if (lowerCommand.includes("book") && (lowerCommand.includes("lab") || lowerCommand.includes("test"))) {
      speak("Opening lab test booking page.")
      navigate("/lab-tests")
    } else if (lowerCommand.includes("consult") && lowerCommand.includes("doctor")) {
      speak("Opening doctor consultation page.")
      navigate("/consult-doctor")
    } else if (lowerCommand.includes("cart") || lowerCommand.includes("basket")) {
      speak("Opening your cart.")
      navigate("/cart")
    } else if (lowerCommand.includes("search")) {
      const searchTerm = command.replace(/search/gi, "").trim()
      speak(`Searching for ${searchTerm}`)
      navigate(`/search?q=${encodeURIComponent(searchTerm)}`)
    } else {
      speak(`I heard: ${command}. Let me search for that.`)
      navigate(`/search?q=${encodeURIComponent(command)}`)
    }

    setTimeout(() => {
      setIsVisible(false)
      setTranscript("")
    }, 2000)
  }

  const speak = (text: string) => {
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.rate = 0.8
      utterance.pitch = 1
      speechSynthesis.speak(utterance)
    }
  }

  const closeAssistant = () => {
    setIsVisible(false)
    setTranscript("")
    if (isListening) {
      stopListening()
    }
  }

  return (
    <>
      {/* Voice Assistant Card */}
      {isVisible && (
        <div className="fixed bottom-24 right-4 w-80 bg-white rounded-lg shadow-lg border z-50">
          <div className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <Volume2 className="h-5 w-5 text-blue-500" />
                <span className={`font-semibold ${isSeniorMode ? "text-lg" : "text-sm"}`}>Voice Assistant</span>
              </div>
              <button onClick={closeAssistant} className="p-1 hover:bg-gray-100 rounded">
                <X className="h-4 w-4" />
              </button>
            </div>

            {isListening ? (
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                  <span className={`text-red-500 ${isSeniorMode ? "text-base" : "text-sm"}`}>Listening...</span>
                </div>
                {transcript && (
                  <p className={`text-gray-600 italic ${isSeniorMode ? "text-base" : "text-sm"}`}>"{transcript}"</p>
                )}
              </div>
            ) : (
              <p className={`text-gray-600 ${isSeniorMode ? "text-base" : "text-sm"}`}>
                {transcript ? `You said: "${transcript}"` : "Tap the mic to speak"}
              </p>
            )}

            <div className="mt-3 text-xs text-gray-500">
              Try: "Order Paracetamol", "Upload prescription", "Book lab test"
            </div>
          </div>
        </div>
      )}

      {/* Floating Mic Button */}
      <button
        onClick={isListening ? stopListening : startListening}
        className={`fixed bottom-4 right-4 rounded-full shadow-lg z-50 transition-all duration-200 ${
          isListening ? "bg-red-500 hover:bg-red-600" : "bg-blue-500 hover:bg-blue-600"
        } ${isSeniorMode ? "w-16 h-16" : "w-12 h-12"} text-white`}
      >
        {isListening ? (
          <MicOff className={`${isSeniorMode ? "h-8 w-8" : "h-6 w-6"} mx-auto`} />
        ) : (
          <Mic className={`${isSeniorMode ? "h-8 w-8" : "h-6 w-6"} mx-auto`} />
        )}
      </button>
    </>
  )
}
