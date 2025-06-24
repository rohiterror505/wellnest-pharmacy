import { Banner } from "../client/src/components/banner"
import { CategoryGrid } from "../client/src/components/category-grid"
import { TrendingProducts } from "../client/src/components/trending-products"
import { VoiceAssistant } from "../client/src/components/voice-assistant"
import { ChatBot } from "../components/chatbot"
import { SeniorModeProvider } from "../client/src/components/senior-mode-provider"

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
