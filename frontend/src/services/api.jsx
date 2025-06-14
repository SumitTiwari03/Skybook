import axios from "axios"

// Create axios instance
const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api",
  timeout: 30000, // Increased timeout for external API calls
})

// Request interceptor to add auth token
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token")
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// Response interceptor to handle errors
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token")
      localStorage.removeItem("user")
      window.location.href = "/login"
    }
    return Promise.reject(error)
  },
)

// Auth API calls
export const authAPI = {
  register: (userData) => API.post("/auth/register", userData),
  login: (credentials) => API.post("/auth/login", credentials),
  getProfile: () => API.get("/auth/me"),
  updateProfile: (profileData) => API.put("/auth/profile", profileData),
  changePassword: (passwordData) => API.put("/auth/change-password", passwordData),
}

// Flight API calls
export const flightAPI = {
  getFlights: (params) => API.get("/flights", { params: { ...params, useAmadeus: true } }),
  getPopularFlights: () => API.get("/flights/popular"),
  getFlight: (id) => API.get(`/flights/${id}`),
  createFlight: (flightData) => API.post("/flights", flightData),
  updateFlight: (id, flightData) => API.put(`/flights/${id}`, flightData),
  deleteFlight: (id) => API.delete(`/flights/${id}`),
}

// Booking API calls
export const bookingAPI = {
  createBooking: (bookingData) => API.post("/bookings", bookingData),
  getMyBookings: () => API.get("/bookings/my-bookings"),
  getBooking: (id) => API.get(`/bookings/${id}`),
  cancelBooking: (id) => API.put(`/bookings/${id}/cancel`),
  getAllBookings: () => API.get("/bookings"),
}

// Offer API calls
export const offerAPI = {
  getOffers: () => API.get("/offers"),
  getAllOffers: () => API.get("/offers/all"),
  getOffer: (id) => API.get(`/offers/${id}`),
  createOffer: (offerData) => API.post("/offers", offerData),
  updateOffer: (id, offerData) => API.put(`/offers/${id}`, offerData),
  deleteOffer: (id) => API.delete(`/offers/${id}`),
}

export default API
