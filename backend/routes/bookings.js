const express = require("express")
const {
  createBooking,
  getMyBookings,
  getBooking,
  cancelBooking,
  getAllBookings,
} = require("../controllers/bookingController")
const { protect, authorize } = require("../middleware/auth")
const { validateBooking } = require("../middleware/validation")

const router = express.Router()

router.route("/").get(protect, authorize("admin"), getAllBookings).post(protect, validateBooking, createBooking)

router.get("/my-bookings", protect, getMyBookings)

router.route("/:id").get(protect, getBooking)

router.put("/:id/cancel", protect, cancelBooking)

module.exports = router
