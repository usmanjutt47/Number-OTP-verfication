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
    ], // Array of Letter IDs
  },
  { timestamps: true }
);

// userSchema.index({ otpExpiresAt: 1 }, { expireAfterSeconds: 60 });

module.exports = mongoose.model("User", userSchema);
