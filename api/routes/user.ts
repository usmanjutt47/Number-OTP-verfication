import { Hono } from "hono";
import User from "../models/user";
import mailer from "../utils/mailer";

const user = new Hono();

const htmlContent = (otp: number) => `
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

user.post("/", async (c) => {
  try {
    const { email } = await c.req.json();

    const userExists = await User.findOne({ email });

    let user = null;

    if (!userExists) {
      user = await User.create({ email });
    } else {
      user = userExists;
    }

    const otp = Math.floor(100000 + Math.random() * 900000);

    const html = htmlContent(otp);

    await Promise.all([
      mailer(email, "Welcome to Our App!", html),
      User.findByIdAndUpdate(user._id, { otp }),
    ]);

    return c.json({ message: "OTP sent to your email address" });
  } catch (err: any) {
    return c.json({ error: err.message });
  }
});

user.post("/verify", async (c) => {
  try {
    const { email, otp } = await c.req.json();

    const user = await User.findOne({ email, otp });

    if (!user) {
      return c.json({ error: "Invalid OTP" });
    }

    await User.findByIdAndUpdate(user._id, { otp: null });

    return c.json({ message: "Email verified" });
  } catch (err: any) {
    return c.json({ error: err.message });
  }
});

user.put("/:id", async (c) => {
  try {
    const { id } = c.req.param();

    if (!id) {
      return c.json({ error: "User ID is required" });
    }

    const user = await User.findById(id);

    if (!user) {
      return c.json({ error: "User not found" });
    }

    const { name, picture } = await c.req.json();

    await User.findByIdAndUpdate(id, { name, picture });

    return c.json({ message: "User updated" });
  } catch (err: any) {
    return c.json({ error: err.message });
  }
});

export default user;
