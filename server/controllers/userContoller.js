const userModel = require("../models/userModel");
const { authenticator } = require("otplib");
const nodemailer = require("nodemailer");
const mongoose = require("mongoose");
const Letter = require("../models/letterModel");
const Reply = require("../models/Reply");

function validateEmail(email) {
  const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return re.test(email);
}

const EmailVerificationController = async (req, res) => {
  try {
    const userEmail = req.body.email;

    if (!validateEmail(userEmail)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid email address." });
    }

    authenticator.options = { digits: 4 };
    const otp = authenticator.generate(userEmail);

    const otpExpiresAt = new Date(Date.now() + 60 * 1000);

    await userModel.findOneAndUpdate(
      { email: userEmail },
      { otp, otpExpiresAt },
      { upsert: true, new: true }
    );

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const htmlContent = `
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; background-color: #f4f4f4; color: #333; margin: 0; padding: 20px; }
            .container { background-color: #fff; border-radius: 8px; padding: 20px; max-width: 600px; margin: auto; box-shadow: 0 4px 8px rgba(0,0,0,0.1); }
            h1 { color: #333; }
            p { font-size: 16px; line-height: 1.5; }
            .footer { font-size: 14px; color: #777; margin-top: 20px; }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>Welcome to Our App!</h1>
            <p>Hello,</p>
            <p>Thank you for joining Our App! We’re excited to have you on board. Start exploring our range of fashion products and enjoy exclusive offers.</p>
            <p>Here is your One-Time Password (OTP) to verify your email address:</p>
            <h2 style="font-size: 24px; color: #075856;">${otp}</h2>
            <p>If you did not request this, please ignore this email.</p>
          </div>
        </body>
      </html>
    `;

    const info = await transporter.sendMail({
      from: `"Logo" <${process.env.EMAIL_USER}>`,
      to: userEmail,
      subject: "Welcome to Logo",
      text: `Hello and welcome to our app! We're glad to have you with us. Your OTP is ${otp}.`,
      html: htmlContent,
    });

    console.log("Welcome email sent: %s", info.messageId);

    res.status(200).json({
      success: true,
      message: "OTP sent successfully",
    });
  } catch (error) {
    console.error("Error in sending welcome email:", error);
    return res.status(500).json({
      success: false,
      message: "Error in sending welcome email.",
      error,
    });
  }
};

const VerifyOtpController = async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!validateEmail(email) || !otp) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid email or OTP." });
    }

    let user = await userModel.findOne({ email, otp });
    if (!user) {
      return res.status(400).json({ success: false, message: "Invalid OTP." });
    }

    if (user.otpExpiresAt < Date.now()) {
      return res
        .status(400)
        .json({ success: false, message: "OTP has expired." });
    }

    if (!user.userId) {
      user.userId = user._id.toString();
    }

    user.otp = null;
    user.otpExpiresAt = null;
    await user.save();

    res.status(200).json({
      success: true,
      message: "OTP verified successfully.",
      userId: user.userId,
    });
  } catch (error) {
    console.error("Error in verifying OTP:", error);
    res.status(500).json({
      success: false,
      message: "Error in verifying OTP.",
      error: error.message,
    });
  }
};

const ResendOTPController = async (req, res) => {
  try {
    const userEmail = req.body.email;

    if (!validateEmail(userEmail)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid email address." });
    }

    authenticator.options = { digits: 4 };
    const otp = authenticator.generate(userEmail);

    const otpExpiresAt = new Date(Date.now() + 60 * 1000);

    await userModel.findOneAndUpdate(
      { email: userEmail },
      { otp, otpExpiresAt },
      { upsert: true, new: true }
    );

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const htmlContent = `
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; background-color: #f4f4f4; color: #333; margin: 0; padding: 20px; }
            .container { background-color: #fff; border-radius: 8px; padding: 20px; max-width: 600px; margin: auto; box-shadow: 0 4px 8px rgba(0,0,0,0.1); }
            h1 { color: #333; }
            p { font-size: 16px; line-height: 1.5; }
            .footer { font-size: 14px; color: #777; margin-top: 20px; }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>OTP Resent</h1>
            <p>Hello,</p>
            <p>Here is your new One-Time Password (OTP) to verify your email address:</p>
            <h2 style="font-size: 24px; color: #075856;">${otp}</h2>
            <p>If you did not request this, please ignore this email.</p>
          </div>
        </body>
      </html>
    `;

    const info = await transporter.sendMail({
      from: `"Logo" <${process.env.EMAIL_USER}>`,
      to: userEmail,
      subject: "Resend OTP",
      text: `Your new OTP is ${otp}.`,
      html: htmlContent,
    });

    console.log("OTP resent email sent: %s", info.messageId);

    res.status(200).json({
      success: true,
      message: "A new OTP has been sent to your email.",
    });
  } catch (error) {
    console.error("Error in resending OTP:", error);
    return res.status(500).json({
      success: false,
      message: "Error in resending OTP.",
      error,
    });
  }
};

const createLetterController = async (req, res) => {
  try {
    const { userId, content } = req.body;

    if (!userId || !content) {
      return res
        .status(400)
        .json({ message: "User ID and content are required" });
    }

    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const newLetter = new Letter({
      userId,
      content,
      createdAt: new Date(),
    });

    await newLetter.save();

    res
      .status(201)
      .json({ message: "Letter created successfully", letter: newLetter });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getLetterController = async (req, res) => {
  try {
    const letters = await Letter.find().populate("userId", "email");

    res.status(200).json({
      success: true,
      letters,
    });
  } catch (error) {
    console.error("Error retrieving letters:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while retrieving letters.",
    });
  }
};
const replyLetterController = async (req, res) => {
  try {
    const { userId, content } = req.body;

    if (!userId || !content) {
      return res
        .status(400)
        .json({ message: "userId and content are required" });
    }

    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const newLetter = new Letter({
      userId: userId,
      content: content,
    });

    await newLetter.save();

    const newReply = new Reply({
      letterId: newLetter.userId,
      userId,
      content,
    });

    await newReply.save();

    res.status(201).json({
      message: "Reply and letter created successfully",
      reply: newReply,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to create reply", error: error.message });
  }
};

const getRepliesController = async (req, res) => {
  const { userId } = req.params;

  try {
    const replies = await Reply.find({ userId }).populate("letterId");
    if (!replies || replies.length === 0) {
      return res
        .status(404)
        .json({ message: "No replies found for this user" });
    }

    res.status(200).json(replies);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  EmailVerificationController,
  VerifyOtpController,
  ResendOTPController,
  createLetterController,
  getLetterController,
  replyLetterController,
  getRepliesController,
};
