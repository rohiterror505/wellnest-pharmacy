const express = require("express")
const Medicine = require("../models/Medicine")

const router = express.Router()

// Get all medicines with pagination and filters
router.get("/", async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      category,
      search,
      minPrice,
      maxPrice,
      prescription,
      inStock,
      sort = "name",
    } = req.query

    const query = { isActive: true }

    // Apply filters
    if (category) query.category = category
    if (search) {
      query.$text = { $search: search }
    }
    if (minPrice || maxPrice) {
      query.price = {}
      if (minPrice) query.price.$gte = Number(minPrice)
      if (maxPrice) query.price.$lte = Number(maxPrice)
    }
    if (prescription !== undefined) query.prescription = prescription === "true"
    if (inStock !== undefined) query.inStock = inStock === "true"

    const sortOptions = {}
    switch (sort) {
      case "price-low":
        sortOptions.price = 1
        break
      case "price-high":
        sortOptions.price = -1
        break
      case "rating":
        sortOptions.rating = -1
        break
      case "newest":
        sortOptions.createdAt = -1
        break
      default:
        sortOptions.name = 1
    }

    const medicines = await Medicine.find(query)
      .sort(sortOptions)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate("reviews.user", "name")

    const total = await Medicine.countDocuments(query)

    res.json({
      medicines,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total,
    })
  } catch (error) {
    res.status(500).json({ message: "Failed to get medicines", error: error.message })
  }
})

// Get medicine by ID
router.get("/:id", async (req, res) => {
  try {
    const medicine = await Medicine.findById(req.params.id).populate("reviews.user", "name")

    if (!medicine) {
      return res.status(404).json({ message: "Medicine not found" })
    }

    res.json(medicine)
  } catch (error) {
    res.status(500).json({ message: "Failed to get medicine", error: error.message })
  }
})

// Search medicines
router.get("/search/:query", async (req, res) => {
  try {
    const { query } = req.params
    const { limit = 10 } = req.query

    const medicines = await Medicine.find({
      $and: [
        { isActive: true },
        {
          $or: [
            { name: { $regex: query, $options: "i" } },
            { brand: { $regex: query, $options: "i" } },
            { description: { $regex: query, $options: "i" } },
            { uses: { $in: [new RegExp(query, "i")] } },
          ],
        },
      ],
    })
      .limit(Number(limit))
      .sort({ rating: -1 })

    res.json(medicines)
  } catch (error) {
    res.status(500).json({ message: "Search failed", error: error.message })
  }
})

// Get trending medicines
router.get("/trending/list", async (req, res) => {
  try {
    const medicines = await Medicine.find({
      isActive: true,
      rating: { $gte: 4.0 },
    })
      .sort({ rating: -1 })
      .limit(8)

    res.json(medicines)
  } catch (error) {
    res.status(500).json({ message: "Failed to get trending medicines", error: error.message })
  }
})

// Get categories
router.get("/categories/list", async (req, res) => {
  try {
    const categories = await Medicine.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: "$category", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ])

    const categoryMap = {
      fever: { name: "Fever & Pain", icon: "🤒" },
      vitamins: { name: "Vitamins", icon: "💊" },
      antibiotics: { name: "Antibiotics", icon: "🦠" },
      cough: { name: "Cough & Cold", icon: "🤧" },
      diabetes: { name: "Diabetes", icon: "🩸" },
      skincare: { name: "Skincare", icon: "🧴" },
      heart: { name: "Heart & BP", icon: "❤️" },
      digestive: { name: "Digestive", icon: "🫃" },
    }

    const result = categories.map((cat) => ({
      id: cat._id,
      name: categoryMap[cat._id]?.name || cat._id,
      icon: categoryMap[cat._id]?.icon || "💊",
      count: cat.count,
    }))

    res.json(result)
  } catch (error) {
    res.status(500).json({ message: "Failed to get categories", error: error.message })
  }
})

module.exports = router
