const userModel = require("../models/userModel");
const { authenticator } = require("otplib");
const nodemailer = require("nodemailer");

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
            <h2 style="font-size: 24px; color: #007bff;">${otp}</h2>
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
      message:
        "We've sent an OTP to your email. Check your inbox and use it to verify your account!",
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

    const user = await userModel.findOne({ email, otp });

    if (!user) {
      return res.status(400).json({ success: false, message: "Invalid OTP." });
    }

    if (user.otpExpiresAt < Date.now()) {
      return res
        .status(400)
        .json({ success: false, message: "OTP has expired." });
    }

    res.status(200).json({
      success: true,
      message: "OTP verified successfully.",
    });

    await userModel.findOneAndUpdate(
      { email, otp },
      { otp: null, otpExpiresAt: null }
    );
  } catch (error) {
    console.error("Error in verifying OTP:", error);
    res.status(500).json({
      success: false,
      message: "Error in verifying OTP.",
      error: error.message,
    });
  }
};

module.exports = { EmailVerificationController, VerifyOtpController };
