"use client"

import { useState } from "react"
import { MessageCircle, X, Send } from "lucide-react"
import { useSeniorMode } from "../contexts/SeniorModeContext"

interface Message {
  id: number
  text: string
  isBot: boolean
  timestamp: Date
}

const quickQuestions = [
  "What is Paracetamol used for?",
  "Side effects of Aspirin?",
  "How to upload prescription?",
  "Book lab test",
]

const botResponses = {
  paracetamol:
    "Paracetamol is used to treat pain and reduce fever. It's safe for most people when taken as directed. Common brand names include Crocin and Dolo. Take 1-2 tablets every 4-6 hours as needed.",
  aspirin:
    "Aspirin can cause stomach irritation, bleeding, and allergic reactions in some people. Always take with food and consult your doctor if you have stomach problems or are on blood thinners.",
  prescription:
    "To upload your prescription: 1) Click 'Upload Prescription' in the menu, 2) Take a clear photo or select from gallery, 3) Add medicines to cart. We'll verify and process your order within 2 hours!",
  "lab test":
    "You can book lab tests from our Lab Tests page. Choose your test, select date and time, and our technician will visit your home for sample collection. Reports are available online within 24-48 hours.",
  delivery:
    "We offer free home delivery on orders above ₹299. Standard delivery takes 1-2 days. Express delivery (same day) is available in select cities for ₹99 extra.",
  payment:
    "We accept all major payment methods: UPI, Credit/Debit cards, Net Banking, and Cash on Delivery. All payments are 100% secure with SSL encryption.",
  return:
    "You can return unopened medicines within 7 days of delivery. Prescription medicines cannot be returned due to safety regulations. Contact our support for return requests.",
}

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Hello! I'm your medical assistant. How can I help you today? 😊",
      isBot: true,
      timestamp: new Date(),
    },
  ])
  const [inputMessage, setInputMessage] = useState("")
  const { isSeniorMode } = useSeniorMode()

  const sendMessage = (text: string) => {
    if (!text.trim()) return

    const userMessage: Message = {
      id: Date.now(),
      text: text,
      isBot: false,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputMessage("")

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

    for (const [key, response] of Object.entries(botResponses)) {
      if (lowerMessage.includes(key)) {
        return response
      }
    }

    if (lowerMessage.includes("hello") || lowerMessage.includes("hi")) {
      return "Hello! I'm here to help you with your medical queries. You can ask me about medicines, side effects, how to use our services, or anything health-related."
    }

    if (lowerMessage.includes("thank")) {
      return "You're welcome! Is there anything else I can help you with today? 😊"
    }

    return "I understand you're asking about medical information. For specific medical advice, please consult with our doctors through the consultation feature. I can help you with general medicine information, our services, or guide you to the right section of our app."
  }

  return (
    <>
      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-20 left-4 w-80 h-96 bg-white rounded-lg shadow-lg border z-50 flex flex-col">
          <div className="p-4 border-b bg-green-500 text-white rounded-t-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <MessageCircle className="h-5 w-5" />
                <span className={`font-semibold ${isSeniorMode ? "text-lg" : "text-sm"}`}>Medical Assistant</span>
              </div>
              <button onClick={() => setIsOpen(false)} className="p-1 hover:bg-green-600 rounded">
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="flex-1 flex flex-col p-4">
            <div className="flex-1 overflow-y-auto space-y-3 mb-4">
              {messages.map((message) => (
                <div key={message.id} className={`flex ${message.isBot ? "justify-start" : "justify-end"}`}>
                  <div
                    className={`max-w-[80%] p-3 rounded-lg ${
                      message.isBot ? "bg-gray-100 text-gray-800" : "bg-green-500 text-white"
                    } ${isSeniorMode ? "text-base p-4" : "text-sm"}`}
                  >
                    {message.text}
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Questions */}
            <div className="mb-3">
              <div className="flex flex-wrap gap-1">
                {quickQuestions.map((question, index) => (
                  <button
                    key={index}
                    onClick={() => sendMessage(question)}
                    className={`text-xs bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded ${
                      isSeniorMode ? "text-sm px-3 py-2" : ""
                    }`}
                  >
                    {question}
                  </button>
                ))}
              </div>
            </div>

            {/* Input */}
            <div className="flex space-x-2">
              <input
                type="text"
                placeholder="Ask me anything..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && sendMessage(inputMessage)}
                className={`flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
                  isSeniorMode ? "text-base py-3" : "text-sm"
                }`}
              />
              <button
                onClick={() => sendMessage(inputMessage)}
                disabled={!inputMessage.trim()}
                className="px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Chat Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-4 left-4 rounded-full shadow-lg z-50 bg-green-500 hover:bg-green-600 text-white transition-all duration-200 ${
          isSeniorMode ? "w-16 h-16" : "w-12 h-12"
        }`}
      >
        <MessageCircle className={`${isSeniorMode ? "h-8 w-8" : "h-6 w-6"} mx-auto`} />
      </button>
    </>
  )
}
