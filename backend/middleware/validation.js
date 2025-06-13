const { body, validationResult } = require("express-validator")

// Validation middleware
const validate = (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: "Validation errors",
      errors: errors.array(),
    })
  }
  next()
}

// User registration validation
const validateRegister = [
  body("name").trim().isLength({ min: 2, max: 50 }).withMessage("Name must be between 2 and 50 characters"),
  body("email").isEmail().normalizeEmail().withMessage("Please provide a valid email"),
  body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters long"),
  body("phone").optional().isMobilePhone().withMessage("Please provide a valid phone number"),
  validate,
]

// User login validation
const validateLogin = [
  body("email").isEmail().normalizeEmail().withMessage("Please provide a valid email"),
  body("password").notEmpty().withMessage("Password is required"),
  validate,
]

// Flight creation validation
const validateFlight = [
  body("flightNumber").trim().notEmpty().withMessage("Flight number is required"),
  body("airline").trim().notEmpty().withMessage("Airline is required"),
  body("source").trim().notEmpty().withMessage("Source city is required"),
  body("destination").trim().notEmpty().withMessage("Destination city is required"),
  body("departureDate").isISO8601().withMessage("Please provide a valid departure date"),
  body("price.economy").isNumeric().withMessage("Economy price must be a number"),
  body("price.business").isNumeric().withMessage("Business price must be a number"),
  body("price.first").isNumeric().withMessage("First class price must be a number"),
  validate,
]

// Booking validation
const validateBooking = [
  body("flightId").notEmpty().withMessage("Flight ID is required"),
  body("passengers").isArray({ min: 1 }).withMessage("At least one passenger is required"),
  body("passengers.*.name").trim().notEmpty().withMessage("Passenger name is required"),
  body("passengers.*.age").isInt({ min: 1, max: 120 }).withMessage("Passenger age must be between 1 and 120"),
  body("passengers.*.gender").isIn(["male", "female", "other"]).withMessage("Please select a valid gender"),
  body("passengers.*.seatNumber").notEmpty().withMessage("Seat number is required"),
  body("class").isIn(["economy", "business", "first"]).withMessage("Please select a valid class"),
  body("paymentMethod")
    .isIn(["credit_card", "debit_card", "paypal", "bank_transfer", "upi", "net_banking"])
    .withMessage("Please select a valid payment method"),
  validate,
]

module.exports = {
  validateRegister,
  validateLogin,
  validateFlight,
  validateBooking,
}
