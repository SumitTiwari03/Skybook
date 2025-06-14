const Flight = require("../models/Flight")
const amadeusService = require("../services/amadeusService")

// @desc    Get all flights with search and filters
// @route   GET /api/flights
// @access  Public
const getFlights = async (req, res) => {
  try {
    const { source, destination, date, class: flightClass, sortBy, sortOrder, useAmadeus } = req.query

    let flights = []

    // If search parameters are provided and useAmadeus is true, try Amadeus API first
    if (source && destination && date && useAmadeus !== "false") {
      try {
        console.log("Searching flights via Amadeus API...")
        const amadeusFlights = await amadeusService.searchFlights({
          source,
          destination,
          date,
          class: flightClass,
        })

        if (amadeusFlights.length > 0) {
          flights = amadeusFlights
          console.log(`Found ${flights.length} flights from Amadeus API`)
        } else {
          console.log("No flights found from Amadeus API, falling back to local data")
        }
      } catch (error) {
        console.error("Amadeus API error:", error.message)
        console.log("Falling back to local database")
      }
    }

    // If no Amadeus results or API failed, use local database
    if (flights.length === 0) {
      const query = {}

      if (source) {
        query.source = { $regex: source, $options: "i" }
      }

      if (destination) {
        query.destination = { $regex: destination, $options: "i" }
      }

      if (date) {
        const searchDate = new Date(date)
        const nextDay = new Date(searchDate)
        nextDay.setDate(nextDay.getDate() + 1)

        query.departureDate = {
          $gte: searchDate,
          $lt: nextDay,
        }
      }

      // Build sort object
      const sort = {}
      if (sortBy) {
        const order = sortOrder === "desc" ? -1 : 1
        if (sortBy === "price" && flightClass) {
          sort[`price.${flightClass}`] = order
        } else if (sortBy === "departureTime") {
          sort.departureTime = order
        } else {
          sort[sortBy] = order
        }
      } else {
        sort.departureDate = 1 // Default sort by departure date
      }

      flights = await Flight.find(query).sort(sort)
      console.log(`Found ${flights.length} flights from local database`)
    }

    // Apply client-side sorting if needed for Amadeus data
    if (flights.length > 0 && flights[0].isAmadeusData && sortBy) {
      flights.sort((a, b) => {
        let aValue, bValue

        if (sortBy === "price" && flightClass) {
          aValue = a.price[flightClass]
          bValue = b.price[flightClass]
        } else if (sortBy === "departureTime") {
          aValue = a.departureTime
          bValue = b.departureTime
        } else {
          aValue = a[sortBy]
          bValue = b[sortBy]
        }

        if (sortOrder === "desc") {
          return bValue > aValue ? 1 : -1
        } else {
          return aValue > bValue ? 1 : -1
        }
      })
    }

    res.status(200).json({
      success: true,
      count: flights.length,
      data: flights,
      source: flights.length > 0 && flights[0].isAmadeusData ? "amadeus" : "local",
    })
  } catch (error) {
    console.error("Error in getFlights:", error)
    res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

// @desc    Get single flight
// @route   GET /api/flights/:id
// @access  Public
const getFlight = async (req, res) => {
  try {
    const flight = await Flight.findById(req.params.id)

    if (!flight) {
      return res.status(404).json({
        success: false,
        message: "Flight not found",
      })
    }

    res.status(200).json({
      success: true,
      data: flight,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

// @desc    Get popular routes (hotspot flights)
// @route   GET /api/flights/popular
// @access  Public
const getPopularFlights = async (req, res) => {
  try {
    // Get a mix of popular routes from local database
    const popularRoutes = [
      { source: "Delhi", destination: "Mumbai" },
      { source: "Mumbai", destination: "Bangalore" },
      { source: "Delhi", destination: "Bangalore" },
      { source: "Chennai", destination: "Delhi" },
      { source: "Kolkata", destination: "Mumbai" },
      { source: "Hyderabad", destination: "Bangalore" },
    ]

    let allPopularFlights = []

    // Try to get some flights from each popular route
    for (const route of popularRoutes) {
      try {
        // Try Amadeus API first for current date + 1 day
        const tomorrow = new Date()
        tomorrow.setDate(tomorrow.getDate() + 1)
        const dateStr = tomorrow.toISOString().split("T")[0]

        const amadeusFlights = await amadeusService.searchFlights({
          source: route.source,
          destination: route.destination,
          date: dateStr,
          class: "economy",
        })

        if (amadeusFlights.length > 0) {
          allPopularFlights.push(amadeusFlights[0]) // Take first flight from each route
        }
      } catch (error) {
        console.log(`Amadeus API failed for ${route.source}-${route.destination}, using local data`)
      }
    }

    // If we don't have enough from Amadeus, supplement with local data
    if (allPopularFlights.length < 6) {
      const localFlights = await Flight.find({})
        .sort({ departureDate: 1 })
        .limit(6 - allPopularFlights.length)

      allPopularFlights = [...allPopularFlights, ...localFlights]
    }

    // Shuffle and limit to 6
    const shuffled = allPopularFlights.sort(() => 0.5 - Math.random()).slice(0, 6)

    res.status(200).json({
      success: true,
      count: shuffled.length,
      data: shuffled,
    })
  } catch (error) {
    console.error("Error getting popular flights:", error)
    res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

// @desc    Create new flight
// @route   POST /api/flights
// @access  Private/Admin
const createFlight = async (req, res) => {
  try {
    const flight = await Flight.create(req.body)

    res.status(201).json({
      success: true,
      message: "Flight created successfully",
      data: flight,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

// @desc    Update flight
// @route   PUT /api/flights/:id
// @access  Private/Admin
const updateFlight = async (req, res) => {
  try {
    const flight = await Flight.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })

    if (!flight) {
      return res.status(404).json({
        success: false,
        message: "Flight not found",
      })
    }

    res.status(200).json({
      success: true,
      message: "Flight updated successfully",
      data: flight,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

// @desc    Delete flight
// @route   DELETE /api/flights/:id
// @access  Private/Admin
const deleteFlight = async (req, res) => {
  try {
    const flight = await Flight.findByIdAndDelete(req.params.id)

    if (!flight) {
      return res.status(404).json({
        success: false,
        message: "Flight not found",
      })
    }

    res.status(200).json({
      success: true,
      message: "Flight deleted successfully",
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

module.exports = {
  getFlights,
  getFlight,
  getPopularFlights,
  createFlight,
  updateFlight,
  deleteFlight,
}
