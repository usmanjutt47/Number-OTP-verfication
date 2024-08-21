const express = require("express");
const Pusher = require("pusher");
const {
  EmailVerificationController,
  VerifyOtpController,
  ResendOTPController,
  createLetterController,
  getLetterController,
  replyLetterController,
  getRepliesController,
  getUsersController,
  addToFavoriteController,
  getFavoritesController,
  // paymentsController,
  // updateSubscriptionController,
  // getUserPlanController,
  // getLettersOfSubscribedUsers,
  hideLetter,
} = require("../controllers/userContoller");

const router = express.Router();

// Initialize Pusher
const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID,
  key: process.env.PUSHER_KEY,
  secret: process.env.PUSHER_SECRET,
  cluster: process.env.PUSHER_CLUSTER,
  useTLS: true,
});

// Existing routes
router.post("/send-otp", EmailVerificationController);
router.post("/verify-otp", VerifyOtpController);
router.post("/resend-otp", ResendOTPController);
router.post("/create-letter", createLetterController);
router.get("/letters", getLetterController);
router.post("/reply", replyLetterController);
router.get("/replies", getRepliesController);
router.get("/users/:email", getUsersController);

router.post("/addToFavorite", addToFavoriteController);
router.get("/getFavorites", getFavoritesController);
router.post("/hideLetter", hideLetter);

// router.post("/payments", paymentsController);
// router.post("/updateSubscription", updateSubscriptionController);
// router.get("/user-plan", getUserPlanController);
// router.get("/letters-of-subscribed-users", getLettersOfSubscribedUsers);

router.get("/test", (req, res) => {
  res.send("Pusher routes are working!");
});

module.exports = router;
