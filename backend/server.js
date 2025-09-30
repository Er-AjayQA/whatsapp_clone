// ******** Import Configs ******** //
const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const connectDB = require("./config/dbConnect");
require("dotenv").config();
const PORT = process.env.PORT || 8000;

// ******** Config App ******** //
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser);

// ******** Database Connection ******** //
connectDB();

// ******** Checking Server Health ******** //

// ******** Config Server ******** //
app.listen(PORT, (error) => {
  if (!error) {
    console.log(`The server is running at port : ${PORT}`);
  } else {
    console.log("Server Establishment Error.....", error);
  }
});
