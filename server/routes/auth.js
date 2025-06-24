const express = require("express")
const jwt = require("jsonwebtoken")
const User = require("../models/User")
const { sendOTP, verifyOTP } = require("../utils/otp")
const auth = require("../middleware/auth")

const router = express.Router()

// Send OTP for phone login
router.post("/send-otp", async (req, res) => {
  try {
    const { phone } = req.body

    if (!phone || phone.length !== 10) {
      return res.status(400).json({ message: "Valid 10-digit phone number required" })
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString()

    // In production, send actual SMS
    // await sendOTP(phone, otp);

    // Store OTP in memory/redis (simplified for demo)
    global.otpStore = global.otpStore || {}
    global.otpStore[phone] = {
      otp,
      expires: Date.now() + 5 * 60 * 1000, // 5 minutes
    }

    res.json({
      message: "OTP sent successfully",
      // For demo purposes only - remove in production
      otp: process.env.NODE_ENV === "development" ? otp : undefined,
    })
  } catch (error) {
    res.status(500).json({ message: "Failed to send OTP", error: error.message })
  }
})

// Verify OTP and login
router.post("/verify-otp", async (req, res) => {
  try {
    const { phone, otp } = req.body

    // Check OTP
    const storedOTP = global.otpStore?.[phone]
    if (!storedOTP || storedOTP.expires < Date.now()) {
      return res.status(400).json({ message: "OTP expired or invalid" })
    }

    if (storedOTP.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" })
    }

    // Find or create user
    let user = await User.findOne({ phone })
    if (!user) {
      user = new User({
        name: `User ${phone}`,
        phone,
        isVerified: true,
      })
      await user.save()
    }

    // Generate JWT
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET || "your-secret-key", { expiresIn: "30d" })

    // Clear OTP
    delete global.otpStore[phone]

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        phone: user.phone,
        email: user.email,
      },
    })
  } catch (error) {
    res.status(500).json({ message: "Login failed", error: error.message })
  }
})

// Email login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body

    const user = await User.findOne({ email })
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" })
    }

    const isMatch = await user.comparePassword(password)
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" })
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET || "your-secret-key", { expiresIn: "30d" })

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        phone: user.phone,
        email: user.email,
      },
    })
  } catch (error) {
    res.status(500).json({ message: "Login failed", error: error.message })
  }
})

// Register
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, phone } = req.body

    // Check if user exists
    const existingUser = await User.findOne({
      $or: [{ email }, { phone }],
    })

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" })
    }

    const user = new User({
      name,
      email,
      password,
      phone,
      isVerified: true,
    })

    await user.save()

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET || "your-secret-key", { expiresIn: "30d" })

    res.status(201).json({
      message: "Registration successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        phone: user.phone,
        email: user.email,
      },
    })
  } catch (error) {
    res.status(500).json({ message: "Registration failed", error: error.message })
  }
})

// Get user profile
router.get("/profile", auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password")
    res.json(user)
  } catch (error) {
    res.status(500).json({ message: "Failed to get profile", error: error.message })
  }
})

// Update user profile
router.put("/profile", auth, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.userId,
      { $set: req.body },
      { new: true, runValidators: true },
    ).select("-password")

    res.json({ message: "Profile updated successfully", user })
  } catch (error) {
    res.status(500).json({ message: "Failed to update profile", error: error.message })
  }
})

module.exports = router
