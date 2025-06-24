const mongoose = require("mongoose")
const Medicine = require("../models/Medicine")
require("dotenv").config()

const medicines = [
  {
    name: "Paracetamol 500mg",
    brand: "Crocin",
    category: "fever",
    price: 25,
    originalPrice: 30,
    description: "Effective pain relief and fever reducer",
    uses: ["Fever", "Headache", "Body pain"],
    dosage: "1-2 tablets every 4-6 hours",
    sideEffects: ["Nausea", "Stomach upset (rare)"],
    manufacturer: "GSK",
    composition: "Paracetamol 500mg",
    packSize: "10 tablets",
    images: ["https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=300&h=300&fit=crop"],
    prescription: false,
    inStock: true,
    stockQuantity: 100,
    rating: 4.5,
    tags: ["fever", "pain relief", "headache"],
    expiryDate: new Date("2025-12-31"),
    batchNumber: "CR001",
  },
  {
    name: "Vitamin D3 60000 IU",
    brand: "HealthKart",
    category: "vitamins",
    price: 299,
    originalPrice: 399,
    description: "High potency Vitamin D3 supplement",
    uses: ["Bone health", "Immunity", "Calcium absorption"],
    dosage: "1 capsule weekly",
    sideEffects: ["Nausea", "Constipation (if overdosed)"],
    manufacturer: "HealthKart",
    composition: "Cholecalciferol 60000 IU",
    packSize: "4 capsules",
    images: ["https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=300&h=300&fit=crop"],
    prescription: false,
    inStock: true,
    stockQuantity: 50,
    rating: 4.6,
    tags: ["vitamin", "bone health", "immunity"],
    expiryDate: new Date("2025-06-30"),
    batchNumber: "VD001",
  },
  // Add more medicines...
]

async function seedDatabase() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/wellnest")

    // Clear existing medicines
    await Medicine.deleteMany({})

    // Insert new medicines
    await Medicine.insertMany(medicines)

    console.log("Database seeded successfully!")
    process.exit(0)
  } catch (error) {
    console.error("Error seeding database:", error)
    process.exit(1)
  }
}

seedDatabase()
