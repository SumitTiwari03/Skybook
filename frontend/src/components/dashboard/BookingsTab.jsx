"use client"

const BookingsTab = ({ bookings, title, emptyMessage, emptyDescription, onCancelBooking, showCancelButton }) => {
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const formatTime = (time) => {
    return new Date(`2000-01-01T${time}`).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    })
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      case "completed":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getFlightStatusColor = (status) => {
    switch (status) {
      case "scheduled":
        return "bg-green-100 text-green-800"
      case "delayed":
        return "bg-yellow-100 text-yellow-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      case "completed":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const downloadTicketPDF = async (booking) => {
    try {
      // Dynamic import of jsPDF
      const { jsPDF } = await import("jspdf")

      const doc = new jsPDF()

      // Set colors
      const primaryColor = [37, 99, 235] // Blue
      const secondaryColor = [75, 85, 99] // Gray
      const accentColor = [16, 185, 129] // Green

      // Header
      doc.setFillColor(...primaryColor)
      doc.rect(0, 0, 210, 40, "F")

      // Logo and title
      doc.setTextColor(255, 255, 255)
      doc.setFontSize(24)
      doc.setFont("helvetica", "bold")
      doc.text("✈ SKYBOOK AIRLINES", 20, 20)
      doc.setFontSize(14)
      doc.setFont("helvetica", "normal")
      doc.text("E-TICKET CONFIRMATION", 20, 30)

      // Reset text color
      doc.setTextColor(0, 0, 0)

      // Booking Reference Box
      doc.setFillColor(245, 245, 245)
      doc.rect(20, 50, 170, 20, "F")
      doc.setFontSize(16)
      doc.setFont("helvetica", "bold")
      doc.text("Booking Reference: " + booking.bookingReference, 25, 63)

      // Flight Information
      let yPos = 85
      doc.setFontSize(14)
      doc.setFont("helvetica", "bold")
      doc.text("FLIGHT INFORMATION", 20, yPos)

      yPos += 10
      doc.setFontSize(11)
      doc.setFont("helvetica", "normal")
      doc.text("Flight:", 20, yPos)
      doc.text(booking.flight.airline + " - " + booking.flight.flightNumber, 60, yPos)

      yPos += 8
      doc.text("Route:", 20, yPos)
      doc.text(booking.flight.source + " → " + booking.flight.destination, 60, yPos)

      yPos += 8
      doc.text("Date:", 20, yPos)
      doc.text(formatDate(booking.flight.departureDate), 60, yPos)

      yPos += 8
      doc.text("Departure:", 20, yPos)
      doc.text(booking.flight.departureTime, 60, yPos)
      doc.text("Arrival:", 120, yPos)
      doc.text(booking.flight.arrivalTime, 150, yPos)

      // Passenger Information
      yPos += 20
      doc.setFontSize(14)
      doc.setFont("helvetica", "bold")
      doc.text("PASSENGER INFORMATION", 20, yPos)

      yPos += 10
      doc.setFontSize(11)
      doc.setFont("helvetica", "normal")
      booking.passengers.forEach((passenger, index) => {
        doc.text(`${index + 1}. ${passenger.name} (${passenger.age} years, ${passenger.gender})`, 20, yPos)
        doc.text(`Seat: ${passenger.seatNumber}`, 150, yPos)
        yPos += 8
      })

      // Payment Information
      yPos += 10
      doc.setFontSize(14)
      doc.setFont("helvetica", "bold")
      doc.text("PAYMENT INFORMATION", 20, yPos)

      yPos += 10
      doc.setFontSize(11)
      doc.setFont("helvetica", "normal")
      doc.text("Class:", 20, yPos)
      doc.text(booking.class.toUpperCase(), 60, yPos)

      yPos += 8
      doc.text("Total Amount:", 20, yPos)
      doc.setFont("helvetica", "bold")
      doc.text("₹" + booking.totalPrice, 60, yPos)
      doc.setFont("helvetica", "normal")

      yPos += 8
      doc.text("Payment Method:", 20, yPos)
      doc.text(booking.paymentMethod.replace("_", " ").toUpperCase(), 60, yPos)
      doc.text("Status:", 120, yPos)
      doc.text(booking.paymentStatus.toUpperCase(), 150, yPos)

      // QR Code placeholder
      yPos += 20
      doc.setFillColor(240, 240, 240)
      doc.rect(20, yPos, 30, 30, "F")
      doc.setFontSize(8)
      doc.text("QR CODE", 28, yPos + 18)

      // Important Notes
      yPos += 40
      doc.setFillColor(255, 243, 205)
      doc.rect(20, yPos, 170, 40, "F")
      doc.setFontSize(12)
      doc.setFont("helvetica", "bold")
      doc.text("IMPORTANT NOTES:", 25, yPos + 8)

      doc.setFontSize(9)
      doc.setFont("helvetica", "normal")
      doc.text("• Please arrive at airport 2 hours before departure", 25, yPos + 16)
      doc.text("• Carry valid photo ID for verification", 25, yPos + 22)
      doc.text("• Check-in opens 24 hours before departure", 25, yPos + 28)
      doc.text("• Baggage allowance: 15kg (Economy), 25kg (Business/First)", 25, yPos + 34)

      // Footer
      yPos += 50
      doc.setFillColor(...primaryColor)
      doc.rect(0, yPos, 210, 25, "F")
      doc.setTextColor(255, 255, 255)
      doc.setFontSize(10)
      doc.text("Thank you for choosing SkyBook!", 20, yPos + 8)
      doc.text("For support: support@skybook.com | +91-1800-123-4567", 20, yPos + 16)

      // Save the PDF
      doc.save(`SkyBook_Ticket_${booking.bookingReference}.pdf`)
    } catch (error) {
      console.error("Error generating PDF:", error)
      // Fallback to HTML download
      downloadTicketHTML(booking)
    }
  }

  const downloadTicket = (booking) => {
    // Create ticket content
    const ticketContent = `
╔══════════════════════════════════════════════════════════════╗
║                        SKYBOOK AIRLINES                      ║
║                      E-TICKET CONFIRMATION                   ║
╠══════════════════════════════════════════════════════════════╣
║                                                              ║
║ Booking Reference: ${booking.bookingReference}                           ║
║ Flight: ${booking.flight.airline} - ${booking.flight.flightNumber}                    ║
║                                                              ║
║ Route: ${booking.flight.source} → ${booking.flight.destination}                      ║
║ Date: ${formatDate(booking.flight.departureDate)}                    ║
║ Departure: ${booking.flight.departureTime} | Arrival: ${booking.flight.arrivalTime}           ║
║                                                              ║
║ Class: ${booking.class.toUpperCase()}                                    ║
║ Total Amount: ₹${booking.totalPrice}                                ║
║ Payment: ${booking.paymentMethod.replace("_", " ").toUpperCase()} - ${booking.paymentStatus.toUpperCase()}    ║
║                                                              ║
║ PASSENGERS:                                                  ║
${booking.passengers
  .map(
    (passenger, index) =>
      `║ ${index + 1}. ${passenger.name} (${passenger.age}yrs, ${passenger.gender}) - Seat ${passenger.seatNumber}    ║`,
  )
  .join("\n")}
║                                                              ║
║ Status: ${booking.bookingStatus.toUpperCase()}                              ║
║ Booked on: ${new Date(booking.bookingDate).toLocaleDateString()}                     ║
║                                                              ║
║ Important Notes:                                             ║
║ • Please arrive at airport 2 hours before departure         ║
║ • Carry valid photo ID for verification                     ║
║ • Check-in opens 24 hours before departure                  ║
║ • Baggage allowance: 15kg (Economy), 25kg (Business/First)  ║
║                                                              ║
║ Thank you for choosing SkyBook!                             ║
║ For support: support@skybook.com | +91-1800-123-4567       ║
╚══════════════════════════════════════════════════════════════╝
    `

    // Create and download file
    const blob = new Blob([ticketContent], { type: "text/plain" })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `SkyBook_Ticket_${booking.bookingReference}.txt`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
  }

  const downloadTicketHTML = (booking) => {
    // Create HTML content for PDF-style ticket
    const ticketHTML = `
    <!DOCTYPE html>
    <html>
    <head>
        <title>SkyBook E-Ticket - ${booking.bookingReference}</title>
        <style>
            body { font-family: Arial, sans-serif; margin: 20px; background: #f5f5f5; }
            .ticket { background: white; border: 2px solid #2563eb; border-radius: 10px; padding: 30px; max-width: 800px; margin: 0 auto; }
            .header { text-align: center; border-bottom: 2px solid #2563eb; padding-bottom: 20px; margin-bottom: 20px; }
            .logo { font-size: 24px; font-weight: bold; color: #2563eb; }
            .title { font-size: 18px; color: #666; margin-top: 5px; }
            .section { margin: 20px 0; }
            .row { display: flex; justify-content: space-between; margin: 10px 0; }
            .label { font-weight: bold; color: #333; }
            .value { color: #666; }
            .passenger-list { background: #f8f9fa; padding: 15px; border-radius: 5px; margin: 15px 0; }
            .passenger { margin: 5px 0; }
            .important { background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 5px; margin-top: 20px; }
            .footer { text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; color: #666; }
            .qr-placeholder { width: 100px; height: 100px; background: #f0f0f0; border: 1px solid #ddd; display: flex; align-items: center; justify-content: center; margin: 20px auto; }
        </style>
    </head>
    <body>
        <div class="ticket">
            <div class="header">
                <div class="logo">✈ SKYBOOK AIRLINES</div>
                <div class="title">E-TICKET CONFIRMATION</div>
            </div>
            
            <div class="section">
                <div class="row">
                    <span class="label">Booking Reference:</span>
                    <span class="value">${booking.bookingReference}</span>
                </div>
                <div class="row">
                    <span class="label">Flight:</span>
                    <span class="value">${booking.flight.airline} - ${booking.flight.flightNumber}</span>
                </div>
            </div>

            <div class="section">
                <div class="row">
                    <span class="label">Route:</span>
                    <span class="value">${booking.flight.source} → ${booking.flight.destination}</span>
                </div>
                <div class="row">
                    <span class="label">Date:</span>
                    <span class="value">${formatDate(booking.flight.departureDate)}</span>
                </div>
                <div class="row">
                    <span class="label">Departure:</span>
                    <span class="value">${booking.flight.departureTime}</span>
                </div>
                <div class="row">
                    <span class="label">Arrival:</span>
                    <span class="value">${booking.flight.arrivalTime}</span>
                </div>
            </div>

            <div class="section">
                <div class="row">
                    <span class="label">Class:</span>
                    <span class="value">${booking.class.toUpperCase()}</span>
                </div>
                <div class="row">
                    <span class="label">Total Amount:</span>
                    <span class="value">₹${booking.totalPrice}</span>
                </div>
                <div class="row">
                    <span class="label">Payment:</span>
                    <span class="value">${booking.paymentMethod.replace("_", " ").toUpperCase()} - ${booking.paymentStatus.toUpperCase()}</span>
                </div>
            </div>

            <div class="passenger-list">
                <div class="label">PASSENGERS:</div>
                ${booking.passengers
                  .map(
                    (passenger, index) =>
                      `<div class="passenger">${index + 1}. ${passenger.name} (${passenger.age} years, ${passenger.gender}) - Seat ${passenger.seatNumber}</div>`,
                  )
                  .join("")}
            </div>

            <div class="qr-placeholder">
                QR CODE
            </div>

            <div class="important">
                <div class="label">Important Notes:</div>
                <ul>
                    <li>Please arrive at airport 2 hours before departure</li>
                    <li>Carry valid photo ID for verification</li>
                    <li>Check-in opens 24 hours before departure</li>
                    <li>Baggage allowance: 15kg (Economy), 25kg (Business/First)</li>
                </ul>
            </div>

            <div class="footer">
                <div>Thank you for choosing SkyBook!</div>
                <div>For support: support@skybook.com | +91-1800-123-4567</div>
                <div>Booked on: ${new Date(booking.bookingDate).toLocaleDateString()}</div>
            </div>
        </div>
    </body>
    </html>
    `

    // Create and download HTML file
    const blob = new Blob([ticketHTML], { type: "text/html" })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `SkyBook_Ticket_${booking.bookingReference}.html`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
  }

  if (bookings.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
          <span className="text-4xl text-gray-400">✈</span>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">{emptyMessage}</h3>
        <p className="text-gray-600 mb-4">{emptyDescription}</p>
        <a href="/flights" className="btn-primary">
          Search Flights
        </a>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">{title}</h3>

      {bookings.map((booking) => (
        <div key={booking._id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h4 className="text-lg font-semibold text-gray-900">
                {booking.flight.airline} - {booking.flight.flightNumber}
              </h4>
              <p className="text-sm text-gray-600">Booking Reference: {booking.bookingReference}</p>
            </div>
            <div className="flex space-x-2">
              <span
                className={`inline-flex px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(booking.bookingStatus)}`}
              >
                {booking.bookingStatus.charAt(0).toUpperCase() + booking.bookingStatus.slice(1)}
              </span>
              <span
                className={`inline-flex px-3 py-1 text-sm font-medium rounded-full ${getFlightStatusColor(booking.flight.status)}`}
              >
                {booking.flight.status.charAt(0).toUpperCase() + booking.flight.status.slice(1)}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-4">
            <div>
              <h5 className="font-medium text-gray-900 mb-2">Route</h5>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <span>{booking.flight.source}</span>
                <span>→</span>
                <span>{booking.flight.destination}</span>
              </div>
              <p className="text-sm text-gray-600 mt-1">{formatDate(booking.flight.departureDate)}</p>
              <p className="text-sm text-gray-600">
                {formatTime(booking.flight.departureTime)} - {formatTime(booking.flight.arrivalTime)}
              </p>
            </div>

            <div>
              <h5 className="font-medium text-gray-900 mb-2">Passengers</h5>
              {booking.passengers.map((passenger, index) => (
                <div key={index} className="text-sm text-gray-600">
                  <p>{passenger.name}</p>
                  <p className="text-xs">Seat: {passenger.seatNumber}</p>
                </div>
              ))}
            </div>

            <div>
              <h5 className="font-medium text-gray-900 mb-2">Class & Payment</h5>
              <p className="text-sm text-gray-600 capitalize">{booking.class} Class</p>
              <p className="text-sm text-gray-600">
                Total: <span className="font-medium">₹{booking.totalPrice}</span>
              </p>
              <p className="text-sm text-gray-600 capitalize">
                {booking.paymentMethod.replace("_", " ")} - {booking.paymentStatus}
              </p>
            </div>

            <div>
              <h5 className="font-medium text-gray-900 mb-2">Actions</h5>
              <div className="space-y-2">
                <button
                  onClick={() => downloadTicketPDF(booking)}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 px-3 rounded transition-colors flex items-center justify-center space-x-1"
                >
                  <span>📄</span>
                  <span>Download PDF</span>
                </button>

                <button
                  onClick={() => downloadTicketHTML(booking)}
                  className="w-full bg-green-600 hover:bg-green-700 text-white text-sm font-medium py-2 px-3 rounded transition-colors flex items-center justify-center space-x-1"
                >
                  <span>🌐</span>
                  <span>Download HTML</span>
                </button>

                <button
                  onClick={() => downloadTicket(booking)}
                  className="w-full bg-gray-600 hover:bg-gray-700 text-white text-sm font-medium py-2 px-3 rounded transition-colors flex items-center justify-center space-x-1"
                >
                  <span>📋</span>
                  <span>Text Format</span>
                </button>

                {booking.bookingStatus === "confirmed" && showCancelButton && (
                  <button
                    onClick={() => onCancelBooking(booking._id)}
                    className="w-full bg-red-600 hover:bg-red-700 text-white text-sm font-medium py-2 px-3 rounded transition-colors"
                  >
                    Cancel Booking
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Progress indicator for upcoming flights */}
          {showCancelButton && booking.bookingStatus === "confirmed" && (
            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <div className="flex items-center space-x-2 text-sm text-blue-800">
                <span>🎫</span>
                <span>Your booking is confirmed! Check-in opens 24 hours before departure.</span>
              </div>
            </div>
          )} 
        </div>
      ))}
    </div>
  )
}

export default BookingsTab
