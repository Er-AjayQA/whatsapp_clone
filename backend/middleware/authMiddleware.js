// ******** Import Configs ******** //
const jwt = require("jsonwebtoken");
const response = require("../utils/responseHandler");

// ******** Auth Middleware Function ******** //
const authMiddleware = async (req, res, next) => {
  const authToken = req.cookies?.auth_token;

  if (!authToken) {
    return response(res, 401, "Authorization token missing");
  }

  try {
    const decode = jwt.verify(authToken, process.env.JWT_SECRETE);

    req.user = decode;
    next();
  } catch (error) {
    console.error(error);
    return response(res, 401, "Invalid or expired token");
  }
};

// ******** Exports ******** //
module.exports = authMiddleware;
