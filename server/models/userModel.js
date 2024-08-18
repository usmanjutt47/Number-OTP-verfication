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

userSchema.methods.updateHasPlan = function () {
  if (
    this.subscriptionPlan !== "none" &&
    this.subscriptionExpires > Date.now()
  ) {
    this.hasPlan = true;
  } else {
    this.hasPlan = false;
  }
  return this.save();
};

module.exports = mongoose.model("User", userSchema);
