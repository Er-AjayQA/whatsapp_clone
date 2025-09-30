const User = require("../models/user");
const otpGenerate = require("../utils/otpGenerator");
const response = require("../utils/responseHandler");

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
  } catch (error) {}
};
