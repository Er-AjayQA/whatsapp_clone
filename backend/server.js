// ******** Import Configs ******** //
const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const connectDB = require("./config/dbConnect");
const response = require("./utils/responseHandler");
require("dotenv").config();
const PORT = process.env.PORT || 8000;
const authRoutes = require("./routes/authRoute");
const chatRoutes = require("./routes/chatRoute");

// ******** Config App ******** //
const app = express();
app.use(cors());
app.use(express.json()); // Parsing body data
app.use(cookieParser()); // Parse token on every request
app.use(express.urlencoded({ extended: true }));

// ******** Database Connection ******** //
connectDB();

// ******** Routes ******** //
app.use("/api/auth", authRoutes);
app.use("/api/chat", chatRoutes);

// ******** Checking Server Health ******** //
app.get("/api/v1/welcome", (req, res) => {
  try {
    return response(res, 200, "Working on PingMe application");
  } catch (error) {
    console.error(error);
    return response(res, 500, "Internal server error");
  }
});

// ******** Config Server ******** //
app.listen(PORT, (error) => {
  if (!error) {
    console.log(`The server is running at port : ${PORT}`);
  } else {
    console.log("Server Establishment Error.....", error);
  }
});
