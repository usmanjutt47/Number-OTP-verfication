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
    },
    favorites: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Letter",
      },
    ],
    subscriptionPlan: {
      type: String,
      enum: ["none", "weekly", "monthly", "yearly"],
      default: "none",
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

// Method to update the subscription plan
userSchema.methods.updateSubscription = function (plan) {
  let duration;

  switch (plan) {
    case "weekly":
      duration = 7; // 7 days
      break;
    case "monthly":
      duration = 30; // 30 days
      break;
    case "yearly":
      duration = 365; // 365 days
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
