const express = require("express");
const {
  EmailVerificationController,
  VerifyOtpController,
  ResendOTPController,
  createLetterController,
  getLetterController,
  replyLetterController,
  getRepliesController,
  getUsersController,
} = require("../controllers/userContoller");

const router = express.Router();

// Existing routes
router.post("/send-otp", EmailVerificationController);
router.post("/verify-otp", VerifyOtpController);
router.post("/resend-otp", ResendOTPController);
router.post("/create-letter", createLetterController);
router.get("/letters", getLetterController);
router.post("/reply", replyLetterController);
router.get("/replies/:userId", getRepliesController);
router.get("/users", getUsersController);

module.exports = router;
