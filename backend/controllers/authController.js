// ******** Import Configs ******** //
const User = require("../models/user");
const sendOtpToEmail = require("../services/emailService");
const otpGenerate = require("../utils/otpGenerator");
const response = require("../utils/responseHandler");
const twilioServices = require("../services/twilioService");
const generateToken = require("../utils/generateToken");
const { uploadFileToCloudinary } = require("../config/cloudinaryConfig");
const Conversation = require("../models/Conversation");

// ******** Send Otp Controller ******** //
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

// ******** Verify Otp Controller ******** //
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
        return response(res, 400, "Phone number and Prefix are required");
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

    const token = generateToken(user?._id);

    res.cookie("auth_token", token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 365,
    });

    return response(res, 200, "Otp verified successfully", { token, user });
  } catch (error) {
    console.error(error);
    return response(res, 500, "Internal server error");
  }
};

// ******** Update Profile Controller ******** //
const updateProfile = async (req, res) => {
  const { username, agreed, about } = req.body;
  const userId = req.user.userId;

  try {
    const user = await User.findById(userId);
    const file = req.file;

    if (file) {
      const uploadResult = await uploadFileToCloudinary(file);
      user.profilePicture = uploadResult?.secure_url;
    } else if (req.body.profilePicture) {
      user.profilePicture = req.body.profilePicture;
    }

    if (username) {
      user.username = username;
    }
    if (agreed) {
      user.agreed = agreed;
    }
    if (about) {
      user.about = about;
    }

    await user.save();
    return response(res, 201, "User profile updated successfully", user);
  } catch (error) {
    console.error(error);
    return response(res, 500, "Internal server error");
  }
};

// ******** Check Authenticate Controller ******** //
const checkAuthenticated = async (req, res) => {
  try {
    const userId = req.user.userId;

    if (!userId) {
      return response(res, 404, "Unauthorized!");
    }

    const user = await User.findById(userId);

    if (!user) {
      return response(res, 404, "User not found");
    }

    return response(res, 200, "User retrieved and allow to user PingMe", user);
  } catch (error) {
    console.error(error);
    return response(res, 500, "Internal server error");
  }
};

// ******** Logout Controller ******** //
const logout = async (req, res) => {
  try {
    res.cookie("auth_token", "", { expires: new Date(0) });
    return response(res, 200, "User logout successfully");
  } catch (error) {
    console.error(error);
    return response(res, 500, "Internal server error");
  }
};

// ******** Get All Users Controller ******** //
const getAllUsers = async (req, res) => {
  const loggedInUser = req.user.userId;
  try {
    const users = await User.find({ _id: { $ne: loggedInUser } })
      .select(
        "username profilePicture lastSeen isOnline about phoneNumber phonePrefix"
      )
      .lean();

    const usersWithConversation = await Promise.all(
      users.map(async (user) => {
        const conversation = await Conversation.findOne({
          participants: { $all: [loggedInUser, user?._id] },
        })
          .populate({
            path: "lastMessage",
            select: "content createdAt sender receiver ",
          })
          .lean();

        return { ...user, conversation: conversation || null };
      })
    );

    return response(
      res,
      200,
      "User retrieved successfully",
      usersWithConversation
    );
  } catch (error) {
    console.error(error);
    return response(res, 500, "Internal server error");
  }
};

// ******** Exports ******** //
module.exports = {
  sendOtp,
  verifyOtp,
  updateProfile,
  checkAuthenticated,
  getAllUsers,
  logout,
};
