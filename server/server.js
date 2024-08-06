const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const colors = require("colors");
const morgan = require("morgan");
const connectDataBase = require("./config/DataBase");
const userRoutes = require("../server/routes/userRoutes");

dotenv.config();

connectDataBase();

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.use("/api/v1/auth", userRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running ${PORT}`.bgGreen.white);
});
