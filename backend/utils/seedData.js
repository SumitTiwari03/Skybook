const mongoose = require("mongoose")
const Flight = require("../models/Flight")
const Offer = require("../models/Offer")
const connectDB = require("../config/database")
require("dotenv").config()

// Sample flight data
const flightData = [
  {
    flightNumber: "AA1234",
    airline: "American Airlines",
    source: "New York",
    destination: "Los Angeles",
    departureDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
    departureTime: "08:00",
    arrivalTime: "11:30",
    duration: "3h 30m",
    price: {
      economy: 299,
      business: 599,
      first: 899,
    },
    seats: {
      economy: {
        total: 150,
        available: 120,
      },
      business: {
        total: 30,
        available: 25,
      },
      first: {
        total: 10,
        available: 8,
      },
    },
    status: "scheduled",
  },
  {
    flightNumber: "DL5678",
    airline: "Delta Airlines",
    source: "Chicago",
    destination: "Miami",
    departureDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
    departureTime: "10:15",
    arrivalTime: "14:00",
    duration: "3h 45m",
    price: {
      economy: 249,
      business: 549,
      first: 849,
    },
    seats: {
      economy: {
        total: 180,
        available: 150,
      },
      business: {
        total: 40,
        available: 35,
      },
      first: {
        total: 12,
        available: 10,
      },
    },
    status: "scheduled",
  },
  {
    flightNumber: "UA9012",
    airline: "United Airlines",
    source: "San Francisco",
    destination: "Seattle",
    departureDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
    departureTime: "12:30",
    arrivalTime: "14:45",
    duration: "2h 15m",
    price: {
      economy: 199,
      business: 399,
      first: 699,
    },
    seats: {
      economy: {
        total: 120,
        available: 100,
      },
      business: {
        total: 20,
        available: 18,
      },
      first: {
        total: 8,
        available: 6,
      },
    },
    status: "scheduled",
  },
  {
    flightNumber: "SW3456",
    airline: "Southwest Airlines",
    source: "Dallas",
    destination: "Las Vegas",
    departureDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
    departureTime: "14:45",
    arrivalTime: "16:30",
    duration: "1h 45m",
    price: {
      economy: 179,
      business: 379,
      first: 579,
    },
    seats: {
      economy: {
        total: 160,
        available: 140,
      },
      business: {
        total: 25,
        available: 20,
      },
      first: {
        total: 10,
        available: 8,
      },
    },
    status: "scheduled",
  },
  {
    flightNumber: "JB7890",
    airline: "JetBlue",
    source: "Boston",
    destination: "Washington DC",
    departureDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // 1 day from now
    departureTime: "07:30",
    arrivalTime: "09:00",
    duration: "1h 30m",
    price: {
      economy: 149,
      business: 349,
      first: 549,
    },
    seats: {
      economy: {
        total: 140,
        available: 120,
      },
      business: {
        total: 20,
        available: 15,
      },
      first: {
        total: 8,
        available: 5,
      },
    },
    status: "scheduled",
  },
  {
    flightNumber: "AA5432",
    airline: "American Airlines",
    source: "Los Angeles",
    destination: "New York",
    departureDate: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000), // 8 days from now
    departureTime: "22:00",
    arrivalTime: "06:30",
    duration: "5h 30m",
    price: {
      economy: 329,
      business: 629,
      first: 929,
    },
    seats: {
      economy: {
        total: 150,
        available: 130,
      },
      business: {
        total: 30,
        available: 28,
      },
      first: {
        total: 10,
        available: 9,
      },
    },
    status: "scheduled",
  },
  {
    flightNumber: "DL2468",
    airline: "Delta Airlines",
    source: "Miami",
    destination: "Chicago",
    departureDate: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000), // 6 days from now
    departureTime: "15:20",
    arrivalTime: "17:50",
    duration: "2h 30m",
    price: {
      economy: 259,
      business: 559,
      first: 859,
    },
    seats: {
      economy: {
        total: 180,
        available: 160,
      },
      business: {
        total: 40,
        available: 30,
      },
      first: {
        total: 12,
        available: 8,
      },
    },
    status: "scheduled",
  },
  {
    flightNumber: "UA1357",
    airline: "United Airlines",
    source: "Seattle",
    destination: "San Francisco",
    departureDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000), // 4 days from now
    departureTime: "09:45",
    arrivalTime: "11:50",
    duration: "2h 05m",
    price: {
      economy: 189,
      business: 389,
      first: 689,
    },
    seats: {
      economy: {
        total: 120,
        available: 90,
      },
      business: {
        total: 20,
        available: 15,
      },
      first: {
        total: 8,
        available: 4,
      },
    },
    status: "scheduled",
  },
  {
    flightNumber: "SW9876",
    airline: "Southwest Airlines",
    source: "Las Vegas",
    destination: "Dallas",
    departureDate: new Date(Date.now() + 9 * 24 * 60 * 60 * 1000), // 9 days from now
    departureTime: "11:15",
    arrivalTime: "16:00",
    duration: "2h 45m",
    price: {
      economy: 199,
      business: 399,
      first: 599,
    },
    seats: {
      economy: {
        total: 160,
        available: 130,
      },
      business: {
        total: 25,
        available: 20,
      },
      first: {
        total: 10,
        available: 7,
      },
    },
    status: "scheduled",
  },
  {
    flightNumber: "JB2468",
    airline: "JetBlue",
    source: "Washington DC",
    destination: "Boston",
    departureDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), // 10 days from now
    departureTime: "18:30",
    arrivalTime: "20:00",
    duration: "1h 30m",
    price: {
      economy: 159,
      business: 359,
      first: 559,
    },
    seats: {
      economy: {
        total: 140,
        available: 100,
      },
      business: {
        total: 20,
        available: 12,
      },
      first: {
        total: 8,
        available: 4,
      },
    },
    status: "scheduled",
  },
  {
    flightNumber: "AI101",
    airline: "Air India",
    source: "Delhi",
    destination: "Mumbai",
    departureDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
    departureTime: "08:00",
    arrivalTime: "10:15",
    duration: "2h 15m",
    price: {
      economy: 4999,
      business: 12999,
      first: 19999,
    },
    seats: {
      economy: {
        total: 150,
        available: 120,
      },
      business: {
        total: 30,
        available: 25,
      },
      first: {
        total: 10,
        available: 8,
      },
    },
    status: "scheduled",
  },
  {
    flightNumber: "6E235",
    airline: "IndiGo",
    source: "Mumbai",
    destination: "Bangalore",
    departureDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
    departureTime: "10:15",
    arrivalTime: "12:00",
    duration: "1h 45m",
    price: {
      economy: 3499,
      business: 8999,
      first: 14999,
    },
    seats: {
      economy: {
        total: 180,
        available: 150,
      },
      business: {
        total: 40,
        available: 35,
      },
      first: {
        total: 12,
        available: 10,
      },
    },
    status: "scheduled",
  },
  {
    flightNumber: "SG123",
    airline: "SpiceJet",
    source: "Bangalore",
    destination: "Chennai",
    departureDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
    departureTime: "12:30",
    arrivalTime: "13:45",
    duration: "1h 15m",
    price: {
      economy: 2999,
      business: 7999,
      first: 12999,
    },
    seats: {
      economy: {
        total: 120,
        available: 100,
      },
      business: {
        total: 20,
        available: 18,
      },
      first: {
        total: 8,
        available: 6,
      },
    },
    status: "scheduled",
  },
  {
    flightNumber: "UK456",
    airline: "Vistara",
    source: "Delhi",
    destination: "Kolkata",
    departureDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
    departureTime: "14:45",
    arrivalTime: "17:00",
    duration: "2h 15m",
    price: {
      economy: 5499,
      business: 11999,
      first: 18999,
    },
    seats: {
      economy: {
        total: 160,
        available: 140,
      },
      business: {
        total: 25,
        available: 20,
      },
      first: {
        total: 10,
        available: 8,
      },
    },
    status: "scheduled",
  },
  {
    flightNumber: "G8567",
    airline: "GoAir",
    source: "Mumbai",
    destination: "Goa",
    departureDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // 1 day from now
    departureTime: "07:30",
    arrivalTime: "09:00",
    duration: "1h 30m",
    price: {
      economy: 3299,
      business: 7499,
      first: 11999,
    },
    seats: {
      economy: {
        total: 140,
        available: 120,
      },
      business: {
        total: 20,
        available: 15,
      },
      first: {
        total: 8,
        available: 5,
      },
    },
    status: "scheduled",
  },
  {
    flightNumber: "AI202",
    airline: "Air India",
    source: "Chennai",
    destination: "Delhi",
    departureDate: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000), // 8 days from now
    departureTime: "22:00",
    arrivalTime: "00:30",
    duration: "2h 30m",
    price: {
      economy: 5299,
      business: 12499,
      first: 19499,
    },
    seats: {
      economy: {
        total: 150,
        available: 130,
      },
      business: {
        total: 30,
        available: 28,
      },
      first: {
        total: 10,
        available: 9,
      },
    },
    status: "scheduled",
  },
  {
    flightNumber: "6E789",
    airline: "IndiGo",
    source: "Kolkata",
    destination: "Mumbai",
    departureDate: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000), // 6 days from now
    departureTime: "15:20",
    arrivalTime: "17:50",
    duration: "2h 30m",
    price: {
      economy: 4599,
      business: 10999,
      first: 16999,
    },
    seats: {
      economy: {
        total: 180,
        available: 160,
      },
      business: {
        total: 40,
        available: 30,
      },
      first: {
        total: 12,
        available: 8,
      },
    },
    status: "scheduled",
  },
  {
    flightNumber: "SG456",
    airline: "SpiceJet",
    source: "Hyderabad",
    destination: "Bangalore",
    departureDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000), // 4 days from now
    departureTime: "09:45",
    arrivalTime: "11:00",
    duration: "1h 15m",
    price: {
      economy: 2799,
      business: 6999,
      first: 10999,
    },
    seats: {
      economy: {
        total: 120,
        available: 90,
      },
      business: {
        total: 20,
        available: 15,
      },
      first: {
        total: 8,
        available: 4,
      },
    },
    status: "scheduled",
  },
  {
    flightNumber: "UK789",
    airline: "Vistara",
    source: "Goa",
    destination: "Delhi",
    departureDate: new Date(Date.now() + 9 * 24 * 60 * 60 * 1000), // 9 days from now
    departureTime: "11:15",
    arrivalTime: "13:45",
    duration: "2h 30m",
    price: {
      economy: 4999,
      business: 9999,
      first: 15999,
    },
    seats: {
      economy: {
        total: 160,
        available: 130,
      },
      business: {
        total: 25,
        available: 20,
      },
      first: {
        total: 10,
        available: 7,
      },
    },
    status: "scheduled",
  },
  {
    flightNumber: "G8321",
    airline: "GoAir",
    source: "Pune",
    destination: "Chennai",
    departureDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), // 10 days from now
    departureTime: "18:30",
    arrivalTime: "20:30",
    duration: "2h 00m",
    price: {
      economy: 3599,
      business: 8599,
      first: 13599,
    },
    seats: {
      economy: {
        total: 140,
        available: 100,
      },
      business: {
        total: 20,
        available: 12,
      },
      first: {
        total: 8,
        available: 4,
      },
    },
    status: "scheduled",
  },
  {
    flightNumber: "AI505",
    airline: "Air India",
    source: "Delhi",
    destination: "Bangalore",
    departureDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    departureTime: "06:15",
    arrivalTime: "08:45",
    duration: "2h 30m",
    price: {
      economy: 5199,
      business: 11599,
      first: 18599,
    },
    seats: {
      economy: {
        total: 150,
        available: 125,
      },
      business: {
        total: 30,
        available: 22,
      },
      first: {
        total: 10,
        available: 7,
      },
    },
    status: "scheduled",
  },
  {
    flightNumber: "6E404",
    airline: "IndiGo",
    source: "Mumbai",
    destination: "Jaipur",
    departureDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
    departureTime: "13:20",
    arrivalTime: "15:10",
    duration: "1h 50m",
    price: {
      economy: 3899,
      business: 8299,
      first: 13299,
    },
    seats: {
      economy: {
        total: 180,
        available: 145,
      },
      business: {
        total: 40,
        available: 32,
      },
      first: {
        total: 12,
        available: 9,
      },
    },
    status: "scheduled",
  },
]

