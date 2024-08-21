const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    otp: {
      type: String,
      required: false,
      default: null,
    },
    otpExpiresAt: {
      type: Date,
      required: false,
      default: null,
    },
    lettersCreatedToday: {
      type: Number,
      default: 0,
    },
    todayCreatedLetters: {
      type: Number,
      default: 0,
    },
    lastLetterCreatedAt: {
      type: Date,
      default: null,
    },
    userId: {
      type: String,
      unique: true,
      required: [true, "User ID is required"],
    },
    favorites: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Letter",
      },
    ],
    // subscriptionPlan: {
    //   type: String,
    //   enum: ["free", "basic", "premium", "standard plan"],
    //   required: true,
    // },
    // subscriptionExpires: {
    //   type: Date,
    //   default: null,
    // },
    // hasPlan: {
    //   type: Boolean,
    //   default: false,
    // },
    // isBlurred: {
    //   type: Boolean,
    //   default: true,
    // },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
