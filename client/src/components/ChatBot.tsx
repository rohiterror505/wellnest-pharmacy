"use client"

import { useState } from "react"
import { MessageCircle, X, Send } from "lucide-react"
import { Button } from "./button"
import { Card, CardContent, CardHeader, CardTitle } from "./card"
import { Input } from "./input"
import { ScrollArea } from "./scroll-area"
import { useSeniorMode } from "./senior-mode-provider"

interface Message {
  id: number
  text: string
  isBot: boolean
  timestamp: Date
}

const quickQuestions = [
  "What is Paracetamol used for?",
  "Side effects of Aspirin?",
  "Alternative to Combiflam?",
  "How to upload prescription?",
]

export function ChatBot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Hello! I'm your medical assistant. How can I help you today?",
      isBot: true,
      timestamp: new Date(),
    },
  ])
  const [inputMessage, setInputMessage] = useState("")
  const { isSeniorMode } = useSeniorMode()

  const sendMessage = (text: string) => {
    if (!text.trim()) return

    // Add user message
    const userMessage: Message = {
      id: Date.now(),
      text: text,
      isBot: false,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputMessage("")

    // Simulate bot response
    setTimeout(() => {
      const botResponse = generateBotResponse(text)
      const botMessage: Message = {
        id: Date.now() + 1,
        text: botResponse,
        isBot: true,
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, botMessage])
    }, 1000)
  }

  const generateBotResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase()

    if (lowerMessage.includes("paracetamol")) {
      return "Paracetamol is used to treat pain and reduce fever. It's safe for most people when taken as directed. Common brand names include Crocin and Dolo."
    } else if (lowerMessage.includes("aspirin")) {
      return "Aspirin can cause stomach irritation, bleeding, and allergic reactions in some people. Always take with food and consult your doctor if you have stomach problems."
    } else if (lowerMessage.includes("combiflam")) {
      return "Alternatives to Combiflam include Paracetamol + Ibuprofen combinations like Brufen Plus, or you can take Paracetamol and Ibuprofen separately."
    } else if (lowerMessage.includes("prescription") || lowerMessage.includes("upload")) {
      return "To upload your prescription: 1) Click the 'Upload Prescription' button, 2) Take a clear photo or select from gallery, 3) Add it to your cart. We'll verify and process your order!"
    } else if (lowerMessage.includes("delivery")) {
      return "We offer free home delivery on orders above ₹299. Standard delivery takes 1-2 days, and express delivery is available in select cities."
    } else {
      return "I understand you're asking about medical information. For specific medical advice, please consult with our doctors through the consultation feature or contact your healthcare provider."
    }
  }

  return (
    <>
      {/* Chat Window */}
      {isOpen && (
        <Card className="fixed bottom-20 right-4 w-80 h-96 z-50 shadow-lg flex flex-col">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className={`${isSeniorMode ? "text-lg" : "text-sm"}`}>Medical Assistant</CardTitle>
              <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>

          <CardContent className="flex-1 flex flex-col p-4 pt-0">
            <ScrollArea className="flex-1 mb-4">
              <div className="space-y-3">
                {messages.map((message) => (
                  <div key={message.id} className={`flex ${message.isBot ? "justify-start" : "justify-end"}`}>
                    <div
                      className={`max-w-[80%] p-2 rounded-lg ${
                        message.isBot ? "bg-muted text-foreground" : "bg-primary text-primary-foreground"
                      } ${isSeniorMode ? "text-base p-3" : "text-sm"}`}
                    >
                      {message.text}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            {/* Quick Questions */}
            <div className="mb-3">
              <div className="flex flex-wrap gap-1">
                {quickQuestions.map((question, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    className={`text-xs ${isSeniorMode ? "text-sm p-2" : ""}`}
                    onClick={() => sendMessage(question)}
                  >
                    {question}
                  </Button>
                ))}
              </div>
            </div>

            {/* Input */}
            <div className="flex space-x-2">
              <Input
                placeholder="Ask me anything..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && sendMessage(inputMessage)}
                className={isSeniorMode ? "text-base" : ""}
              />
              <Button size="sm" onClick={() => sendMessage(inputMessage)} disabled={!inputMessage.trim()}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Floating Chat Button */}
      <Button
        size={isSeniorMode ? "lg" : "default"}
        className={`fixed bottom-4 left-4 rounded-full shadow-lg z-50 bg-green-500 hover:bg-green-600 ${
          isSeniorMode ? "w-16 h-16" : "w-12 h-12"
        }`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <MessageCircle className={`${isSeniorMode ? "h-8 w-8" : "h-6 w-6"}`} />
      </Button>
    </>
  )
} 