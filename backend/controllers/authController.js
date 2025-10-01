// ******** Import Configs ******** //
const User = require("../models/user");
const sendOtpToEmail = require("../services/emailService");
const otpGenerate = require("../utils/otpGenerator");
const response = require("../utils/responseHandler");
const twilioServices = require("../services/twilioService");

// ******** Send Otp ******** //
const sendOtp = async (req, res) => {
  const { phoneNumber, phonePrefix, email } = req.body;
  const otp = otpGenerate();
  const otpExpiry = new Date(Date.now() + 5 * 60 * 1000);

  let user;

  try {
    // Case-1: Email input
    if (email) {
      user = await User.findOne({ email });

      if (!user) {
        user = new User({ email }); // If user not exist then create user
      }
      user.emailOtp = otp;
      user.emailOtpExpiry = otpExpiry;
      await user.save();
      await sendOtpToEmail(email, otp); // Sending Otp mail to user
      return response(res, 200, "Otp send to your email", { email });
    }
    if (!phoneNumber || !phonePrefix) {
      return response(res, 400, "Phone number and Suffix are required");
    }

    const fullPhoneNumber = `${phonePrefix}${phoneNumber}`;

    // Case-2: Phone Number input
    user = await User.findOne({ phoneNumber });
    if (!user) {
      user = new User({ phoneNumber, phonePrefix }); // If user not exist then create user
    }

    await user.save();
    await twilioServices.sendOtpToPhoneNumber(fullPhoneNumber);
    return response(res, 200, "OTP sent successfully", user);
  } catch (error) {
    console.error(error);
    return response(res, 500, "Internal server error");
  }
};

const verifyOtp = async (req, res) => {
  const { phoneNumber, phonePrefix, email, otp } = req.body;

  try {
    let user;
    // Case-1: If verify with Email
    if (email) {
      user = await User.findOne({ email }); // Get user details with EmailId

      if (!user) {
        return response(res, 404, "User not found");
      }
      const currentDate = new Date(); // Get Current Date

      // Check If Otp Exist || Otp Not Matched || Otp Expired
      if (
        !user.emailOtp ||
        String(user.emailOtp) !== String(otp) ||
        currentDate > new Date(user.emailOtpExpiry)
      ) {
        return response(res, 400, "Invalid or expired otp");
      }

      // Update User details after otp verification
      user.isVerified = true;
      user.emailOtp = null;
      user.emailOtpExpiry = null;
      await user.save();
    } // Case-2: If verify with Phone Number
    else {
      if (!phoneNumber || !phonePrefix) {
        return response(res, 400, "Phone number and Suffix are required");
      }

      const fullPhoneNumber = `${phonePrefix}${phoneNumber}`; // Getting phone number including suffix

      // Get user with phone number
      user = await User.findOne({ phoneNumber });
      if (!user) {
        return response(res, 404, "User not found");
      }
      const result = await twilioServices.verifyOtp(fullPhoneNumber, otp);
      if (result.status !== "approved") {
        return response(res, 400, "Invalid otp");
      }
      user.isVerified = true;
      await user.save();
    }

    const token = "";
  } catch (error) {
    console.error(error);
    return response(res, 500, "Internal server error");
  }
};
