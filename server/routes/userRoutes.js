const express = require("express");
const {
  EmailVerificationController,
  VerifyOtpController,
  ResendOTPController,
  sendLetterController,
} = require("../controllers/userContoller");

const router = express.Router();

router.post("/send-otp", EmailVerificationController);

router.post("/verify-otp", VerifyOtpController);

router.post("/resend-otp", ResendOTPController);

router.post("/send-letter",sendLetterController);

module.exports = router;
