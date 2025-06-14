"use client"

const FlightCard = ({ flight, selectedClass, onBook }) => {
  const formatTime = (time) => {
    return new Date(`2000-01-01T${time}`).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    })
  }

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const price = flight.price[selectedClass]
  const availableSeats = flight.seats[selectedClass].available

  return (
    <div className="card p-6 hover:shadow-lg transition-shadow duration-200">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{flight.airline}</h3>
          <p className="text-sm text-gray-600">{flight.flightNumber}</p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-primary-600">₹{price}</p>
          <p className="text-sm text-gray-600">per person</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-4">
        <div>
          <p className="text-sm text-gray-600">From</p>
          <p className="font-semibold">{flight.source}</p>
          <p className="text-sm text-gray-600">{formatTime(flight.departureTime)}</p>
        </div>
        <div className="text-center">
          <p className="text-sm text-gray-600">Duration</p>
          <p className="font-semibold">{flight.duration}</p>
          <div className="flex items-center justify-center mt-1">
            <div className="w-8 h-px bg-gray-300"></div>
            <span className="mx-2 text-gray-400">✈</span>
            <div className="w-8 h-px bg-gray-300"></div>
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-600">To</p>
          <p className="font-semibold">{flight.destination}</p>
          <p className="text-sm text-gray-600">{formatTime(flight.arrivalTime)}</p>
        </div>
      </div>

      <div className="flex justify-between items-center mb-4">
        <div>
          <p className="text-sm text-gray-600">Date</p>
          <p className="font-medium">{formatDate(flight.departureDate)}</p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Available Seats</p>
          <p className="font-medium">{availableSeats} seats</p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Status</p>
          <span
            className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
              flight.status === "scheduled"
                ? "bg-green-100 text-green-800"
                : flight.status === "delayed"
                  ? "bg-yellow-100 text-yellow-800"
                  : flight.status === "cancelled"
                    ? "bg-red-100 text-red-800"
                    : "bg-gray-100 text-gray-800"
            }`}
          >
            {flight.status.charAt(0).toUpperCase() + flight.status.slice(1)}
          </span>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <div className="text-sm text-gray-600">
          Class: <span className="font-medium capitalize">{selectedClass}</span>
        </div>
        <button
          onClick={() => onBook(flight)}
          disabled={availableSeats === 0 || flight.status !== "scheduled"}
          className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {availableSeats === 0 ? "Sold Out" : "Book Now"}
        </button>
      </div>
    </div>
  )
}

export default FlightCard
