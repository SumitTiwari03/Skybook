"use client"

import { useState } from "react"

const FlightSearch = ({ onSearch, loading }) => {
  const [searchData, setSearchData] = useState({
    source: "",
    destination: "",
    date: "",
    class: "economy",
  })

  const handleChange = (e) => {
    setSearchData({
      ...searchData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSearch(searchData)
  }

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

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Search Flights</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label htmlFor="source" className="block text-sm font-medium text-gray-700 mb-1">
              From
            </label>
            <select
              id="source"
              name="source"
              required
              className="input-field"
              value={searchData.source}
              onChange={handleChange}
            >
              <option value="">Select departure city</option>
              {indianCities.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="destination" className="block text-sm font-medium text-gray-700 mb-1">
              To
            </label>
            <select
              id="destination"
              name="destination"
              required
              className="input-field"
              value={searchData.destination}
              onChange={handleChange}
            >
              <option value="">Select destination city</option>
              {indianCities.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
              Departure Date
            </label>
            <input
              id="date"
              name="date"
              type="date"
              required
              className="input-field"
              value={searchData.date}
              onChange={handleChange}
              min={new Date().toISOString().split("T")[0]}
            />
          </div>

          <div>
            <label htmlFor="class" className="block text-sm font-medium text-gray-700 mb-1">
              Class
            </label>
            <select id="class" name="class" className="input-field" value={searchData.class} onChange={handleChange}>
              <option value="economy">Economy</option>
              <option value="business">Business</option>
              <option value="first">First Class</option>
            </select>
          </div>
        </div>

        <div className="flex justify-center">
          <button type="submit" disabled={loading} className="btn-primary px-8 py-3">
            {loading ? (
              <div className="flex items-center space-x-2">
                <div className="spinner"></div>
                <span>Searching...</span>
              </div>
            ) : (
              "Search Flights"
            )}
          </button>
        </div>
      </form>
    </div>
  )
}

export default FlightSearch
