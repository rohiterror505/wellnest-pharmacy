const express = require("express")
const Order = require("../models/Order")
const Medicine = require("../models/Medicine")
const auth = require("../middleware/auth")

const router = express.Router()

// Create order
router.post("/", auth, async (req, res) => {
  try {
    const { items, deliveryAddress, paymentMethod, prescriptionId, reminders } = req.body

    // Calculate totals
    let subtotal = 0
    const orderItems = []

    for (const item of items) {
      const medicine = await Medicine.findById(item.medicineId)
      if (!medicine) {
        return res.status(400).json({ message: `Medicine not found: ${item.medicineId}` })
      }

      if (!medicine.inStock || medicine.stockQuantity < item.quantity) {
        return res.status(400).json({ message: `Insufficient stock for ${medicine.name}` })
      }

      const itemTotal = medicine.price * item.quantity
      subtotal += itemTotal

      orderItems.push({
        medicine: medicine._id,
        quantity: item.quantity,
        price: medicine.price,
      })

      // Update stock
      medicine.stockQuantity -= item.quantity
      if (medicine.stockQuantity === 0) {
        medicine.inStock = false
      }
      await medicine.save()
    }

    const deliveryFee = subtotal >= 299 ? 0 : 50
    const total = subtotal + deliveryFee

    const order = new Order({
      user: req.userId,
      items: orderItems,
      prescription: prescriptionId,
      subtotal,
      deliveryFee,
      total,
      deliveryAddress,
      paymentMethod,
      estimatedDelivery: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days
      reminders: reminders || [],
    })

    await order.save()
    await order.populate("items.medicine")

    res.status(201).json({
      message: "Order placed successfully",
      order,
    })
  } catch (error) {
    res.status(500).json({ message: "Failed to create order", error: error.message })
  }
})

// Get user orders
router.get("/", auth, async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query

    const orders = await Order.find({ user: req.userId })
      .populate("items.medicine")
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)

    const total = await Order.countDocuments({ user: req.userId })

    res.json({
      orders,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total,
    })
  } catch (error) {
    res.status(500).json({ message: "Failed to get orders", error: error.message })
  }
})

// Get order by ID
router.get("/:id", auth, async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      user: req.userId,
    }).populate("items.medicine")

    if (!order) {
      return res.status(404).json({ message: "Order not found" })
    }

    res.json(order)
  } catch (error) {
    res.status(500).json({ message: "Failed to get order", error: error.message })
  }
})

// Cancel order
router.put("/:id/cancel", auth, async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      user: req.userId,
    })

    if (!order) {
      return res.status(404).json({ message: "Order not found" })
    }

    if (!["placed", "confirmed"].includes(order.orderStatus)) {
      return res.status(400).json({ message: "Order cannot be cancelled" })
    }

    order.orderStatus = "cancelled"
    await order.save()

    // Restore stock
    for (const item of order.items) {
      const medicine = await Medicine.findById(item.medicine)
      if (medicine) {
        medicine.stockQuantity += item.quantity
        medicine.inStock = true
        await medicine.save()
      }
    }

    res.json({ message: "Order cancelled successfully", order })
  } catch (error) {
    res.status(500).json({ message: "Failed to cancel order", error: error.message })
  }
})

module.exports = router
