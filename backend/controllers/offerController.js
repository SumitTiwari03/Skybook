const Offer = require("../models/Offer")

// @desc    Get all active offers
// @route   GET /api/offers
// @access  Public
const getOffers = async (req, res) => {
  try {
    const offers = await Offer.find({ isActive: true }).sort({ createdAt: -1 })

    res.status(200).json({
      success: true,
      count: offers.length,
      data: offers,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

// @desc    Get all offers (including inactive)
// @route   GET /api/offers/all
// @access  Private/Admin
const getAllOffers = async (req, res) => {
  try {
    const offers = await Offer.find().sort({ createdAt: -1 })

    res.status(200).json({
      success: true,
      count: offers.length,
      data: offers,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

// @desc    Get single offer
// @route   GET /api/offers/:id
// @access  Private/Admin
const getOffer = async (req, res) => {
  try {
    const offer = await Offer.findById(req.params.id)

    if (!offer) {
      return res.status(404).json({
        success: false,
        message: "Offer not found",
      })
    }

    res.status(200).json({
      success: true,
      data: offer,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

// @desc    Create new offer
// @route   POST /api/offers
// @access  Private/Admin
const createOffer = async (req, res) => {
  try {
    const offer = await Offer.create(req.body)

    res.status(201).json({
      success: true,
      message: "Offer created successfully",
      data: offer,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

// @desc    Update offer
// @route   PUT /api/offers/:id
// @access  Private/Admin
const updateOffer = async (req, res) => {
  try {
    const offer = await Offer.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })

    if (!offer) {
      return res.status(404).json({
        success: false,
        message: "Offer not found",
      })
    }

    res.status(200).json({
      success: true,
      message: "Offer updated successfully",
      data: offer,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

// @desc    Delete offer
// @route   DELETE /api/offers/:id
// @access  Private/Admin
const deleteOffer = async (req, res) => {
  try {
    const offer = await Offer.findByIdAndDelete(req.params.id)

    if (!offer) {
      return res.status(404).json({
        success: false,
        message: "Offer not found",
      })
    }

    res.status(200).json({
      success: true,
      message: "Offer deleted successfully",
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

module.exports = {
  getOffers,
  getAllOffers,
  getOffer,
  createOffer,
  updateOffer,
  deleteOffer,
}
