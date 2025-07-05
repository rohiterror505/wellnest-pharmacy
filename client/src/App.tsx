import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { AuthProvider } from "./core/AuthContext"
import { CartProvider } from "./core/CartContext"
import { SeniorModeProvider } from "./components/senior-mode-provider"
import { Toaster } from "react-hot-toast"

// Pages
import HomePage from "./pages/HomePage"
import LoginPage from "./pages/LoginPage"
import SignupPage from "./pages/SignupPage"
import SearchResultsPage from "./pages/SearchResultsPage"
import CategoryPage from "./pages/CategoryPage"
import MedicineDetailsPage from "./pages/MedicineDetailsPage"
import CartPage from "./pages/CartPage"
import CheckoutPage from "./pages/CheckoutPage"
import UploadPrescriptionPage from "./pages/UploadPrescriptionPage"
import LabTestBookingPage from "./pages/LabTestBookingPage"
import ConsultDoctorPage from "./pages/ConsultDoctorPage"
import HealthInfoPage from "./pages/HealthInfoPage"
import ThankYouPage from "./pages/ThankYouPage"

// Components
import Navbar from "./components/Navbar"
import Footer from "./components/Footer"
import VoiceAssistant from "./components/VoiceAssistant"
import { ChatBot } from "./components/ChatBot"
import ProtectedRoute from "./components/ProtectedRoute"

// import "./App.css"

function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <SeniorModeProvider>
            <div className="min-h-screen bg-background">
              <Navbar />

              <main className="min-h-screen">
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/signup" element={<SignupPage />} />
                  <Route path="/search" element={<SearchResultsPage />} />
                  <Route path="/category/:categoryName" element={<CategoryPage />} />
                  <Route path="/medicine/:id" element={<MedicineDetailsPage />} />
                  <Route
                    path="/cart"
                    element={
                      <ProtectedRoute>
                        <CartPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/checkout"
                    element={
                      <ProtectedRoute>
                        <CheckoutPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/upload-prescription"
                    element={
                      <ProtectedRoute>
                        <UploadPrescriptionPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/lab-tests"
                    element={
                      <ProtectedRoute>
                        <LabTestBookingPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/consult-doctor"
                    element={
                      <ProtectedRoute>
                        <ConsultDoctorPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route path="/health-info" element={<HealthInfoPage />} />
                  <Route
                    path="/thank-you"
                    element={
                      <ProtectedRoute>
                        <ThankYouPage />
                      </ProtectedRoute>
                    }
                  />
                </Routes>
              </main>

              <Footer />

              {/* Floating Components */}
              <VoiceAssistant />
              <ChatBot />

              <Toaster position="top-right" />
            </div>
          </SeniorModeProvider>
        </CartProvider>
      </AuthProvider>
    </Router>
  )
}

export default App
