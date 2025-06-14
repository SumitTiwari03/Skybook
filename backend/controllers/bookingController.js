const Booking = require("../models/Booking")
const Flight = require("../models/Flight")

// @desc    Create new booking
// @route   POST /api/bookings
// @access  Private

 const generateBookingReference = () =>
      "BK" + Date.now() + Math.random().toString(36).substr(2, 5).toUpperCase()

const createBooking = async (req, res) => {
  try {
    const { flightId, passengers, class: bookingClass, paymentMethod } = req.body

    console.log("Booking request:", { flightId, passengers, bookingClass, paymentMethod })

    let flight = null
    let isAmadeusBooking = false

    // Check if this is an Amadeus flight (ID starts with 'amadeus_')
    if (flightId.startsWith("amadeus_")) {
      isAmadeusBooking = true
      // For Amadeus flights, we need to create a temporary flight object
      // In a real implementation, you'd get this from the Amadeus API
      // For now, we'll extract the flight data from the request or session

      // Try to find if we have this flight data stored temporarily
      // This is a simplified approach - in production, you'd store search results temporarily
      console.log("Amadeus booking detected, flight ID:", flightId)

      // For demo purposes, we'll create a mock flight object
      // In production, you should store Amadeus search results temporarily and retrieve them here
      flight = {
        _id: flightId,
        flightNumber: req.body.flightNumber || "AI101",
        airline: req.body.airline || "Air India",
        source: req.body.source || "Delhi",
        destination: req.body.destination || "Mumbai",
        departureDate: new Date(req.body.departureDate || Date.now()),
        departureTime: req.body.departureTime || "08:00",
        arrivalTime: req.body.arrivalTime || "10:15",
        price: req.body.price || {
          economy: 4999,
          business: 12999,
          first: 19999,
        },
        seats: {
          economy: { total: 150, available: 120 },
          business: { total: 30, available: 25 },
          first: { total: 10, available: 8 },
        },
        status: "scheduled",
      }
    } else {
      // Regular database flight
      flight = await Flight.findById(flightId)
      if (!flight) {
        return res.status(404).json({
          success: false,
          message: "Flight not found",
        })
      }
    }

    console.log("Flight found:", flight.flightNumber, flight.airline)

    // Validate booking class
    if (!["economy", "business", "first"].includes(bookingClass)) {
      return res.status(400).json({
        success: false,
        message: "Invalid booking class. Must be economy, business, or first",
      })
    }

    // Validate payment method
    const validPaymentMethods = ["credit_card", "debit_card", "paypal", "bank_transfer", "upi", "net_banking"]
    if (!validPaymentMethods.includes(paymentMethod)) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment method",
      })
    }

    // Validate passengers
    if (!passengers || !Array.isArray(passengers) || passengers.length === 0) {
      return res.status(400).json({
        success: false,
        message: "At least one passenger is required",
      })
    }

    // Validate passenger data
    for (let i = 0; i < passengers.length; i++) {
      const passenger = passengers[i]
      if (!passenger.name || !passenger.age || !passenger.gender || !passenger.seatNumber) {
        return res.status(400).json({
          success: false,
          message: `Incomplete passenger data for passenger ${i + 1}`,
        })
      }
    }

    // Check seat availability (only for local flights)
    if (!isAmadeusBooking) {
      const availableSeats = flight.seats[bookingClass].available
      if (availableSeats < passengers.length) {
        return res.status(400).json({
          success: false,
          message: `Only ${availableSeats} seats available in ${bookingClass} class`,
        })
      }
    }

    // Calculate total price using the selected class
    const pricePerSeat = flight.price[bookingClass]
    if (!pricePerSeat) {
      return res.status(400).json({
        success: false,
        message: `Price not available for ${bookingClass} class`,
      })
    }

    const totalPrice = pricePerSeat * passengers.length

    console.log("Pricing calculation:", {
      class: bookingClass,
      pricePerSeat,
      passengerCount: passengers.length,
      totalPrice,
    })

    // Mock payment processing (90% success rate)
    const paymentSuccess = Math.random() > 0.1

    if (!paymentSuccess) {
      return res.status(400).json({
        success: false,
        message: "Payment failed. Please try again.",
      })
    }

    // Create booking with dynamic values
    const bookingData = {
      bookingReference: generateBookingReference(),
      user: req.user.id,
      flight: isAmadeusBooking ? null : flightId, // Don't reference non-existent flight for Amadeus
      flightDetails: isAmadeusBooking
        ? {
            flightNumber: flight.flightNumber,
            airline: flight.airline,
            source: flight.source,
            destination: flight.destination,
            departureDate: flight.departureDate,
            departureTime: flight.departureTime,
            arrivalTime: flight.arrivalTime,
            isAmadeusBooking: true,
          }
        : null,
      passengers: passengers, // Use passengers as provided (with seat numbers)
      class: bookingClass, // Use dynamic class
      totalPrice,
      paymentMethod, // Use dynamic payment method
      paymentStatus: "completed",
      bookingStatus: "confirmed",
    }

    const booking = await Booking.create(bookingData)

    // Update flight seat availability (only for local flights)
    if (!isAmadeusBooking) {
      flight.seats[bookingClass].available -= passengers.length
      await flight.save()
    }

    // Populate booking with flight details
    let populatedBooking
    if (isAmadeusBooking) {
      populatedBooking = {
        ...booking.toObject(),
        flight: flight, // Add flight details for response
      }
    } else {
      populatedBooking = await Booking.findById(booking._id)
        .populate("flight", "flightNumber airline source destination departureDate departureTime arrivalTime status")
        .populate("user", "name email")
    }

    console.log("Booking created successfully:", booking.bookingReference)

    res.status(201).json({
      success: true,
      message: "Booking created successfully",
      data: populatedBooking,
    })
  } catch (error) {
    console.error("Booking creation error:", error)
    res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

// @desc    Get user bookings
// @route   GET /api/bookings/my-bookings
// @access  Private
const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user.id })
      .populate("flight", "flightNumber airline source destination departureDate departureTime arrivalTime status")
      .sort({ bookingDate: -1 })

    // Handle bookings with flightDetails (Amadeus bookings)
    const processedBookings = bookings.map((booking) => {
      if (booking.flightDetails && !booking.flight) {
        // This is an Amadeus booking
        return {
          ...booking.toObject(),
          flight: {
            flightNumber: booking.flightDetails.flightNumber,
            airline: booking.flightDetails.airline,
            source: booking.flightDetails.source,
            destination: booking.flightDetails.destination,
            departureDate: booking.flightDetails.departureDate,
            departureTime: booking.flightDetails.departureTime,
            arrivalTime: booking.flightDetails.arrivalTime,
            status: "scheduled",
          },
        }
      }
      return booking
    })

    res.status(200).json({
      success: true,
      count: processedBookings.length,
      data: processedBookings,
    })
  } catch (error) {
    console.error("Get bookings error:", error)
    res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

// @desc    Get single booking
// @route   GET /api/bookings/:id
// @access  Private
const getBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).populate("flight").populate("user", "name email")

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      })
    }

    // Check if user owns this booking or is admin
    if (booking.user._id.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Not authorized to access this booking",
      })
    }

    // Handle Amadeus booking
    let processedBooking = booking
    if (booking.flightDetails && !booking.flight) {
      processedBooking = {
        ...booking.toObject(),
        flight: {
          flightNumber: booking.flightDetails.flightNumber,
          airline: booking.flightDetails.airline,
          source: booking.flightDetails.source,
          destination: booking.flightDetails.destination,
          departureDate: booking.flightDetails.departureDate,
          departureTime: booking.flightDetails.departureTime,
          arrivalTime: booking.flightDetails.arrivalTime,
          status: "scheduled",
        },
      }
    }

    res.status(200).json({
      success: true,
      data: processedBooking,
    })
  } catch (error) {
    console.error("Get booking error:", error)
    res.status(500).json({
      success: false,
      message: error.message,
    }) 
  }
}

