"use client"

import type React from "react"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Upload, X, FileText, Camera, ImageIcon, Check } from "lucide-react"
import { useSeniorMode } from "../core/SeniorModeContext"
import { useAuth } from "../core/AuthContext"
import toast from "react-hot-toast"

interface UploadedFile {
  id: string
  file: File
  preview: string
  type: string
}

export default function UploadPrescriptionPage() {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const [notes, setNotes] = useState("")
  const [deliveryAddress, setDeliveryAddress] = useState({
    name: "",
    phone: "",
    address: "",
    pincode: "",
  })

  const { isSeniorMode } = useSeniorMode()
  const { user } = useAuth()
  const navigate = useNavigate()

  const handleFileUpload = (files: FileList | null) => {
    if (!files) return

    Array.from(files).forEach((file) => {
      if (file.size > 10 * 1024 * 1024) {
        toast.error("File size should be less than 10MB")
        return
      }

      if (!file.type.match(/^image\/(jpeg|jpg|png|pdf)$/)) {
        toast.error("Only JPG, PNG, and PDF files are allowed")
        return
      }

      const reader = new FileReader()
      reader.onload = (e) => {
        const newFile: UploadedFile = {
          id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
          file,
          preview: e.target?.result as string,
          type: file.type,
        }

        setUploadedFiles((prev) => [...prev, newFile])
        toast.success(`${file.name} uploaded successfully`)
      }
      reader.readAsDataURL(file)
    })
  }

  const removeFile = (id: string) => {
    setUploadedFiles((prev) => prev.filter((file) => file.id !== id))
    toast.success("File removed")
  }

  const handleCameraCapture = () => {
    const input = document.createElement("input")
    input.type = "file"
    input.accept = "image/*"
    input.capture = "environment"
    input.onchange = (e) => {
      const target = e.target as HTMLInputElement
      handleFileUpload(target.files)
    }
    input.click()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (uploadedFiles.length === 0) {
      toast.error("Please upload at least one prescription")
      return
    }

    if (!deliveryAddress.name || !deliveryAddress.phone || !deliveryAddress.address || !deliveryAddress.pincode) {
      toast.error("Please fill in all delivery address fields")
      return
    }

    setIsUploading(true)

    try {
      // Simulate API call
      setTimeout(() => {
        const prescriptionId = "RX" + Date.now()

        // Store in localStorage for demo
        const prescriptions = JSON.parse(localStorage.getItem("wellnest_prescriptions") || "[]")
        prescriptions.push({
          id: prescriptionId,
          userId: user?.id,
          files: uploadedFiles.map((f) => ({
            name: f.file.name,
            type: f.type,
            preview: f.preview,
          })),
          notes,
          deliveryAddress,
          status: "uploaded",
          uploadedAt: new Date().toISOString(),
        })
        localStorage.setItem("wellnest_prescriptions", JSON.stringify(prescriptions))

        toast.success("Prescription uploaded successfully!")
        navigate("/thank-you", {
          state: {
            type: "prescription",
            prescriptionId,
            message: "Your prescription has been uploaded successfully. Our pharmacist will verify it within 2 hours.",
          },
        })
        setIsUploading(false)
      }, 2000)
    } catch (error) {
      toast.error("Failed to upload prescription. Please try again.")
      setIsUploading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className={`font-bold text-gray-900 ${isSeniorMode ? "text-4xl" : "text-3xl"}`}>Upload Prescription</h1>
          <p className={`text-gray-600 ${isSeniorMode ? "text-lg" : "text-base"}`}>
            Upload your prescription and get medicines delivered to your doorstep
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* File Upload Section */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className={`font-semibold mb-4 ${isSeniorMode ? "text-2xl" : "text-xl"}`}>Upload Prescription Files</h2>

            {/* Upload Area */}
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center space-y-4">
              <div className="flex justify-center space-x-4">
                <Upload className={`text-gray-400 ${isSeniorMode ? "h-12 w-12" : "h-8 w-8"}`} />
              </div>

              <div className="space-y-2">
                <p className={`text-gray-600 ${isSeniorMode ? "text-lg" : "text-base"}`}>
                  Drag and drop your prescription files here, or click to browse
                </p>
                <p className={`text-gray-500 ${isSeniorMode ? "text-base" : "text-sm"}`}>
                  Supports JPG, PNG, PDF (Max 10MB per file)
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <label
                  className={`bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 cursor-pointer font-medium inline-flex items-center space-x-2 ${
                    isSeniorMode ? "px-8 py-4 text-lg" : ""
                  }`}
                >
                  <ImageIcon className={`${isSeniorMode ? "h-6 w-6" : "h-5 w-5"}`} />
                  <span>Choose Files</span>
                  <input
                    type="file"
                    multiple
                    accept="image/*,.pdf"
                    onChange={(e) => handleFileUpload(e.target.files)}
                    className="hidden"
                  />
                </label>

                <button
                  type="button"
                  onClick={handleCameraCapture}
                  className={`bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 font-medium inline-flex items-center space-x-2 ${
                    isSeniorMode ? "px-8 py-4 text-lg" : ""
                  }`}
                >
                  <Camera className={`${isSeniorMode ? "h-6 w-6" : "h-5 w-5"}`} />
                  <span>Take Photo</span>
                </button>
              </div>
            </div>

            {/* Uploaded Files */}
            {uploadedFiles.length > 0 && (
              <div className="mt-6 space-y-4">
                <h3 className={`font-medium ${isSeniorMode ? "text-lg" : "text-base"}`}>
                  Uploaded Files ({uploadedFiles.length})
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {uploadedFiles.map((file) => (
                    <div key={file.id} className="border rounded-lg p-4 relative">
                      <button
                        type="button"
                        onClick={() => removeFile(file.id)}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                      >
                        <X className="h-4 w-4" />
                      </button>

                      <div className="flex items-start space-x-3">
                        {file.type.startsWith("image/") ? (
                          <img
                            src={file.preview || "/placeholder.svg"}
                            alt="Preview"
                            className="w-16 h-16 object-cover rounded"
                          />
                        ) : (
                          <div className="w-16 h-16 bg-red-100 rounded flex items-center justify-center">
                            <FileText className="h-8 w-8 text-red-600" />
                          </div>
                        )}

                        <div className="flex-1 min-w-0">
                          <p className={`font-medium truncate ${isSeniorMode ? "text-base" : "text-sm"}`}>
                            {file.file.name}
                          </p>
                          <p className={`text-gray-500 ${isSeniorMode ? "text-base" : "text-xs"}`}>
                            {(file.file.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                          <div className="flex items-center space-x-1 mt-1">
                            <Check className="h-4 w-4 text-green-500" />
                            <span className={`text-green-600 ${isSeniorMode ? "text-base" : "text-xs"}`}>Uploaded</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Notes Section */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className={`font-semibold mb-4 ${isSeniorMode ? "text-2xl" : "text-xl"}`}>Additional Notes</h2>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any special instructions or notes for the pharmacist..."
              rows={4}
              className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none ${
                isSeniorMode ? "text-lg" : ""
              }`}
            />
          </div>

          {/* Delivery Address */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className={`font-semibold mb-4 ${isSeniorMode ? "text-2xl" : "text-xl"}`}>Delivery Address</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={`block text-gray-700 font-medium mb-2 ${isSeniorMode ? "text-lg" : "text-sm"}`}>
                  Full Name *
                </label>
                <input
                  type="text"
                  value={deliveryAddress.name}
                  onChange={(e) => setDeliveryAddress((prev) => ({ ...prev, name: e.target.value }))}
                  required
                  className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                    isSeniorMode ? "py-4 text-lg" : ""
                  }`}
                />
              </div>

              <div>
                <label className={`block text-gray-700 font-medium mb-2 ${isSeniorMode ? "text-lg" : "text-sm"}`}>
                  Phone Number *
                </label>
                <input
                  type="tel"
                  value={deliveryAddress.phone}
                  onChange={(e) =>
                    setDeliveryAddress((prev) => ({
                      ...prev,
                      phone: e.target.value.replace(/\D/g, "").slice(0, 10),
                    }))
                  }
                  required
                  className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                    isSeniorMode ? "py-4 text-lg" : ""
                  }`}
                />
              </div>

              <div className="md:col-span-2">
                <label className={`block text-gray-700 font-medium mb-2 ${isSeniorMode ? "text-lg" : "text-sm"}`}>
                  Complete Address *
                </label>
                <textarea
                  value={deliveryAddress.address}
                  onChange={(e) => setDeliveryAddress((prev) => ({ ...prev, address: e.target.value }))}
                  required
                  rows={3}
                  className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none ${
                    isSeniorMode ? "text-lg" : ""
                  }`}
                />
              </div>

              <div>
                <label className={`block text-gray-700 font-medium mb-2 ${isSeniorMode ? "text-lg" : "text-sm"}`}>
                  Pincode *
                </label>
                <input
                  type="text"
                  value={deliveryAddress.pincode}
                  onChange={(e) =>
                    setDeliveryAddress((prev) => ({
                      ...prev,
                      pincode: e.target.value.replace(/\D/g, "").slice(0, 6),
                    }))
                  }
                  required
                  className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                    isSeniorMode ? "py-4 text-lg" : ""
                  }`}
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="text-center">
            <button
              type="submit"
              disabled={isUploading || uploadedFiles.length === 0}
              className={`bg-green-500 text-white px-8 py-4 rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed font-medium ${
                isSeniorMode ? "px-12 py-6 text-xl" : "text-lg"
              }`}
            >
              {isUploading ? "Uploading..." : "Upload Prescription"}
            </button>
          </div>
        </form>

        {/* Instructions */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className={`font-semibold text-blue-900 mb-3 ${isSeniorMode ? "text-xl" : "text-lg"}`}>
            Important Instructions
          </h3>
          <ul className={`text-blue-800 space-y-2 ${isSeniorMode ? "text-lg" : "text-sm"}`}>
            <li>• Ensure prescription is clearly visible and not blurred</li>
            <li>• Include doctor's signature and clinic stamp</li>
            <li>• Upload all pages if prescription has multiple pages</li>
            <li>• Our pharmacist will verify within 2 hours</li>
            <li>• You'll receive SMS/email updates on order status</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
