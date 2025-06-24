const mongoose = require("mongoose")

const medicineSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    brand: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      enum: [
        "fever",
        "vitamins",
        "antibiotics",
        "cough",
        "diabetes",
        "skincare",
        "heart",
        "digestive",
        "womens-health",
        "mental-health",
        "eye-care",
        "respiratory",
      ],
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    originalPrice: {
      type: Number,
      required: true,
      min: 0,
    },
    description: {
      type: String,
      required: true,
    },
    uses: [String],
    dosage: String,
    sideEffects: [String],
    manufacturer: String,
    composition: String,
    packSize: String,
    images: [String],
    prescription: {
      type: Boolean,
      default: false,
    },
    inStock: {
      type: Boolean,
      default: true,
    },
    stockQuantity: {
      type: Number,
      default: 100,
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    reviews: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        rating: { type: Number, min: 1, max: 5 },
        comment: String,
        date: { type: Date, default: Date.now },
      },
    ],
    tags: [String],
    expiryDate: Date,
    batchNumber: String,
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
)

medicineSchema.index({ name: "text", brand: "text", description: "text" })

module.exports = mongoose.model("Medicine", medicineSchema)
