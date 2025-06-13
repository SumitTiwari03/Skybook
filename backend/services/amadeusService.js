const axios = require("axios")

class AmadeusService {
  constructor() {
    this.baseURL = "https://test.api.amadeus.com"
    this.accessToken = null
    this.tokenExpiry = null
    this.clientId = process.env.AMADEUS_CLIENT_ID
    this.clientSecret = process.env.AMADEUS_CLIENT_SECRET
  }

  // Get access token for Amadeus API
  async getAccessToken() {
    try {
      if (this.accessToken && this.tokenExpiry && Date.now() < this.tokenExpiry) {
        return this.accessToken
      }

      const response = await axios.post(
        `${this.baseURL}/v1/security/oauth2/token`,
        new URLSearchParams({
          grant_type: "client_credentials",
          client_id: this.clientId,
          client_secret: this.clientSecret,
        }),
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        },
      )

      this.accessToken = response.data.access_token
      this.tokenExpiry = Date.now() + response.data.expires_in * 1000 - 60000 // Refresh 1 minute early

      return this.accessToken
    } catch (error) {
      console.error("Error getting Amadeus access token:", error.response?.data || error.message)
      throw new Error("Failed to authenticate with Amadeus API")
    }
  }

  // Get IATA codes for Indian cities
  getCityIATACode(cityName) {
    const cityMapping = {
      Delhi: "DEL",
      Mumbai: "BOM",
      Bangalore: "BLR",
      Chennai: "MAA",
      Kolkata: "CCU",
      Hyderabad: "HYD",
      Pune: "PNQ",
      Jaipur: "JAI",
      Ahmedabad: "AMD",
      Goa: "GOI",
      Kochi: "COK",
      Lucknow: "LKO",
      Chandigarh: "IXC",
      Bhubaneswar: "BBI",
      Guwahati: "GAU",
      Indore: "IDR",
      Nagpur: "NAG",
      Coimbatore: "CJB",
      Vadodara: "BDQ",
      Visakhapatnam: "VTZ",
    }
    return cityMapping[cityName] || cityName
  }

  // Search flights using Amadeus API
  async searchFlights(searchParams) {
    try {
      const token = await this.getAccessToken()
      const { source, destination, date, class: travelClass, adults = 1 } = searchParams

      const originCode = this.getCityIATACode(source)
      const destinationCode = this.getCityIATACode(destination)

      const params = {
        originLocationCode: originCode,
        destinationLocationCode: destinationCode,
        departureDate: date,
        adults: adults,
        max: 20, // Limit results
        currencyCode: "INR",
      }

      // Add travel class if specified
      if (travelClass && travelClass !== "economy") {
        params.travelClass = travelClass.toUpperCase()
      }

      const response = await axios.get(`${this.baseURL}/v2/shopping/flight-offers`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params,
      })

      return this.transformAmadeusResponse(response.data, source, destination)
    } catch (error) {
      console.error("Error searching flights:", error.response?.data || error.message)

      // If API fails, return empty array to allow fallback to local data
      if (error.response?.status === 401) {
        throw new Error("Amadeus API authentication failed")
      } else if (error.response?.status === 400) {
        throw new Error("Invalid search parameters")
      } else {
        console.log("Amadeus API unavailable, falling back to local data")
        return []
      }
    }
  }

  // Transform Amadeus response to our format
  transformAmadeusResponse(amadeusData, source, destination) {
    if (!amadeusData.data || amadeusData.data.length === 0) {
      return []
    }

    return amadeusData.data.map((offer, index) => {
      const itinerary = offer.itineraries[0]
      const segment = itinerary.segments[0]
      const pricing = offer.price

      // Extract airline info
      const airline = this.getAirlineName(segment.carrierCode)
      const flightNumber = `${segment.carrierCode}${segment.number}`

      // Extract times
      const departureTime = new Date(segment.departure.at).toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      })
      const arrivalTime = new Date(segment.arrival.at).toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      })

      // Calculate duration
      const duration = this.calculateDuration(segment.departure.at, segment.arrival.at)

      // Extract pricing for different classes
      const basePrice = Number.parseFloat(pricing.total)
      const prices = {
        economy: Math.round(basePrice),
        business: Math.round(basePrice * 2.5),
        first: Math.round(basePrice * 4),
      }

      // Generate seat availability (mock data as Amadeus doesn't provide this in search)
      const seats = {
        economy: {
          total: 150,
          available: Math.floor(Math.random() * 50) + 100,
        },
        business: {
          total: 30,
          available: Math.floor(Math.random() * 20) + 10,
        },
        first: {
          total: 10,
          available: Math.floor(Math.random() * 8) + 2,
        },
      }

      return {
        _id: `amadeus_${offer.id}`,
        flightNumber,
        airline,
        source,
        destination,
        departureDate: new Date(segment.departure.at),
        departureTime,
        arrivalTime,
        duration,
        price: prices,
        seats,
        status: "scheduled",
        isAmadeusData: true,
        amadeusOfferId: offer.id,
      }
    })
  }

  // Get airline name from carrier code
  getAirlineName(carrierCode) {
    const airlineMapping = {
      AI: "Air India",
      "6E": "IndiGo",
      SG: "SpiceJet",
      UK: "Vistara",
      G8: "GoAir",
      I5: "AirAsia India",
      "9W": "Jet Airways",
      S2: "JetLite",
      DN: "Alliance Air",
      LB: "Air Costa",
    }
    return airlineMapping[carrierCode] || `${carrierCode} Airlines`
  }

  // Calculate flight duration
  calculateDuration(departureTime, arrivalTime) {
    const departure = new Date(departureTime)
    const arrival = new Date(arrivalTime)
    const diffMs = arrival - departure
    const hours = Math.floor(diffMs / (1000 * 60 * 60))
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60))
    return `${hours}h ${minutes}m`
  }

  // Get flight price (for booking confirmation)
  async getFlightPrice(offerId) {
    try {
      const token = await this.getAccessToken()

      const response = await axios.post(
        `${this.baseURL}/v1/shopping/flight-offers/pricing`,
        {
          data: {
            type: "flight-offers-pricing",
            flightOffers: [{ id: offerId }],
          },
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      )

      return response.data
    } catch (error) {
      console.error("Error getting flight price:", error.response?.data || error.message)
      throw new Error("Failed to get current flight price")
    }
  }

  // Create flight order (booking)
  async createFlightOrder(orderData) {
    try {
      const token = await this.getAccessToken()

      const response = await axios.post(`${this.baseURL}/v1/booking/flight-orders`, orderData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })

      return response.data
    } catch (error) {
      console.error("Error creating flight order:", error.response?.data || error.message)
      throw new Error("Failed to create flight booking")
    }
  }
}

module.exports = new AmadeusService()
