"use client"

import { useState, useEffect } from "react"
import { flightAPI } from "../../services/api"
import { toast } from "react-toastify"

const FlightManagement = () => {
  const [flights, setFlights] = useState([])
  const [loading, setLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [currentFlight, setCurrentFlight] = useState(null)
  const [formData, setFormData] = useState({
    flightNumber: "",
    airline: "",
    source: "",
    destination: "",
    departureDate: "",
    departureTime: "",
    arrivalTime: "",
    duration: "",
    price: {
      economy: "",
      business: "",
      first: "",
    },
    seats: {
      economy: { total: "", available: "" },
      business: { total: "", available: "" },
      first: { total: "", available: "" },
    },
    status: "scheduled",
  })

  const indianCities = [
    "Delhi",
    "Mumbai",
    "Bangalore",
    "Chennai",
    "Kolkata",
    "Hyderabad",
    "Pune",
    "Jaipur",
    "Ahmedabad",
    "Goa",
    "Kochi",
    "Lucknow",
    "Chandigarh",
    "Bhubaneswar",
    "Guwahati",
  ]

  const airlines = ["Air India", "IndiGo", "SpiceJet", "Vistara", "GoAir", "AirAsia India", "Jet Airways"]

  useEffect(() => {
    fetchFlights()
  }, [])

  const fetchFlights = async () => {
    try {
      setLoading(true)
      const response = await flightAPI.getFlights({ useAmadeus: false }) // Only local flights for admin
      setFlights(response.data.data)
    } catch (error) {
      toast.error("Failed to fetch flights")
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target

    if (name.includes(".")) {
      const [parent, child, grandchild] = name.split(".")
      if (grandchild) {
        setFormData({
          ...formData,
          [parent]: {
            ...formData[parent],
            [child]: {
              ...formData[parent][child],
              [grandchild]: value,
            },
          },
        })
      } else {
        setFormData({
          ...formData,
          [parent]: {
            ...formData[parent],
            [child]: value,
          },
        })
      }
    } else {
      setFormData({
        ...formData,
        [name]: value,
      })
    }
  }

  const resetForm = () => {
    setFormData({
      flightNumber: "",
      airline: "",
      source: "",
      destination: "",
      departureDate: "",
      departureTime: "",
      arrivalTime: "",
      duration: "",
      price: {
        economy: "",
        business: "",
        first: "",
      },
      seats: {
        economy: { total: "", available: "" },
        business: { total: "", available: "" },
        first: { total: "", available: "" },
      },
      status: "scheduled",
    })
    setIsEditing(false)
    setCurrentFlight(null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      // Convert string numbers to actual numbers
      const processedData = {
        ...formData,
        price: {
          economy: Number(formData.price.economy),
          business: Number(formData.price.business),
          first: Number(formData.price.first),
        },
        seats: {
          economy: {
            total: Number(formData.seats.economy.total),
            available: Number(formData.seats.economy.available),
          },
          business: {
            total: Number(formData.seats.business.total),
            available: Number(formData.seats.business.available),
          },
          first: {
            total: Number(formData.seats.first.total),
            available: Number(formData.seats.first.available),
          },
        },
        departureDate: new Date(formData.departureDate),
      }

      if (isEditing && currentFlight) {
        await flightAPI.updateFlight(currentFlight._id, processedData)
        toast.success("Flight updated successfully")
      } else {
        await flightAPI.createFlight(processedData)
        toast.success("Flight created successfully")
      }

      resetForm()
      fetchFlights()
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to save flight")
    }
  }

  const handleEdit = (flight) => {
    setIsEditing(true)
    setCurrentFlight(flight)
    setFormData({
      flightNumber: flight.flightNumber,
      airline: flight.airline,
      source: flight.source,
      destination: flight.destination,
      departureDate: new Date(flight.departureDate).toISOString().split("T")[0],
      departureTime: flight.departureTime,
      arrivalTime: flight.arrivalTime,
      duration: flight.duration,
      price: {
        economy: flight.price.economy.toString(),
        business: flight.price.business.toString(),
        first: flight.price.first.toString(),
      },
      seats: {
        economy: {
          total: flight.seats.economy.total.toString(),
          available: flight.seats.economy.available.toString(),
        },
        business: {
          total: flight.seats.business.total.toString(),
          available: flight.seats.business.available.toString(),
        },
        first: {
          total: flight.seats.first.total.toString(),
          available: flight.seats.first.available.toString(),
        },
      },
      status: flight.status,
    })
  }

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this flight?")) {
      try {
        await flightAPI.deleteFlight(id)
        toast.success("Flight deleted successfully")
        fetchFlights()
      } catch (error) {
        toast.error("Failed to delete flight")
      }
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="spinner"></div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">{isEditing ? "Edit Flight" : "Add New Flight"}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Flight Number</label>
              <input
                type="text"
                name="flightNumber"
                required
                className="input-field"
                value={formData.flightNumber}
                onChange={handleInputChange}
                placeholder="e.g. AI101"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Airline</label>
              <select
                name="airline"
                required
                className="input-field"
                value={formData.airline}
                onChange={handleInputChange}
              >
                <option value="">Select Airline</option>
                {airlines.map((airline) => (
                  <option key={airline} value={airline}>
                    {airline}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select name="status" className="input-field" value={formData.status} onChange={handleInputChange}>
                <option value="scheduled">Scheduled</option>
                <option value="delayed">Delayed</option>
                <option value="cancelled">Cancelled</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Source</label>
              <select
                name="source"
                required
                className="input-field"
                value={formData.source}
                onChange={handleInputChange}
              >
                <option value="">Select Source City</option>
                {indianCities.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Destination</label>
              <select
                name="destination"
                required
                className="input-field"
                value={formData.destination}
                onChange={handleInputChange}
              >
                <option value="">Select Destination City</option>
                {indianCities.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Departure Date</label>
              <input
                type="date"
                name="departureDate"
                required
                className="input-field"
                value={formData.departureDate}
                onChange={handleInputChange}
                min={new Date().toISOString().split("T")[0]}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Departure Time</label>
              <input
                type="time"
                name="departureTime"
                required
                className="input-field"
                value={formData.departureTime}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Arrival Time</label>
              <input
                type="time"
                name="arrivalTime"
                required
                className="input-field"
                value={formData.arrivalTime}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
              <input
                type="text"
                name="duration"
                required
                className="input-field"
                value={formData.duration}
                onChange={handleInputChange}
                placeholder="e.g. 2h 30m"
              />
            </div>
          </div>

          {/* Pricing */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-3">Pricing (₹)</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Economy</label>
                <input
                  type="number"
                  name="price.economy"
                  required
                  className="input-field"
                  value={formData.price.economy}
                  onChange={handleInputChange}
                  placeholder="5000"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Business</label>
                <input
                  type="number"
                  name="price.business"
                  required
                  className="input-field"
                  value={formData.price.business}
                  onChange={handleInputChange}
                  placeholder="12000"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">First Class</label>
                <input
                  type="number"
                  name="price.first"
                  required
                  className="input-field"
                  value={formData.price.first}
                  onChange={handleInputChange}
                  placeholder="20000"
                />
              </div>
            </div>
          </div>

          {/* Seat Configuration */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-3">Seat Configuration</h3>
            <div className="space-y-4">
              {["economy", "business", "first"].map((classType) => (
                <div key={classType} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {classType.charAt(0).toUpperCase() + classType.slice(1)} - Total Seats
                    </label>
                    <input
                      type="number"
                      name={`seats.${classType}.total`}
                      required
                      className="input-field"
                      value={formData.seats[classType].total}
                      onChange={handleInputChange}
                      placeholder="150"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {classType.charAt(0).toUpperCase() + classType.slice(1)} - Available Seats
                    </label>
                    <input
                      type="number"
                      name={`seats.${classType}.available`}
                      required
                      className="input-field"
                      value={formData.seats[classType].available}
                      onChange={handleInputChange}
                      placeholder="120"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex space-x-4">
            <button type="submit" className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-md">
              {isEditing ? "Update Flight" : "Create Flight"}
            </button>
            {isEditing && (
              <button
                type="button"
                onClick={resetForm}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-6 py-2 rounded-md"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">All Flights</h2>
        {flights.length === 0 ? (
          <p className="text-gray-500">No flights found. Create your first flight above.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Flight
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Route
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date & Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price (₹)
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {flights.map((flight) => (
                  <tr key={flight._id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{flight.flightNumber}</div>
                      <div className="text-sm text-gray-500">{flight.airline}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {flight.source} → {flight.destination}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div>{new Date(flight.departureDate).toLocaleDateString()}</div>
                      <div>
                        {flight.departureTime} - {flight.arrivalTime}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div>E: ₹{flight.price.economy}</div>
                      <div>B: ₹{flight.price.business}</div>
                      <div>F: ₹{flight.price.first}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          flight.status === "scheduled"
                            ? "bg-green-100 text-green-800"
                            : flight.status === "delayed"
                              ? "bg-yellow-100 text-yellow-800"
                              : flight.status === "cancelled"
                                ? "bg-red-100 text-red-800"
                                : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {flight.status.charAt(0).toUpperCase() + flight.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button onClick={() => handleEdit(flight)} className="text-indigo-600 hover:text-indigo-900 mr-4">
                        Edit
                      </button>
                      <button onClick={() => handleDelete(flight._id)} className="text-red-600 hover:text-red-900">
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

export default FlightManagement