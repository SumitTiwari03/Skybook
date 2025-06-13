"use client"

import { useState, useEffect } from "react"
import { flightAPI } from "../services/api"
import { useAuth } from "../contexts/AuthContext"
import { toast } from "react-toastify"
import FlightSearch from "../components/flights/FlightSearch"
import FlightCard from "../components/flights/FlightCard"
import BookingModal from "../components/booking/BookingModal"

const Flights = () => {
  const [flights, setFlights] = useState([])
  const [loading, setLoading] = useState(false)
  const [searchPerformed, setSearchPerformed] = useState(false)
  const [searchParams, setSearchParams] = useState({})
  const [selectedClass, setSelectedClass] = useState("economy")
  const [sortBy, setSortBy] = useState("departureTime")
  const [sortOrder, setSortOrder] = useState("asc")
  const [selectedFlight, setSelectedFlight] = useState(null)
  const [showBookingModal, setShowBookingModal] = useState(false)
  const [hotspotFlights, setHotspotFlights] = useState([])
  const [hotspotLoading, setHotspotLoading] = useState(true)
  const [dataSource, setDataSource] = useState(null)

  const { isAuthenticated } = useAuth()

  useEffect(() => {
    // Load hotspot flights on component mount
    fetchHotspotFlights()
  }, [])

  const fetchHotspotFlights = async () => {
    try {
      setHotspotLoading(true)
      const response = await flightAPI.getPopularFlights()
      setHotspotFlights(response.data.data)
    } catch (error) {
      console.error("Failed to fetch hotspot flights", error)
      toast.error("Failed to load popular flights")
    } finally {
      setHotspotLoading(false)
    }
  }

  const handleSearch = async (params) => {
    setLoading(true)
    try {
      const searchQuery = {
        ...params,
        sortBy,
        sortOrder,
        class: selectedClass,
      }

      const response = await flightAPI.getFlights(searchQuery)
      setFlights(response.data.data)
      setSearchParams(params)
      setSearchPerformed(true)
      setDataSource(response.data.source)

      // Show success message with data source
      if (response.data.source === "amadeus") {
        toast.success(`Found ${response.data.count} real-time flights from Amadeus API`)
      } else {
        toast.info(`Showing ${response.data.count} flights from local database`)
      }
    } catch (error) {
      toast.error("Failed to search flights")
      console.error("Search error:", error)
    }
    setLoading(false)
  }

  const handleSort = (newSortBy) => {
    const newSortOrder = sortBy === newSortBy && sortOrder === "asc" ? "desc" : "asc"
    setSortBy(newSortBy)
    setSortOrder(newSortOrder)

    // Re-search with new sort parameters
    handleSearch(searchParams)
  }

  const handleClassChange = (newClass) => {
    setSelectedClass(newClass)
    // Re-search with new class
    handleSearch(searchParams)
  }

  const handleBookFlight = (flight) => {
    if (!isAuthenticated) {
      toast.error("Please login to book a flight")
      return
    }
    setSelectedFlight(flight)
    setShowBookingModal(true)
  }

  const handleBookingSuccess = (booking) => {
    toast.success(`Booking confirmed! Reference: ${booking.bookingReference}`)
    // Refresh flights to update seat availability
    handleSearch(searchParams)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <FlightSearch onSearch={handleSearch} loading={loading} />

      {/* Show flight results only if search was performed */}
      {searchPerformed ? (
        <>
          {/* Data source indicator */}
          {dataSource && (
            <div className="mb-4 p-3 rounded-lg bg-blue-50 border border-blue-200">
              <div className="flex items-center space-x-2">
                <span className="text-blue-600">{dataSource === "amadeus" ? "🌐" : "💾"}</span>
                <span className="text-sm text-blue-800">
                  {dataSource === "amadeus"
                    ? "Showing real-time flight data from Amadeus API"
                    : "Showing flights from local database"}
                </span>
              </div>
            </div>
          )}

          {/* Filters and Sort */}
          <div className="bg-white rounded-lg shadow-md p-4 mb-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center space-x-4">
                <span className="text-sm font-medium text-gray-700">Class:</span>
                <div className="flex space-x-2">
                  {["economy", "business", "first"].map((classType) => (
                    <button
                      key={classType}
                      onClick={() => handleClassChange(classType)}
                      className={`px-3 py-1 rounded-full text-sm font-medium transition-colors duration-200 ${
                        selectedClass === classType
                          ? "bg-primary-600 text-white"
                          : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                      }`}
                    >
                      {classType.charAt(0).toUpperCase() + classType.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <span className="text-sm font-medium text-gray-700">Sort by:</span>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleSort("departureTime")}
                    className={`px-3 py-1 rounded text-sm font-medium transition-colors duration-200 ${
                      sortBy === "departureTime"
                        ? "bg-primary-600 text-white"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                  >
                    Time {sortBy === "departureTime" && (sortOrder === "asc" ? "↑" : "↓")}
                  </button>
                  <button
                    onClick={() => handleSort("price")}
                    className={`px-3 py-1 rounded text-sm font-medium transition-colors duration-200 ${
                      sortBy === "price" ? "bg-primary-600 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                  >
                    Price {sortBy === "price" && (sortOrder === "asc" ? "↑" : "↓")}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Results */}
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="text-center">
                <div className="spinner mb-4"></div>
                <p className="text-gray-600">Searching for the best flights...</p>
                <p className="text-sm text-gray-500">This may take a few seconds</p>
              </div>
            </div>
          ) : flights.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <span className="text-4xl text-gray-400">✈</span>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No flights found</h3>
              <p className="text-gray-600 mb-4">Try adjusting your search criteria or search for a different date</p>
              <button
                onClick={() => setSearchPerformed(false)}
                className="text-primary-600 hover:text-primary-700 font-medium"
              >
                ← Back to search
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-900">
                  {flights.length} flight{flights.length !== 1 ? "s" : ""} found
                </h2>
                <button
                  onClick={() => setSearchPerformed(false)}
                  className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                >
                  ← New search
                </button>
              </div>

              {flights.map((flight, index) => (
                <FlightCard
                  key={flight._id || index}
                  flight={flight}
                  selectedClass={selectedClass}
                  onBook={handleBookFlight}
                />
              ))}
            </div>
          )}
        </>
      ) : (
        /* Show hotspot destinations when no search is performed */
        <div className="mt-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Popular Domestic Routes</h2>
            <p className="text-gray-600">Discover trending destinations across India</p>
          </div>

          {hotspotLoading ? (
            <div className="flex justify-center py-12">
              <div className="text-center">
                <div className="spinner mb-4"></div>
                <p className="text-gray-600">Loading popular flights...</p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {hotspotFlights.map((flight, index) => (
                <div
                  key={flight._id || index}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div className="p-4 border-b">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-semibold text-lg">{flight.airline}</h3>
                        <p className="text-sm text-gray-600">{flight.flightNumber}</p>
                        {flight.isAmadeusData && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 mt-1">
                            🌐 Live Data
                          </span>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-primary-600">₹{flight.price.economy}</p>
                        <p className="text-xs text-gray-500">Economy</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="flex justify-between items-center mb-4">
                      <div className="text-center">
                        <p className="text-sm text-gray-500">From</p>
                        <p className="font-medium">{flight.source}</p>
                        <p className="text-sm text-gray-600">{flight.departureTime}</p>
                      </div>
                      <div className="flex-1 px-4">
                        <div className="flex items-center justify-center">
                          <div className="h-px bg-gray-300 flex-1"></div>
                          <span className="mx-2 text-gray-400">✈</span>
                          <div className="h-px bg-gray-300 flex-1"></div>
                        </div>
                        <p className="text-xs text-center text-gray-500 mt-1">{flight.duration}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-gray-500">To</p>
                        <p className="font-medium">{flight.destination}</p>
                        <p className="text-sm text-gray-600">{flight.arrivalTime}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleBookFlight(flight)}
                      className="w-full bg-primary-600 hover:bg-primary-700 text-white py-2 rounded-md transition-colors"
                    >
                      Book Now
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Call to action */}
          <div className="text-center mt-12 p-8 bg-gradient-to-r from-primary-50 to-blue-50 rounded-lg">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Looking for specific flights?</h3>
            <p className="text-gray-600 mb-4">Search for flights between any Indian cities with real-time pricing</p>
            <button
              onClick={() => document.querySelector("form").scrollIntoView({ behavior: "smooth" })}
              className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Search Flights
            </button>
          </div>
        </div>
      )}

      {/* Booking Modal */}
      {showBookingModal && selectedFlight && (
        <BookingModal
          flight={selectedFlight}
          selectedClass={selectedClass}
          isOpen={showBookingModal}
          onClose={() => setShowBookingModal(false)}
          onBookingSuccess={handleBookingSuccess}
        />
      )}
    </div>
  )
}

export default Flights
