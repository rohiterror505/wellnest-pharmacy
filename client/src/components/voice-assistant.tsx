"use client"

import { useState, useRef } from "react"
import { Mic, MicOff, Volume2 } from "lucide-react"
import { Button } from "./button"
import { Card, CardContent } from "./card"
import { useSeniorMode } from "./senior-mode-provider"

export function VoiceAssistant() {
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState("")
  const [isVisible, setIsVisible] = useState(false)
  const recognitionRef = useRef<any>(null)
  const { isSeniorMode } = useSeniorMode()

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
      alert("Speech recognition not supported in this browser")
    }
  }

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop()
    }
    setIsListening(false)
  }

  const handleVoiceCommand = (command: string) => {
    // Simple voice command processing
    const lowerCommand = command.toLowerCase()

    if (lowerCommand.includes("paracetamol") || lowerCommand.includes("fever")) {
      speak("I found Paracetamol 500mg for you. Adding to search results.")
    } else if (lowerCommand.includes("vitamin") || lowerCommand.includes("supplement")) {
      speak("Showing vitamin and supplement options.")
    } else if (lowerCommand.includes("prescription") || lowerCommand.includes("upload")) {
      speak("Opening prescription upload page.")
    } else {
      speak(`I heard: ${command}. Let me search for that.`)
    }

    setTimeout(() => {
      setIsVisible(false)
      setTranscript("")
    }, 3000)
  }

  const speak = (text: string) => {
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.rate = 0.8
      utterance.pitch = 1
      speechSynthesis.speak(utterance)
    }
  }

  return (
    <>
      {/* Voice Assistant Card */}
      {isVisible && (
        <Card className="fixed bottom-24 right-4 w-80 z-50 shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Volume2 className="h-5 w-5 text-blue-500" />
              <span className={`font-semibold ${isSeniorMode ? "text-lg" : "text-sm"}`}>Voice Assistant</span>
            </div>

            {isListening ? (
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                  <span className={`text-red-500 ${isSeniorMode ? "text-base" : "text-sm"}`}>Listening...</span>
                </div>
                {transcript && (
                  <p className={`text-muted-foreground italic ${isSeniorMode ? "text-base" : "text-sm"}`}>
                    "{transcript}"
                  </p>
                )}
              </div>
            ) : (
              <p className={`text-muted-foreground ${isSeniorMode ? "text-base" : "text-sm"}`}>
                {transcript ? `You said: "${transcript}"` : "Tap the mic to speak"}
              </p>
            )}
          </CardContent>
        </Card>
      )}

      {/* Floating Mic Button */}
      <Button
        size={isSeniorMode ? "lg" : "default"}
        className={`fixed bottom-4 right-4 rounded-full shadow-lg z-50 ${
          isListening ? "bg-red-500 hover:bg-red-600" : "bg-blue-500 hover:bg-blue-600"
        } ${isSeniorMode ? "w-16 h-16" : "w-12 h-12"}`}
        onClick={isListening ? stopListening : startListening}
      >
        {isListening ? (
          <MicOff className={`${isSeniorMode ? "h-8 w-8" : "h-6 w-6"}`} />
        ) : (
          <Mic className={`${isSeniorMode ? "h-8 w-8" : "h-6 w-6"}`} />
        )}
      </Button>
    </>
  )
}
