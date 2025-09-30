// ******** Import Configs ******** //
const mongoose = require("mongoose");

// ******** DB Connection ******** //
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("Mongo database connected successfully!");
  } catch (error) {
    console.error("Error connecting database", error.message);
    process.exit(1);
  }
};

// ******** Export DB Connection ******** //
module.exports = connectDB;
