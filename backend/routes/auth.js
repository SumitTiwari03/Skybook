const express = require("express")
const { register, login, getMe, updateProfile, changePassword } = require("../controllers/authController")
const { protect } = require("../middleware/auth")
const { validateRegister, validateLogin } = require("../middleware/validation")

const router = express.Router()

router.post("/register", validateRegister, register)
router.post("/login", validateLogin, login)
router.get("/me", protect, getMe)
router.put("/profile", protect, updateProfile)
router.put("/change-password", protect, changePassword)

module.exports = router
