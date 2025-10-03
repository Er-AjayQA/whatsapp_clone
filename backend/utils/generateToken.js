// ******** Import Configs ******** //
const jwt = require("jsonwebtoken");

// ******** Generate Token Function ******** //
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRETE, { expiresIn: "1y" });
};

// ******** Exports ******** //
module.exports = generateToken;
