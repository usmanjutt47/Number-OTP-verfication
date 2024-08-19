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
    subscriptionPlan: {
      type: String,
      enum: ["free", "basic", "premium", "standard plan"], 
      required: true,
    },
    subscriptionExpires: {
      type: Date,
      default: null,
    },
    hasPlan: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

userSchema.methods.updateSubscription = function (plan) {
  let duration;

  switch (plan) {
    case "weekly":
      duration = 7;
      break;
    case "monthly":
      duration = 30;
      break;
    case "yearly":
      duration = 365;
      break;
    default:
      duration = 0;
      break;
  }

  if (duration > 0) {
    this.subscriptionPlan = plan;
    this.subscriptionExpires = new Date(
      Date.now() + duration * 24 * 60 * 60 * 1000
    );
    this.hasPlan = true;
  } else {
    this.subscriptionPlan = "none";
    this.subscriptionExpires = null;
    this.hasPlan = false;
  }

  return this.save();
};

module.exports = mongoose.model("User", userSchema);
