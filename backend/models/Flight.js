const mongoose = require("mongoose")

const flightSchema = new mongoose.Schema({
  flightNumber: {
    type: String,
    required: [true, "Please provide a flight number"],
    unique: true,
    trim: true,
    uppercase: true,
  },
  airline: {
    type: String,
    required: [true, "Please provide an airline"],
    trim: true,
  },
  source: {
    type: String,
    required: [true, "Please provide source city"],
    trim: true,
  },
  destination: {
    type: String,
    required: [true, "Please provide destination city"],
    trim: true,
  },
  departureDate: {
    type: Date,
    required: [true, "Please provide departure date"],
  },
  departureTime: {
    type: String,
    required: [true, "Please provide departure time"],
  },
  arrivalTime: {
    type: String,
    required: [true, "Please provide arrival time"],
  },
  duration: {
    type: String,
    required: [true, "Please provide flight duration"],
  },
  price: {
    economy: {
      type: Number,
      required: [true, "Please provide economy class price"],
    },
    business: {
      type: Number,
      required: [true, "Please provide business class price"],
    },
    first: {
      type: Number,
      required: [true, "Please provide first class price"],
    },
  },
  seats: {
    economy: {
      total: { type: Number, required: true },
      available: { type: Number, required: true },
    },
    business: {
      total: { type: Number, required: true },
      available: { type: Number, required: true },
    },
    first: {
      total: { type: Number, required: true },
      available: { type: Number, required: true },
    },
  },
  status: {
    type: String,
    enum: ["scheduled", "delayed", "cancelled", "completed"],
    default: "scheduled",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

// Index for efficient searching
flightSchema.index({ source: 1, destination: 1, departureDate: 1 })

module.exports = mongoose.model("Flight", flightSchema)
