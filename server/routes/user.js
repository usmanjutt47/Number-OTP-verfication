const express = require("express");
const router = express.Router();
const mailer = require("../utils/mailer");
const userModel = require("../models/user");

const htmlContent = (otp) => `
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

router.post("/", async function (req, res) {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    const userExists = await userModel.findOne({ email });

    let user = null;

    if (!userExists) {
      user = await userModel.create({ email });
    } else {
      user = userExists;
    }

    const otp = Math.floor(1000 + Math.random() * 9000);

    const html = htmlContent(otp);

    await Promise.all([
      mailer(email, "Welcome to Our App!", html),
      userModel.findByIdAndUpdate(user._id, { otp }),
    ]);

    return res.status(200).json({ message: "OTP sent to your email address" });
  } catch (err) {
    console.error("Error in EmailVerificationController:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/verify", async function (req, res) {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ error: "Email and OTP are required" });
    }

    const user = await userModel.findOne({ email, otp });

    if (!user) {
      return res.status(400).json({ error: "Invalid OTP" });
    }

    await userModel.findByIdAndUpdate(user._id, { otp: null });

    return res.status(200).json({ message: "Email verified" });
  } catch (err) {
    console.error("Error in VerifyOtpController:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.put("/:id", async (c) => {
  try {
    const { id } = c.req.param();

    if (!id) {
      return c.json({ error: "User ID is required" });
    }

    const user = await userModel.findById(id);

    if (!user) {
      return c.json({ error: "User not found" });
    }

    const { name, picture } = await c.req.json();

    await userModel.findByIdAndUpdate(id, { name, picture });

    return c.json({ message: "User updated" });
  } catch (err) {
    return c.json({ error: err.message });
  }
});

module.exports = router;
