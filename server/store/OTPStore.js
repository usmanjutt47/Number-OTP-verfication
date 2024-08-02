const Otp = require("../models/OTPModel");

const storeOtp = async (phone, otp) => {
  await Otp.findOneAndUpdate(
    { phone },
    { otp, createdAt: Date.now() }, // Updates the OTP and timestamp
    { upsert: true, new: true } // Upsert and return the new document
  );
};

const getOtp = async (phone) => {
  const otpRecord = await Otp.findOne({ phone });
  return otpRecord ? otpRecord.otp : null;
};

const deleteOtp = async (phone) => {
  await Otp.deleteOne({ phone });
};

module.exports = { storeOtp, getOtp, deleteOtp };
