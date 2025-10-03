// ******** Import Configs ******** //
const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");
const { multerMiddleware } = require("../config/cloudinaryConfig");

// ******** Common Routes ******** //
router.post("/send-otp", authController.sendOtp);
router.post("/verify-otp", authController.verifyOtp);
router.get("/logout", authController.logout);

// ******** Protected Routes ******** //
router.put(
  "/update-profile",
  authMiddleware,
  multerMiddleware,
  authController.updateProfile
);
router.get("/check-auth", authMiddleware, authController.checkAuthenticated);
router.get("/users", authMiddleware, authController.getAllUsers);

// ******** Exports ******** //
module.exports = router;
