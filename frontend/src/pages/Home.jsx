"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"
import { offerAPI } from "../services/api"

const Home = () => {
  const { isAuthenticated, user } = useAuth()
  const [offers, setOffers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchOffers()
  }, [])

  const fetchOffers = async () => {
    try {
      const response = await offerAPI.getOffers()
      setOffers(response.data.data)
    } catch (error) {
      console.error("Failed to fetch offers", error)
    } finally {
      setLoading(false)
    }
  }

  const popularDestinations = [
    {
      city: "Goa",
      country: "India",
      price: "From ₹3,299",
      image: "/placeholder.svg?height=200&width=300",
      description: "Beach Paradise",
    },
    {
      city: "Delhi",
      country: "India",
      price: "From ₹4,999",
      image: "/placeholder.svg?height=200&width=300",
      description: "Historical Capital",
    },
    {
      city: "Mumbai",
      country: "India",
      price: "From ₹3,499",
      image: "/placeholder.svg?height=200&width=300",
      description: "City of Dreams",
    },
    {
      city: "Jaipur",
      country: "India",
      price: "From ₹3,899",
      image: "/placeholder.svg?height=200&width=300",
      description: "Pink City",
    },
  ]

  const features = [
    {
      icon: "🔍",
      title: "Smart Search",
      description: "Find the best flights with our AI-powered search engine",
    },
    {
      icon: "💳",
      title: "Secure Payments",
      description: "Your payment information is protected with bank-level security",
    },
    {
      icon: "📱",
      title: "Mobile Friendly",
      description: "Book and manage your flights on any device, anywhere",
    },
    {
      icon: "🎫",
      title: "Instant Booking",
      description: "Get your tickets instantly with our fast booking system",
    },
    {
      icon: "🌍",
      title: "Pan-India Coverage",
      description: "Access flights to all major Indian cities",
    },
    {
      icon: "🏆",
      title: "Award Winning",
      description: "Trusted by millions of travelers across India",
    },
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-primary-600 to-primary-800 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">Your Journey Begins Here</h1>
            <p className="text-xl md:text-2xl mb-8 text-primary-100">
              Book domestic flights across India with ease and confidence
            </p>
            <div className="space-x-4">
              <Link
                to="/flights"
                className="bg-white text-primary-600 hover:bg-gray-100 font-bold py-3 px-8 rounded-lg transition-colors duration-200 inline-block"
              >
                Search Flights
              </Link>
              {!isAuthenticated && (
                <Link
                  to="/register"
                  className="border-2 border-white text-white hover:bg-white hover:text-primary-600 font-bold py-3 px-8 rounded-lg transition-colors duration-200 inline-block"
                >
                  Sign Up Free
                </Link>
              )}
            </div>
          </div>
        </div>
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -mr-32 -mt-32"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white opacity-5 rounded-full -ml-24 -mb-24"></div>
      </div>

      {/* Special Offers */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Special Offers</h2>
            <p className="text-lg text-gray-600">Don't miss out on these amazing deals</p>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="spinner"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {offers.map((offer) => (
                <div
                  key={offer._id}
                  className={`bg-gradient-to-r ${offer.bgColor} rounded-lg p-6 text-white relative overflow-hidden`}
                >
                  <div className="relative z-10">
                    <div className="text-2xl font-bold mb-2">{offer.discount}</div>
                    <h3 className="text-xl font-semibold mb-2">{offer.title}</h3>
                    <p className="mb-4 opacity-90">{offer.description}</p>
                    <p className="text-sm opacity-75">Valid until {new Date(offer.validUntil).toLocaleDateString()}</p>
                    <Link
                      to="/flights"
                      className="inline-block mt-4 bg-white text-gray-900 px-4 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors"
                    >
                      Book Now
                    </Link>
                  </div>
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-16 -mt-16"></div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Popular Destinations */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Popular Destinations</h2>
            <p className="text-lg text-gray-600">Discover amazing places across India</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {popularDestinations.map((destination, index) => (
              <div key={index} className="group cursor-pointer">
                <div className="relative overflow-hidden rounded-lg shadow-md group-hover:shadow-xl transition-shadow duration-300">
                  <img
                    src={destination.image || "/placeholder.svg"}
                    alt={`${destination.city}, ${destination.country}`}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                    <h3 className="text-lg font-semibold">{destination.city}</h3>
                    <p className="text-sm opacity-90">{destination.country}</p>
                    <p className="text-sm opacity-75">{destination.description}</p>
                  </div>
                  <div className="absolute top-4 right-4 bg-white text-primary-600 px-2 py-1 rounded text-sm font-medium">
                    {destination.price}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link to="/flights" className="btn-primary">
              View All Destinations
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose SkyBook?</h2>
            <p className="text-lg text-gray-600">We make flight booking simple, secure, and affordable</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center group">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-primary-200 transition-colors duration-200">
                  <span className="text-2xl">{feature.icon}</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Newsletter Section */}
      <div className="py-16 bg-primary-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Stay Updated</h2>
          <p className="text-xl text-primary-100 mb-8">Get the latest deals and travel tips delivered to your inbox</p>
          <div className="max-w-md mx-auto flex">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-l-lg border-0 focus:outline-none focus:ring-2 focus:ring-primary-300"
            />
            <button className="bg-primary-800 hover:bg-primary-900 text-white px-6 py-3 rounded-r-lg font-medium transition-colors duration-200">
              Subscribe
            </button>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      {isAuthenticated ? (
        <div className="bg-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Welcome back, {user?.name}!</h2>
            <p className="text-lg text-gray-600 mb-8">Ready to plan your next adventure?</p>
            <div className="space-x-4">
              <Link to="/flights" className="btn-primary">
                Search Flights
              </Link>
              <Link to="/dashboard" className="btn-secondary">
                View My Bookings
              </Link>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Ready to Start Your Journey?</h2>
            <p className="text-lg text-gray-600 mb-8">
              Join thousands of travelers who trust SkyBook for their flight bookings
            </p>
            <Link to="/register" className="btn-primary">
              Create Your Account
            </Link>
          </div>
        </div>
      )}

      {/* Testimonials */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">What Our Customers Say</h2>
            <p className="text-lg text-gray-600">Real experiences from real travelers</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
                  <span className="text-lg">👤</span>
                </div>
                <div className="ml-4">
                  <h4 className="font-semibold text-gray-900">Priya Sharma</h4>
                  <p className="text-sm text-gray-600">Business Traveler</p>
                </div>
              </div>
              <p className="text-gray-600 italic">
                "SkyBook made booking my business trips so much easier. The interface is intuitive and the customer
                service is excellent!"
              </p>
              <div className="flex mt-4">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-yellow-400">
                    ⭐
                  </span>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
                  <span className="text-lg">👤</span>
                </div>
                <div className="ml-4">
                  <h4 className="font-semibold text-gray-900">Rahul Patel</h4>
                  <p className="text-sm text-gray-600">Family Traveler</p>
                </div>
              </div>
              <p className="text-gray-600 italic">
                "Booked a family vacation for 6 people. The group booking discount saved us thousands of rupees!"
              </p>
              <div className="flex mt-4">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-yellow-400">
                    ⭐
                  </span>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
                  <span className="text-lg">👤</span>
                </div>
                <div className="ml-4">
                  <h4 className="font-semibold text-gray-900">Ananya Gupta</h4>
                  <p className="text-sm text-gray-600">Solo Traveler</p>
                </div>
              </div>
              <p className="text-gray-600 italic">
                "As a solo female traveler, I appreciate the security and reliability of SkyBook. Never had any issues!"
              </p>
              <div className="flex mt-4">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-yellow-400">
                    ⭐
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home
