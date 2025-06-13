"use client"

import { useState, useEffect } from "react"
import { bookingAPI, authAPI } from "../../services/api"
import { useAuth } from "../../contexts/AuthContext"
import { toast } from "react-toastify"
import ProfileTab from "./ProfileTab"
import BookingsTab from "./BookingsTab"
import OfferManagement from "../admin/OfferManagement"
import FlightManagement from "../admin/FlightManagement"

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("upcoming")
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const { user, login } = useAuth()

  useEffect(() => {
    fetchBookings()
  }, [])

  const fetchBookings = async () => {
    try {
      const response = await bookingAPI.getMyBookings()
      setBookings(response.data.data)
    } catch (error) {
      toast.error("Failed to fetch bookings")
    }
    setLoading(false)
  }

  const handleCancelBooking = async (bookingId) => {
    if (window.confirm("Are you sure you want to cancel this booking?")) {
      try {
        await bookingAPI.cancelBooking(bookingId)
        toast.success("Booking cancelled successfully")
        fetchBookings()
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to cancel booking")
      }
    }
  }

  const handleProfileUpdate = async (profileData) => {
    try {
      const response = await authAPI.updateProfile(profileData)
      toast.success("Profile updated successfully")

      // Update the auth context with new user data
      const updatedUser = response.data.user
      const token = localStorage.getItem("token")
      await login({ token, user: updatedUser })

      return { success: true }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update profile")
      return { success: false }
    }
  }

  const tabs = [
    { id: "upcoming", label: "Upcoming Trips", icon: "🛫" },
    { id: "past", label: "Past Trips", icon: "📋" },
    { id: "profile", label: "Profile", icon: "👤" },
    ...(user?.role === "admin"
      ? [
          { id: "offers", label: "Manage Offers", icon: "🎁" },
          { id: "flights", label: "Manage Flights", icon: "✈️" },
        ]
      : []),
  ]

  const now = new Date()
  const upcomingBookings = bookings.filter(
    (booking) => new Date(booking.flight.departureDate) >= now && booking.bookingStatus !== "cancelled",
  )
  const pastBookings = bookings.filter(
    (booking) =>
      new Date(booking.flight.departureDate) < now ||
      booking.bookingStatus === "cancelled" ||
      booking.bookingStatus === "completed",
  )

  // Calculate total spent
  const totalSpent = bookings
    .filter((booking) => booking.bookingStatus !== "cancelled")
    .reduce((total, booking) => total + booking.totalPrice, 0)

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="spinner"></div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Welcome back, {user?.name}!</h1>
        <p className="text-gray-600 mt-2">Manage your flights and profile</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">🛫</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Upcoming Trips</p>
              <p className="text-2xl font-bold text-gray-900">{upcomingBookings.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">✅</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Completed Trips</p>
              <p className="text-2xl font-bold text-gray-900">
                {pastBookings.filter((b) => b.bookingStatus === "completed").length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">💰</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Spent</p>
              <p className="text-2xl font-bold text-gray-900">₹{totalSpent.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? "border-primary-500 text-primary-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === "upcoming" && (
            <BookingsTab
              bookings={upcomingBookings}
              title="Upcoming Trips"
              emptyMessage="No upcoming trips"
              emptyDescription="Start planning your next adventure!"
              onCancelBooking={handleCancelBooking}
              showCancelButton={true}
            />
          )}

          {activeTab === "past" && (
            <BookingsTab
              bookings={pastBookings}
              title="Past Trips"
              emptyMessage="No past trips"
              emptyDescription="Your travel history will appear here"
              onCancelBooking={handleCancelBooking}
              showCancelButton={false}
            />
          )}

          {activeTab === "profile" && <ProfileTab user={user} onUpdateProfile={handleProfileUpdate} />}

          {activeTab === "offers" && user?.role === "admin" && <OfferManagement />}

          {activeTab === "flights" && user?.role === "admin" && <FlightManagement />}
        </div>
      </div>
    </div>
  )
}

export default Dashboard
