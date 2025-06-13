const express = require("express")
const {
  getOffers,
  getAllOffers,
  getOffer,
  createOffer,
  updateOffer,
  deleteOffer,
} = require("../controllers/offerController")
const { protect, authorize } = require("../middleware/auth")

const router = express.Router()

router.route("/").get(getOffers).post(protect, authorize("admin"), createOffer)
router.route("/all").get(protect, authorize("admin"), getAllOffers)
router
  .route("/:id")
  .get(getOffer)
  .put(protect, authorize("admin"), updateOffer)
  .delete(protect, authorize("admin"), deleteOffer)

module.exports = router
