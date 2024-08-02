require("dotenv").config();
const otpGenerator = require("otp-generator");
const axios = require("axios");
const { storeOtp, getOtp, deleteOtp } = require("../store/OTPStore");
const OTPModel = require("../models/OTPModel");

const generateOtp = () => {
  return otpGenerator.generate(4, {
    upperCaseAlphabets: false,
    lowerCaseAlphabets: false,
    specialChars: false,
  });
};

const sendOtp = async (req, res) => {
  const { phoneNumber } = req.body;

  if (!phoneNumber) {
    return res.status(400).send({
      message: "Phone number is required",
    });
  }

  const otp = generateOtp();

  try {
    await storeOtp(phoneNumber, otp);

    const message = {
      messages: [
        {
          from: "InfoBip",
          destinations: [{ to: phoneNumber }],
          text: `Your OTP is ${otp}`,
        },
      ],
    };

    const headers = {
      Authorization: `App ${process.env.INFOBIP_API_KEY}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    };

    const response = await axios.post(process.env.INFOBIP_BASE_URL, message, {
      headers,
    });

    res
      .status(200)
      .send({ message: "OTP sent successfully", otp, response: response.data });
  } catch (error) {
    res.status(500).send({
      message: "Failed to send OTP",
      error: error.response ? error.response.data : error.message,
    });
  }
};

const resendOtp = async (req, res) => {
  const { phoneNumber } = req.body;

  if (!phoneNumber) {
    return res.status(400).send({ message: "Phone number is required" });
  }

  const otp = generateOtp();

  try {
    await storeOtp(phoneNumber, otp); // This will replace any existing OTP

    const message = {
      messages: [
        {
          from: "InfoBip",
          destinations: [{ to: phoneNumber }],
          text: `Your new OTP is ${otp}`,
        },
      ],
    };

    const headers = {
      Authorization: `App ${process.env.INFOBIP_API_KEY}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    };

    const response = await axios.post(process.env.INFOBIP_BASE_URL, message, {
      headers,
    });

    res.status(200).send({
      message: "New OTP sent successfully",
      otp,
      response: response.data,
    });
  } catch (error) {
    res.status(500).send({
      message: "Failed to resend OTP",
      error: error.response ? error.response.data : error.message,
    });
  }
};

const verifyOtp = async (req, res) => {
  const { phoneNumber, otp } = req.body;

  if (!phoneNumber || !otp) {
    return res
      .status(400)
      .send({ message: "Phone number and OTP are required" });
  }

  try {
    console.log("Verifying OTP:", otp);
    const record = await OTPModel.findOne({ phone: phoneNumber, otp });

    if (record) {
      console.log("OTP matched:", record);
      await OTPModel.deleteOne({ phone: phoneNumber, otp }); // Clear OTP after verification
      return res.status(200).send({ message: "OTP verified successfully" });
    } else {
      console.log("OTP did not match");
      return res.status(400).send({ message: "Invalid OTP" });
    }
  } catch (error) {
    console.error("Verification error:", error);
    res
      .status(500)
      .send({ message: "Verification failed", error: error.message });
  }
};

module.exports = { sendOtp, verifyOtp, resendOtp };
