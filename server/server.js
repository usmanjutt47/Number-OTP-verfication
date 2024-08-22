require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const connectDataBase = require("./config/DataBase");
const user = require("../server/routes/user");
const letter = require("../server/routes/letter");
const reply = require("../server/routes/reply");
const colors = require("colors");

connectDataBase();

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.use("/api/user", user);
app.use("/api/letter", letter);
app.use("/api/reply", reply);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(
    `Server running on port http://localhost:${PORT}`.bgGreen.bgWhite
  );
});
