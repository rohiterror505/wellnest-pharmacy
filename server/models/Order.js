const mongoose = require("mongoose")

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    orderNumber: {
      type: String,
      unique: true,
      required: true,
    },
    items: [
      {
        medicine: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Medicine",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
        price: {
          type: Number,
          required: true,
        },
      },
    ],
    prescription: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Prescription",
    },
    subtotal: {
      type: Number,
      required: true,
    },
    deliveryFee: {
      type: Number,
      default: 0,
    },
    discount: {
      type: Number,
      default: 0,
    },
    total: {
      type: Number,
      required: true,
    },
    deliveryAddress: {
      name: String,
      phone: String,
      street: String,
      city: String,
      state: String,
      pincode: String,
      landmark: String,
    },
    paymentMethod: {
      type: String,
      enum: ["cod", "card", "upi", "netbanking"],
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed", "refunded"],
      default: "pending",
    },
    orderStatus: {
      type: String,
      enum: ["placed", "confirmed", "processing", "shipped", "delivered", "cancelled"],
      default: "placed",
    },
    trackingNumber: String,
    estimatedDelivery: Date,
    deliveredAt: Date,
    notes: String,
    reminders: [
      {
        medicine: String,
        frequency: String,
        duration: Number,
        startDate: Date,
        isActive: { type: Boolean, default: true },
      },
    ],
  },
  {
    timestamps: true,
  },
)

orderSchema.pre("save", function (next) {
  if (!this.orderNumber) {
    this.orderNumber = "WN" + Date.now() + Math.random().toString(36).substr(2, 4).toUpperCase()
  }
  next()
})

module.exports = mongoose.model("Order", orderSchema)
