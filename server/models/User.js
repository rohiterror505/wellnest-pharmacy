const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      unique: true,
      sparse: true,
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
    },
    password: {
      type: String,
      minlength: 6,
    },
    dateOfBirth: Date,
    gender: {
      type: String,
      enum: ["male", "female", "other"],
    },
    address: {
      street: String,
      city: String,
      state: String,
      pincode: String,
      country: { type: String, default: "India" },
    },
    emergencyContact: {
      name: String,
      phone: String,
      relation: String,
    },
    medicalHistory: [
      {
        condition: String,
        medications: [String],
        allergies: [String],
        notes: String,
        date: { type: Date, default: Date.now },
      },
    ],
    isVerified: {
      type: Boolean,
      default: false,
    },
    role: {
      type: String,
      enum: ["user", "admin", "pharmacist", "doctor"],
      default: "user",
    },
    preferences: {
      seniorMode: { type: Boolean, default: false },
      notifications: {
        email: { type: Boolean, default: true },
        sms: { type: Boolean, default: true },
        reminders: { type: Boolean, default: true },
      },
    },
  },
  {
    timestamps: true,
  },
)

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next()
  this.password = await bcrypt.hash(this.password, 12)
  next()
})

userSchema.methods.comparePassword = async function (password) {
  return bcrypt.compare(password, this.password)
}

module.exports = mongoose.model("User", userSchema)