// @desc    Cancel booking
// @route   PUT /api/bookings/:id/cancel
// @access  Private
const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).populate("flight")

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      })
    }

    // Check if user owns this booking
    if (booking.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to cancel this booking",
      })
    }

    // Check if booking can be cancelled
    if (booking.bookingStatus === "cancelled") {
      return res.status(400).json({
        success: false,
        message: "Booking is already cancelled",
      })
    }

    // Update booking status
    booking.bookingStatus = "cancelled"
    booking.paymentStatus = "refunded"
    await booking.save()

    // Restore flight seat availability (only for local flights)
    if (booking.flight && !booking.flightDetails?.isAmadeusBooking) {
      const flight = booking.flight
      flight.seats[booking.class].available += booking.passengers.length
      await flight.save()
    }

    res.status(200).json({
      success: true,
      message: "Booking cancelled successfully",
      data: booking,
    })
  } catch (error) {
    console.error("Cancel booking error:", error)
    res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

// @desc    Get all bookings (Admin only)
// @route   GET /api/bookings
// @access  Private/Admin
const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("flight", "flightNumber airline source destination departureDate")
      .populate("user", "name email")
      .sort({ bookingDate: -1 })

    // Process bookings to handle Amadeus bookings
    const processedBookings = bookings.map((booking) => {
      if (booking.flightDetails && !booking.flight) {
        return {
          ...booking.toObject(),
          flight: {
            flightNumber: booking.flightDetails.flightNumber,
            airline: booking.flightDetails.airline,
            source: booking.flightDetails.source,
            destination: booking.flightDetails.destination,
            departureDate: booking.flightDetails.departureDate,
            status: "scheduled",
          },
        }
      }
      return booking
    })

    res.status(200).json({
      success: true,
      count: processedBookings.length,
      data: processedBookings,
    })
  } catch (error) {
    console.error("Get all bookings error:", error)
    res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

module.exports = {
  createBooking,
  getMyBookings,
  getBooking,
  cancelBooking,
  getAllBookings,
}
