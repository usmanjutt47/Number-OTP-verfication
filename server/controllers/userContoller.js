const userModel = require("../models/userModel");
const { authenticator } = require("otplib");
const nodemailer = require("nodemailer");
const mongoose = require("mongoose");
const Letter = require("../models/letterModel");
const Reply = require("../models/Reply");
const Favorite = require("../models/Favorite");
const stripe = require("stripe")(
  "sk_test_51PnyvfDw0HZ2rXEfHv77jdjoTrcCffI0rSZ3IdcG17gHvdB5t9H2M7yfMpysIIdRRS7zbpkThI90XVVFSjiBtEgY00UoTlPOS9"
);

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

    // Find user by ID
    let user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const now = new Date();
    const hoursSinceLastLetter =
      (now - user.lastLetterCreatedAt) / (1000 * 60 * 60); // Difference in hours

    if (hoursSinceLastLetter >= 24) {
      // Reset the counter and timestamp after 24 hours
      user.lettersCreatedToday = 0;
      user.lastLetterCreatedAt = now;
    }

    if (user.lettersCreatedToday >= 2) {
      return res.status(403).json({
        message: `You can only create 2 letters per day. Please wait until the next day to create a new letter.`,
      });
    }

    // Create the letter
    const newLetter = new Letter({
      userId,
      content,
      createdAt: now,
    });

    // Save the letter
    await newLetter.save();

    // Update the user's letter creation count and timestamp
    user.lettersCreatedToday += 1;
    user.lastLetterCreatedAt = now;
    await user.save();

    // Respond with the newly created letter and its letterId
    res.status(201).json({
      message: "Letter created successfully",
      letterId: newLetter._id.toString(), // Ensure letterId is a string
      letter: {
        _id: newLetter._id.toString(),
        userId: newLetter.userId,
        content: newLetter.content,
        createdAt: newLetter.createdAt,
        updatedAt: newLetter.updatedAt,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getLetterController = async (req, res) => {
  try {
    const userId = req.query.userId;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required to fetch letters.",
      });
    }
    const letters = await Letter.find({ userId: { $ne: userId } }).populate(
      "userId",
      "email"
    );
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
    const { userId, content, letterId } = req.body;

    // Validate that all required fields are present
    if (!userId || !content || !letterId) {
      return res
        .status(400)
        .json({ message: "userId, content, and letterId are required" });
    }

    // Verify that the user exists
    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Verify that the letter exists
    const letter = await Letter.findById(letterId);
    if (!letter) {
      return res.status(404).json({ message: "Letter not found" });
    }

    // Create the reply associated with the specific letter
    const newReply = new Reply({
      letterId, // Store the letterId in the reply
      userId,
      content,
    });

    await newReply.save();

    // Return the created reply and associated letterId
    res.status(201).json({
      message: "Reply created successfully",
      reply: newReply,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to create reply", error: error.message });
  }
};

const getRepliesController = async (req, res) => {
  const { letterId } = req.query;
  const loggedInUserId = req.userId;

  try {
    if (!letterId) {
      return res.status(400).json({ message: "Letter ID is required" });
    }

    const replies = await Reply.find({
      letterId,
      userId: { $ne: loggedInUserId },
    }).populate("letterId");

    if (!replies || replies.length === 0) {
      return res
        .status(404)
        .json({ message: "No replies found for this letter" });
    }

    res.status(200).json(replies);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const getUsersController = async (req, res) => {
  try {
    const { email } = req.params; // Email is extracted from URL parameters

    if (!email) {
      return res.status(400).json({ error: "Email parameter is required" });
    }

    const user = await userModel.findOne({ email });
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch user" });
  }
};

const addToFavoriteController = async (req, res) => {
  const { userId, letterId } = req.body;

  try {
    // Validate input
    if (!userId || !letterId) {
      return res.status(400).json({
        success: false,
        message: "User ID and Letter ID are required.",
      });
    }

    // Check if letter exists
    const letter = await Letter.findById(letterId);
    if (!letter) {
      return res.status(404).json({
        success: false,
        message: "Letter not found.",
      });
    }

    // Find the user
    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    // Check if the letter is already in favorites
    const existingFavorite = await Favorite.findOne({ userId, letterId });
    if (existingFavorite) {
      return res.status(400).json({
        success: false,
        message: "Letter is already in favorites.",
      });
    }

    // Add letter to favorites
    const newFavorite = new Favorite({ userId, letterId });
    await newFavorite.save();

    res.status(200).json({
      success: true,
      message: "Letter added to favorites.",
    });
  } catch (error) {
    console.error("Error adding letter to favorites:", error);
    res.status(500).json({
      success: false,
      message: "Server error.",
    });
  }
};

const getFavoritesController = async (req, res) => {
  const { userId } = req.query; // Get userId from query parameters

  try {
    // Validate input
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required.",
      });
    }

    // Find all favorite letters for the user
    const favorites = await Favorite.find({ userId });

    // If no favorites found
    if (favorites.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No favorite letters found for this user.",
      });
    }

    // Retrieve letter details
    const letterIds = favorites.map((fav) => fav.letterId);
    const letters = await Letter.find({ _id: { $in: letterIds } });

    res.status(200).json({
      success: true,
      favorites: letters, // Send the detailed letter objects
    });
  } catch (error) {
    console.error("Error fetching favorite letters:", error);
    res.status(500).json({
      success: false,
      message: "Server error.",
    });
  }
};

const paymentsController = async (req, res) => {
  try {
    const { amount } = req.body; // Ensure you receive amount or any other necessary data
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount, // Ensure amount is correctly processed
      currency: "usd",
      automatic_payment_methods: { enabled: true },
    });
    res.json({ clientSecret: paymentIntent.client_secret }); // Ensure clientSecret is returned correctly
  } catch (e) {
    res.status(400).json({ error: e.message });
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
  getUsersController,
  addToFavoriteController,
  getFavoritesController,
  paymentsController,
};
