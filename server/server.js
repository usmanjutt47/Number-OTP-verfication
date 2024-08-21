const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const colors = require("colors");
const morgan = require("morgan");
const Stripe = require("stripe");
const connectDataBase = require("./config/DataBase");
const userRoutes = require("../server/routes/userRoutes");
const User = require("./models/userModel"); // Adjust path based on your project structure

// Load environment variables
dotenv.config();

connectDataBase();

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.use("/api/v1/auth", userRoutes);

// Start the server
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`.bgGreen.white);
});