// Sample offers data
const offerData = [
  {
    title: "Summer Sale",
    description: "Save up to 40% on domestic flights",
    discount: "40% OFF",
    validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
    bgColor: "from-orange-400 to-pink-500",
    isActive: true,
  },
  {
    title: "Business Class Upgrade",
    description: "Upgrade to business class for just ₹4999",
    discount: "₹4999",
    validUntil: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000), // 45 days from now
    bgColor: "from-purple-500 to-indigo-600",
    isActive: true,
  },
  {
    title: "Group Booking",
    description: "Book for 4+ passengers and save 25%",
    discount: "25% OFF",
    validUntil: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), // 60 days from now
    bgColor: "from-green-400 to-blue-500",
    isActive: true,
  },
]

// Function to seed data
const seedData = async () => {
  try {
    // Connect to database
    await connectDB()

    // Delete existing flights
    await Flight.deleteMany({})
    console.log("Existing flights deleted")

    // Insert new flights
    const flights = await Flight.insertMany(flightData)
    console.log(`${flights.length} flights inserted successfully`)

    // Delete existing offers
    await Offer.deleteMany({})
    console.log("Existing offers deleted")

    // Insert new offers
    const offers = await Offer.insertMany(offerData)
    console.log(`${offers.length} offers inserted successfully`)

    // Disconnect from database
    await mongoose.disconnect()
    console.log("Database connection closed")

    process.exit(0)
  } catch (error) {
    console.error("Error seeding data:", error)
    process.exit(1)
  }
}

// Run the seed function
seedData()
