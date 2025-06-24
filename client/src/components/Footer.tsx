import { Link } from "react-router-dom"
import { Phone, Mail, MapPin, Facebook, Twitter, Instagram } from "lucide-react"
import { useSeniorMode } from "../core/SeniorModeContext"

export default function Footer() {
  const { isSeniorMode } = useSeniorMode()

  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="bg-green-500 text-white p-2 rounded-lg">
                <span className={`font-bold ${isSeniorMode ? "text-xl" : "text-lg"}`}>W</span>
              </div>
              <span className={`font-bold text-green-400 ${isSeniorMode ? "text-2xl" : "text-xl"}`}>Wellnest</span>
            </div>
            <p className={`text-gray-300 ${isSeniorMode ? "text-lg" : "text-sm"}`}>
              Your trusted online pharmacy for medicines, wellness products, and healthcare services.
            </p>
            <div className="flex space-x-4">
              <Facebook
                className={`${isSeniorMode ? "h-6 w-6" : "h-5 w-5"} text-gray-400 hover:text-white cursor-pointer`}
              />
              <Twitter
                className={`${isSeniorMode ? "h-6 w-6" : "h-5 w-5"} text-gray-400 hover:text-white cursor-pointer`}
              />
              <Instagram
                className={`${isSeniorMode ? "h-6 w-6" : "h-5 w-5"} text-gray-400 hover:text-white cursor-pointer`}
              />
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className={`font-semibold ${isSeniorMode ? "text-xl" : "text-lg"}`}>Quick Links</h3>
            <div className="space-y-2">
              <Link
                to="/category/medicines"
                className={`block text-gray-300 hover:text-white ${isSeniorMode ? "text-lg" : "text-sm"}`}
              >
                Medicines
              </Link>
              <Link
                to="/category/wellness"
                className={`block text-gray-300 hover:text-white ${isSeniorMode ? "text-lg" : "text-sm"}`}
              >
                Wellness
              </Link>
              <Link
                to="/lab-tests"
                className={`block text-gray-300 hover:text-white ${isSeniorMode ? "text-lg" : "text-sm"}`}
              >
                Lab Tests
              </Link>
              <Link
                to="/consult-doctor"
                className={`block text-gray-300 hover:text-white ${isSeniorMode ? "text-lg" : "text-sm"}`}
              >
                Consult Doctor
              </Link>
              <Link
                to="/health-info"
                className={`block text-gray-300 hover:text-white ${isSeniorMode ? "text-lg" : "text-sm"}`}
              >
                Health Tips
              </Link>
            </div>
          </div>

          {/* Services */}
          <div className="space-y-4">
            <h3 className={`font-semibold ${isSeniorMode ? "text-xl" : "text-lg"}`}>Services</h3>
            <div className="space-y-2">
              <Link
                to="/upload-prescription"
                className={`block text-gray-300 hover:text-white ${isSeniorMode ? "text-lg" : "text-sm"}`}
              >
                Upload Prescription
              </Link>
              <p className={`text-gray-300 ${isSeniorMode ? "text-lg" : "text-sm"}`}>Home Delivery</p>
              <p className={`text-gray-300 ${isSeniorMode ? "text-lg" : "text-sm"}`}>24/7 Support</p>
              <p className={`text-gray-300 ${isSeniorMode ? "text-lg" : "text-sm"}`}>Medicine Reminders</p>
            </div>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className={`font-semibold ${isSeniorMode ? "text-xl" : "text-lg"}`}>Contact Us</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Phone className={`${isSeniorMode ? "h-6 w-6" : "h-5 w-5"} text-green-400`} />
                <span className={`text-gray-300 ${isSeniorMode ? "text-lg" : "text-sm"}`}>+91 98765 43210</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className={`${isSeniorMode ? "h-6 w-6" : "h-5 w-5"} text-green-400`} />
                <span className={`text-gray-300 ${isSeniorMode ? "text-lg" : "text-sm"}`}>support@wellnest.com</span>
              </div>
              <div className="flex items-start space-x-3">
                <MapPin className={`${isSeniorMode ? "h-6 w-6" : "h-5 w-5"} text-green-400 mt-1`} />
                <span className={`text-gray-300 ${isSeniorMode ? "text-lg" : "text-sm"}`}>
                  123 Health Street, Medical District, Mumbai - 400001
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className={`text-gray-400 ${isSeniorMode ? "text-lg" : "text-sm"}`}>
            © 2024 Wellnest. All rights reserved. | Privacy Policy | Terms of Service
          </p>
        </div>
      </div>
    </footer>
  )
}
