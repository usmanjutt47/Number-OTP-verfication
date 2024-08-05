const express = require("express");
const {
  EmailVerificationController,
  VerifyOtpController,
  ResendOTPController,
  createLetterController,
} = require("../controllers/userContoller");

const router = express.Router();

router.post("/send-otp", EmailVerificationController);

router.post("/verify-otp", VerifyOtpController);

router.post("/resend-otp", ResendOTPController);

router.post("/create-letter", createLetterController);

module.exports = router;
