const mongoose = require("mongoose")

const bookingSchema = new mongoose.Schema({
  bookingReference: {
    type: String,
    required: true,
    unique: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  flight: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Flight",
    required: false, // Not required for Amadeus bookings
  },
  // For Amadeus bookings, store flight details directly
  flightDetails: {
    flightNumber: String,
    airline: String,
    source: String,
    destination: String,
    departureDate: Date,
    departureTime: String,
    arrivalTime: String,
    isAmadeusBooking: {
      type: Boolean,
      default: false,
    },
  },
  passengers: [
    {
      name: {
        type: String,
        required: true,
        trim: true,
      },
      age: {
        type: Number,
        required: true,
        min: 1,
      },
      gender: {
        type: String,
        enum: ["male", "female", "other"],
        required: true,
      },
      seatNumber: {
        type: String,
        required: true,
      },
    },
  ],
  class: {
    type: String,
    enum: ["economy", "business", "first"],
    required: true,
  },
  totalPrice: {
    type: Number,
    required: true,
  },
  paymentStatus: {
    type: String,
    enum: ["pending", "completed", "failed", "refunded"],
    default: "pending",
  },
  paymentMethod: {
    type: String,
    enum: ["credit_card", "debit_card", "paypal", "bank_transfer", "upi", "net_banking"],
    required: true,
  },
  bookingStatus: {
    type: String,
    enum: ["confirmed", "cancelled", "completed"],
    default: "confirmed",
  },
  bookingDate: {
    type: Date,
    default: Date.now,
  },
})

// Generate booking reference before saving
// bookingSchema.pre("save", function (next) {
//   if (!this.bookingReference) {
//     this.bookingReference = "BK" + Date.now() + Math.random().toString(36).substr(2, 5).toUpperCase()
//   }
//   next()
// })

module.exports = mongoose.model("Booking", bookingSchema)
