const express = require("express");
const {
  sendOtp,
  resendOtp,
  verifyOtp,
} = require("../controllers/OTPController");

const router = express.Router();

// Route to send OTP
router.post("/send-otp", sendOtp);

// Route to resend OTP
router.post("/resend-otp", resendOtp);

// Route to verify OTP
router.post("/verify-otp", verifyOtp);

module.exports = router;
