"use client"

import { useState } from "react"

const SeatSelection = ({ flightClass, totalSeats, bookedSeats = [], onSeatSelect, selectedSeats = [] }) => {
  const [hoveredSeat, setHoveredSeat] = useState(null)

  // Generate seat layout based on class
  const getSeatLayout = () => {
    switch (flightClass) {
      case "first":
        return { rows: Math.ceil(totalSeats / 4), seatsPerRow: 4, layout: "2-2" }
      case "business":
        return { rows: Math.ceil(totalSeats / 6), seatsPerRow: 6, layout: "2-2-2" }
      default: // economy
        return { rows: Math.ceil(totalSeats / 6), seatsPerRow: 6, layout: "3-3" }
    }
  }

  const { rows, seatsPerRow, layout } = getSeatLayout()

  const getSeatNumber = (row, seatIndex) => {
    const letters = ["A", "B", "C", "D", "E", "F"]
    return `${row + 1}${letters[seatIndex]}`
  }

  const isSeatBooked = (seatNumber) => bookedSeats.includes(seatNumber)
  const isSeatSelected = (seatNumber) => selectedSeats.includes(seatNumber)

  const handleSeatClick = (seatNumber) => {
    if (!isSeatBooked(seatNumber)) {
      onSeatSelect(seatNumber)
    }
  }

  const getSeatClass = (seatNumber) => {
    if (isSeatBooked(seatNumber)) {
      return "bg-red-500 text-white cursor-not-allowed"
    }
    if (isSeatSelected(seatNumber)) {
      return "bg-green-500 text-white cursor-pointer"
    }
    return "bg-gray-200 hover:bg-blue-200 cursor-pointer"
  }

  const renderSeatRow = (rowIndex) => {
    const seats = []
    const seatGroups = layout.split("-").map(Number)
    let seatIndex = 0

    seatGroups.forEach((groupSize, groupIndex) => {
      if (groupIndex > 0) {
        seats.push(<div key={`aisle-${rowIndex}-${groupIndex}`} className="w-8"></div>)
      }

      for (let i = 0; i < groupSize; i++) {
        if (seatIndex < seatsPerRow) {
          const seatNumber = getSeatNumber(rowIndex, seatIndex)
          seats.push(
            <button
              key={seatNumber}
              className={`w-8 h-8 m-1 rounded text-xs font-medium transition-colors ${getSeatClass(seatNumber)}`}
              onClick={() => handleSeatClick(seatNumber)}
              onMouseEnter={() => setHoveredSeat(seatNumber)}
              onMouseLeave={() => setHoveredSeat(null)}
              disabled={isSeatBooked(seatNumber)}
              title={`Seat ${seatNumber} ${isSeatBooked(seatNumber) ? "(Occupied)" : isSeatSelected(seatNumber) ? "(Selected)" : "(Available)"}`}
            >
              {seatNumber}
            </button>,
          )
          seatIndex++
        }
      }
    })

    return seats
  }

  return (
    <div className="bg-white rounded-lg p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-4">Select Your Seats</h3>

        {/* Legend */}
        <div className="flex items-center space-x-6 mb-4 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-gray-200 rounded"></div>
            <span>Available</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-green-500 rounded"></div>
            <span>Selected</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-red-500 rounded"></div>
            <span>Occupied</span>
          </div>
        </div>

        {/* Class info */}
        <div className="bg-gray-50 rounded-lg p-3 mb-4">
          <p className="text-sm text-gray-600">
            <span className="font-medium capitalize">{flightClass} Class</span> - Select{" "}
            {selectedSeats.length > 0 ? `${selectedSeats.length} seat(s)` : "your preferred seats"}
          </p>
        </div>
      </div>

      {/* Airplane layout */}
      <div className="bg-gray-50 rounded-lg p-4 max-w-md mx-auto">
        {/* Cockpit */}
        <div className="text-center mb-4">
          <div className="w-16 h-8 bg-gray-300 rounded-t-full mx-auto flex items-center justify-center">
            <span className="text-xs text-gray-600">✈</span>
          </div>
          <p className="text-xs text-gray-500 mt-1">Front</p>
        </div>

        {/* Seats */}
        <div className="space-y-2">
          {Array.from({ length: rows }, (_, rowIndex) => (
            <div key={rowIndex} className="flex items-center justify-center">
              <span className="text-xs text-gray-500 w-6 text-right mr-2">{rowIndex + 1}</span>
              <div className="flex items-center">{renderSeatRow(rowIndex)}</div>
            </div>
          ))}
        </div>

        {/* Wing indicators for economy */}
        {flightClass === "economy" && (
          <div className="flex justify-between items-center my-2 px-4">
            <div className="text-xs text-gray-500">Wing</div>
            <div className="text-xs text-gray-500">Wing</div>
          </div>
        )}
      </div>

      {/* Selected seats summary */}
      {selectedSeats.length > 0 && (
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h4 className="font-medium text-blue-900 mb-2">Selected Seats:</h4>
          <div className="flex flex-wrap gap-2">
            {selectedSeats.map((seat) => (
              <span key={seat} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                {seat}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default SeatSelection
