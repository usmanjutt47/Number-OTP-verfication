const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const colors = require("colors");
const morgan = require("morgan");

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.get("/", (req, res) =>
  res.status(200).send({
    message: true,
    message: "Welcome to the REST API",
  })
);

const PORT = process.env.PORT || 1000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`.bgGreen.bold);
});
