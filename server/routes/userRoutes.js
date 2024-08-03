const express = require("express");
const {
  EmailVerificationController,
  VerifyOtpController,
} = require("../controllers/userContoller");

const router = express.Router();

router.post("/send-otp", EmailVerificationController);

router.post("/verify-otp", VerifyOtpController);

module.exports = router;
