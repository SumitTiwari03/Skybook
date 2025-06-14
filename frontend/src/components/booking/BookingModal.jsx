"use client"

import { useState } from "react"
import { bookingAPI } from "../../services/api"
import { toast } from "react-toastify"
import SeatSelection from "./SeatSelection"

const BookingModal = ({ flight, selectedClass, isOpen, onClose, onBookingSuccess }) => {
  const [currentStep, setCurrentStep] = useState(1)
  const [passengers, setPassengers] = useState([{ name: "", age: "", gender: "male" }])
  const [selectedSeats, setSelectedSeats] = useState([])
  const [paymentMethod, setPaymentMethod] = useState("credit_card")
  const [loading, setLoading] = useState(false)
  const [processingPayment, setProcessingPayment] = useState(false)
  const [paymentCompleted, setPaymentCompleted] = useState(false)

  // Mock booked seats (in a real app, this would come from the API)
  const bookedSeats = ["1A", "1B", "2C", "3D", "4E", "5F"]

  const addPassenger = () => {
    setPassengers([...passengers, { name: "", age: "", gender: "male" }])
    setSelectedSeats([]) // Reset seat selection when passenger count changes
  }

  const removePassenger = (index) => {
    if (passengers.length > 1) {
      setPassengers(passengers.filter((_, i) => i !== index))
      setSelectedSeats([]) // Reset seat selection when passenger count changes
    }
  }

  const updatePassenger = (index, field, value) => {
    const updatedPassengers = passengers.map((passenger, i) =>
      i === index ? { ...passenger, [field]: value } : passenger,
    )
    setPassengers(updatedPassengers)
  }

  const handleSeatSelect = (seatNumber) => {
    if (selectedSeats.includes(seatNumber)) {
      setSelectedSeats(selectedSeats.filter((seat) => seat !== seatNumber))
    } else if (selectedSeats.length < passengers.length) {
      setSelectedSeats([...selectedSeats, seatNumber])
    } else {
      toast.warning(`You can only select ${passengers.length} seat(s)`)
    }
  }

  const handlePaymentProcess = async () => {
    setProcessingPayment(true)

    // Simulate payment processing (3-5 seconds)
    const processingTime = Math.random() * 2000 + 3000 // 3-5 seconds

    try {
      await new Promise((resolve) => setTimeout(resolve, processingTime))

      // Mock payment success/failure (90% success rate)
      const paymentSuccess = Math.random() > 0.1

      if (!paymentSuccess) {
        throw new Error("Payment failed. Please try again.")
      }

      setPaymentCompleted(true)
      toast.success("Payment processed successfully!")
    } catch (error) {
      toast.error(error.message)
      setProcessingPayment(false)
      return false
    }

    setProcessingPayment(false)
    return true
  }

  const handleBookingConfirmation = async () => {
    setLoading(true)

    try {
      // Assign seats to passengers
      const passengersWithSeats = passengers.map((passenger, index) => ({
        ...passenger,
        seatNumber: selectedSeats[index],
      }))

      // Prepare booking data with all required fields
      const bookingData = {
        flightId: flight._id,
        passengers: passengersWithSeats,
        class: selectedClass, // Use the dynamic selected class
        paymentMethod: paymentMethod, // Use the dynamic selected payment method
      }

      // Add flight details for Amadeus bookings
      if (flight.isAmadeusData) {
        bookingData.flightNumber = flight.flightNumber
        bookingData.airline = flight.airline
        bookingData.source = flight.source
        bookingData.destination = flight.destination
        bookingData.departureDate = flight.departureDate
        bookingData.departureTime = flight.departureTime
        bookingData.arrivalTime = flight.arrivalTime
        bookingData.price = flight.price
      }

      console.log("Sending booking data:", bookingData)

      const response = await bookingAPI.createBooking(bookingData)
      toast.success("Booking confirmed successfully!")
      onBookingSuccess(response.data.data)
      onClose()
      resetForm()
    } catch (error) {
      console.error("Booking error:", error)
      const errorMessage = error.response?.data?.message || "Booking failed. Please try again."
      toast.error(errorMessage)
    }

    setLoading(false)
  }

  const resetForm = () => {
    setCurrentStep(1)
    setPassengers([{ name: "", age: "", gender: "male" }])
    setSelectedSeats([])
    setPaymentMethod("credit_card")
    setProcessingPayment(false)
    setPaymentCompleted(false)
  }

  const nextStep = () => {
    if (currentStep === 1) {
      // Validate passenger details
      const isValid = passengers.every((p) => p.name.trim() && p.age && p.gender)
      if (!isValid) {
        toast.error("Please fill in all passenger details")
        return
      }
    }

    if (currentStep === 2) {
      // Validate seat selection
      if (selectedSeats.length !== passengers.length) {
        toast.error("Please select seats for all passengers")
        return
      }
    }

    setCurrentStep(currentStep + 1)
  }

  const prevStep = () => {
    setCurrentStep(currentStep - 1)
  }

  const totalPrice = flight.price[selectedClass] * passengers.length

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Book Your Flight</h2>
            <button
              onClick={() => {
                onClose()
                resetForm()
              }}
              className="text-gray-400 hover:text-gray-600 text-2xl"
              disabled={processingPayment}
            >
              ×
            </button>
          </div>

          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex items-center justify-center space-x-4">
              {[1, 2, 3].map((step) => (
                <div key={step} className="flex items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      currentStep >= step ? "bg-primary-600 text-white" : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    {step === 3 && paymentCompleted ? "✓" : step}
                  </div>
                  <span className={`ml-2 text-sm ${currentStep >= step ? "text-primary-600" : "text-gray-500"}`}>
                    {step === 1 ? "Passengers" : step === 2 ? "Seats" : "Payment"}
                  </span>
                  {step < 3 && <div className="w-8 h-px bg-gray-300 mx-4"></div>}
                </div>
              ))}
            </div>
          </div>

          {/* Flight Details */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-lg mb-2">
              {flight.airline} - {flight.flightNumber}
            </h3>
            {flight.isAmadeusData && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 mb-2">
                🌐 Live Data
              </span>
            )}
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-600">
                  From: <span className="font-medium">{flight.source}</span>
                </p>
                <p className="text-gray-600">
                  Departure: <span className="font-medium">{flight.departureTime}</span>
                </p>
              </div>
              <div>
                <p className="text-gray-600">
                  To: <span className="font-medium">{flight.destination}</span>
                </p>
                <p className="text-gray-600">
                  Arrival: <span className="font-medium">{flight.arrivalTime}</span>
                </p>
              </div>
            </div>
            <p className="text-gray-600 mt-2">
              Class: <span className="font-medium capitalize">{selectedClass}</span> | Price:{" "}
              <span className="font-medium">₹{flight.price[selectedClass]} per person</span>
            </p>
          </div>

          {/* Step 1: Passenger Details */}
          {currentStep === 1 && (
            <div className="mb-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Passenger Details</h3>
                <button type="button" onClick={addPassenger} className="btn-secondary text-sm">
                  Add Passenger
                </button>
              </div>

              {passengers.map((passenger, index) => (
                <div key={index} className="border rounded-lg p-4 mb-4">
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="font-medium">Passenger {index + 1}</h4>
                    {passengers.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removePassenger(index)}
                        className="text-red-600 hover:text-red-800 text-sm"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                      <input
                        type="text"
                        required
                        className="input-field"
                        value={passenger.name}
                        onChange={(e) => updatePassenger(index, "name", e.target.value)}
                        placeholder="Enter full name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
                      <input
                        type="number"
                        required
                        min="1"
                        max="120"
                        className="input-field"
                        value={passenger.age}
                        onChange={(e) => updatePassenger(index, "age", e.target.value)}
                        placeholder="Age"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                      <select
                        className="input-field"
                        value={passenger.gender}
                        onChange={(e) => updatePassenger(index, "gender", e.target.value)}
                      >
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Step 2: Seat Selection */}
          {currentStep === 2 && (
            <div className="mb-6">
              <SeatSelection
                flightClass={selectedClass}
                totalSeats={flight.seats[selectedClass].total}
                bookedSeats={bookedSeats}
                selectedSeats={selectedSeats}
                onSeatSelect={handleSeatSelect}
              />
              <div className="mt-4 p-4 bg-yellow-50 rounded-lg">
                <p className="text-sm text-yellow-800">
                  Please select {passengers.length} seat(s) for your passenger(s). Selected: {selectedSeats.length}/
                  {passengers.length}
                </p>
              </div>
            </div>
          )}

          {/* Step 3: Payment Method */}
          {currentStep === 3 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-4">Payment & Confirmation</h3>

              {!paymentCompleted ? (
                <>
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    {[
                      { value: "credit_card", label: "Credit Card", icon: "💳" },
                      { value: "debit_card", label: "Debit Card", icon: "💳" },
                      { value: "upi", label: "UPI", icon: "📱" },
                      { value: "net_banking", label: "Net Banking", icon: "🏦" },
                      { value: "paypal", label: "PayPal", icon: "🅿️" },
                      { value: "bank_transfer", label: "Bank Transfer", icon: "🏛️" },
                    ].map((method) => (
                      <label
                        key={method.value}
                        className={`flex items-center space-x-3 cursor-pointer p-4 border rounded-lg hover:bg-gray-50 transition-colors ${
                          paymentMethod === method.value ? "border-primary-500 bg-primary-50" : "border-gray-200"
                        }`}
                      >
                        <input
                          type="radio"
                          name="paymentMethod"
                          value={method.value}
                          checked={paymentMethod === method.value}
                          onChange={(e) => setPaymentMethod(e.target.value)}
                          className="text-primary-600"
                          disabled={processingPayment}
                        />
                        <span className="text-xl">{method.icon}</span>
                        <span className="font-medium">{method.label}</span>
                      </label>
                    ))}
                  </div>

                  {/* Payment Processing */}
                  {processingPayment && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                      <div className="flex items-center space-x-3">
                        <div className="spinner"></div>
                        <div>
                          <p className="font-medium text-blue-900">Processing Payment...</p>
                          <p className="text-sm text-blue-700">Please wait while we process your payment securely.</p>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">✅</span>
                    <div>
                      <p className="font-medium text-green-900">Payment Successful!</p>
                      <p className="text-sm text-green-700">Your payment has been processed successfully.</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Booking Summary */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold mb-3">Booking Summary</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Flight:</span>
                    <span>
                      {flight.airline} {flight.flightNumber}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Route:</span>
                    <span>
                      {flight.source} → {flight.destination}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Passengers:</span>
                    <span>{passengers.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Class:</span>
                    <span className="capitalize">{selectedClass}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Seats:</span>
                    <span>{selectedSeats.join(", ")}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Payment Method:</span>
                    <span className="capitalize">{paymentMethod.replace("_", " ")}</span>
                  </div>
                  <div className="border-t pt-2 flex justify-between font-semibold">
                    <span>Total:</span>
                    <span>₹{totalPrice}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between">
            <div>
              {currentStep > 1 && !processingPayment && (
                <button type="button" onClick={prevStep} className="btn-secondary">
                  Previous
                </button>
              )}
            </div>

            <div className="flex space-x-4">
              {!processingPayment && !paymentCompleted && (
                <button
                  type="button"
                  onClick={() => {
                    onClose()
                    resetForm()
                  }}
                  className="btn-secondary"
                >
                  Cancel
                </button>
              )}

              {currentStep < 3 ? (
                <button type="button" onClick={nextStep} className="btn-primary">
                  Next
                </button>
              ) : !paymentCompleted ? (
                <button
                  type="button"
                  onClick={handlePaymentProcess}
                  disabled={processingPayment}
                  className="btn-primary"
                >
                  {processingPayment ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="spinner"></div>
                      <span>Processing...</span>
                    </div>
                  ) : (
                    `Pay ₹${totalPrice}`
                  )}
                </button>
              ) : (
                <button type="button" onClick={handleBookingConfirmation} disabled={loading} className="btn-primary">
                  {loading ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="spinner"></div>
                      <span>Confirming...</span>
                    </div>
                  ) : (
                    "Confirm Booking"
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BookingModal
