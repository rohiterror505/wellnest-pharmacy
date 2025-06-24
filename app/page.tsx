import { Banner } from "@/components/banner"
import { CategoryGrid } from "@/components/category-grid"
import { TrendingProducts } from "@/components/trending-products"
import { VoiceAssistant } from "@/components/voice-assistant"
import { ChatBot } from "@/components/chatbot"
import { SeniorModeProvider } from "@/components/senior-mode-provider"

export default function HomePage() {
  return (
    <SeniorModeProvider>
      <div className="min-h-screen bg-background">
        <main className="container mx-auto px-4 py-6 space-y-8">
          <Banner />
          <CategoryGrid />
          <TrendingProducts />
        </main>

        {/* Floating UI Components */}
        <VoiceAssistant />
        <ChatBot />
      </div>
    </SeniorModeProvider>
  )
}
