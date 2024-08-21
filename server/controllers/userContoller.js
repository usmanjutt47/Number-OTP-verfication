const userModel = require("../models/userModel");
const { authenticator } = require("otplib");
const nodemailer = require("nodemailer");
const mongoose = require("mongoose");
const Letter = require("../models/letterModel");
const Reply = require("../models/Reply");
const Favorite = require("../models/Favorite");
const userPlanModel = require("../models/userPlanModel");
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

    let user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const now = new Date();
    const hoursSinceLastLetter =
      (now - user.lastLetterCreatedAt) / (1000 * 60 * 60); // Calculate time difference in hours

    // Reset the count if more than 24 hours have passed
    if (hoursSinceLastLetter >= 24) {
      user.lettersCreatedToday = 0;
      user.todayCreatedLetters = 0; // Reset today's count
      user.lastLetterCreatedAt = now;
    }

    // Check if the user has reached the limit
    if (user.lettersCreatedToday >= 2) {
      return res.status(403).json({
        message:
          "You can only create 2 letters per day. Please wait until the next day to create a new letter.",
      });
    }

    // Create a new letter
    const newLetter = new Letter({
      userId,
      content,
      createdAt: now,
    });

    // Save the letter
    await newLetter.save();

    // Update user details
    user.lettersCreatedToday += 1;
    user.todayCreatedLetters += 1; // Increment today's letter count
    user.lastLetterCreatedAt = now;
    await user.save();

    res.status(201).json({
      message: "Letter created successfully",
      letterId: newLetter._id.toString(),
      letter: {
        _id: newLetter._id.toString(),
        userId: newLetter.userId,
        content: newLetter.content,
        createdAt: newLetter.createdAt,
        updatedAt: newLetter.updatedAt,
      },
      lettersCreatedToday: user.todayCreatedLetters,
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

    if (!userId || !content || !letterId) {
      return res
        .status(400)
        .json({ message: "userId, content, and letterId are required" });
    }

    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const letter = await Letter.findById(letterId);
    if (!letter) {
      return res.status(404).json({ message: "Letter not found" });
    }

    const newReply = new Reply({
      letterId,
      userId,
      content,
      replyTo: letter?.userId,
    });

    await newReply.save();

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
  try {
    const userId = req.query.userId;

    if (!userId) {
      return res.status(400).json({ message: "userId is required" });
    }

    const replies = await Reply.find({ replyTo: userId });

    if (replies.length === 0) {
      return res
        .status(404)
        .json({ message: "No replies found for this user" });
    }

    res.status(200).json(replies);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getUsersController = async (req, res) => {
  try {
    const { email } = req.params;

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

// const paymentsController = async (req, res) => {
//   try {
//     const { amount, userId, subscriptionPlan } = req.body;

//     const paymentIntent = await stripe.paymentIntents.create({
//       amount,
//       currency: "usd",
//       automatic_payment_methods: { enabled: true },
//     });

//     const user = await userModel.findOne({ userId });
//     if (!user) return res.status(404).json({ error: "User not found" });

//     const expirationDate = new Date();
//     if (subscriptionPlan === "weekly") {
//       expirationDate.setDate(expirationDate.getDate() + 7);
//     } else if (subscriptionPlan === "monthly") {
//       expirationDate.setMonth(expirationDate.getMonth() + 1);
//     } else if (subscriptionPlan === "yearly") {
//       expirationDate.setFullYear(expirationDate.getFullYear() + 1);
//     }

//     await userModel.findOneAndUpdate(
//       { userId },
//       {
//         subscriptionPlan,
//         subscriptionExpires: expirationDate,
//         hasPlan: true,
//       }
//     );

//     res.json({ clientSecret: paymentIntent.client_secret });
//   } catch (error) {
//     console.error("Payment processing error:", error);
//     res.status(500).json({ error: error.message });
//   }
// };

// const updateSubscriptionController = async (req, res) => {
//   try {
//     const { userId, subscriptionPlan, expirationDate } = req.body;

//     const user = await userModel.findOneAndUpdate(
//       { userId },
//       {
//         subscriptionPlan,
//         subscriptionExpires: expirationDate,
//       },
//       { new: true }
//     );

//     if (!user) {
//       return res.status(404).json({ error: "User not found" });
//     }

//     await user.save();

//     res.json(user);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// const getUserPlanController = async (req, res) => {
//   const userId = req.query.userId;

//   if (!userId) {
//     return res.status(400).json({ message: "User ID is required" });
//   }

//   try {
//     const user = await userModel.findOne({ userId });

//     if (!user) {
//       console.log("No user found for userId:", userId);
//       return res.status(404).json({ message: "User not found" });
//     }
//     res.json({
//       active: user.subscriptionPlan !== "none",
//       planDetails: {
//         subscriptionPlan: user.subscriptionPlan,
//         subscriptionExpires: user.subscriptionExpires,
//       },
//     });
//   } catch (error) {
//     res.status(500).json({ message: "Internal server error" });
//   }
// };

// const getLettersOfSubscribedUsers = async (req, res) => {
//   try {
//     const { userId } = req.query;

//     if (!userId) {
//       return res.status(400).json({ error: "userId is required" });
//     }

//     // Check if the user exists and has an active plan
//     const user = await userModel.findOne({ _id: userId, hasPlan: true });

//     if (!user) {
//       return res
//         .status(404)
//         .json({ error: "User not found or no active plan" });
//     }

//     // Fetch replies where replyTo matches the userId
//     const replies = await Reply.find({ replyTo: userId });

//     res.json({ success: true, replies });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

const hideLetter = async (req, res) => {
  const { userId, letterId } = req.body;

  if (!userId || !letterId) {
    return res
      .status(400)
      .json({ success: false, message: "User ID and Letter ID are required" });
  }

  try {
    const letter = await Letter.findById(letterId);
    if (!letter) {
      return res
        .status(404)
        .json({ success: false, message: "Letter not found" });
    }

    if (!letter.hiddenBy.includes(userId)) {
      letter.hiddenBy.push(userId);
      await letter.save();
      return res.json({ success: true, message: "Letter hidden successfully" });
    } else {
      return res.json({
        success: false,
        message: "Letter is already hidden by this user",
      });
    }
  } catch (error) {
    console.error("Error hiding letter:", error);
    res.status(500).json({ success: false, message: "Server error" });
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
  // paymentsController,
  // updateSubscriptionController,
  // getUserPlanController,
  // getLettersOfSubscribedUsers,
  hideLetter,
};
