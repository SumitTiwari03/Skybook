const express = require("express")
const {
  getFlights,
  getFlight,
  getPopularFlights,
  createFlight,
  updateFlight,
  deleteFlight,
} = require("../controllers/flightController")
const { protect, authorize } = require("../middleware/auth")
const { validateFlight } = require("../middleware/validation")

const router = express.Router()

router.route("/").get(getFlights).post(protect, authorize("admin"), validateFlight, createFlight)

router.route("/popular").get(getPopularFlights)

router
  .route("/:id")
  .get(getFlight)
  .put(protect, authorize("admin"), updateFlight)
  .delete(protect, authorize("admin"), deleteFlight)

module.exports = router
