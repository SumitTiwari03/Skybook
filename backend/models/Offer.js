const mongoose = require("mongoose")

const offerSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Please provide an offer title"],
    trim: true,
    maxlength: [100, "Title cannot be more than 100 characters"],
  },
  description: {
    type: String,
    required: [true, "Please provide an offer description"],
    trim: true,
    maxlength: [200, "Description cannot be more than 200 characters"],
  },
  discount: {
    type: String,
    required: [true, "Please provide a discount value"],
    trim: true,
  },
  validUntil: {
    type: Date,
    required: [true, "Please provide an expiry date"],
  },
  bgColor: {
    type: String,
    default: "from-blue-400 to-blue-600",
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

module.exports = mongoose.model("Offer", offerSchema)
