import { Hono } from "hono";
import { cors } from "hono/cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import { serve } from "@hono/node-server";
import user from "./routes/user";

// api config
dotenv.config();
const port = parseInt(process.env.PORT!) || 3000;
const app = new Hono();

// middleware
app.use("*", cors());

// db config
mongoose
  .connect(process.env.MONGO_URL!)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error(err));

// routes
app.route("/api/user", user);

// listener
console.log(`Server is running on port http://localhost:${port}`);

serve({
  fetch: app.fetch,
  port,
});
