// ******** Import Configs ******** //
const twilio = require("twilio");

// ******** Twilio Credentials ******** //
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const serviceSid = process.env.TWILIO_SERVICE_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;

// ******** Twilio Client ******** //
const client = twilio(accountSid, authToken);

// ******** Send OTP to Phone Number ******** //
const sendOtpToPhoneNumber = async (phoneNumber) => {
  try {
    console.log("Sending otp to this number", phoneNumber);
    if (!phoneNumber) {
      throw new Error("Phone number is required");
    }

    const response = await client.verify.v2
      .services(serviceSid)
      .verifications.create({ to: phoneNumber, channel: "sms" });

    console.log("This is my otp response", response);
    return response;
  } catch (error) {
    console.log(error);
    throw new Error("Failed to send otp");
  }
};

// ******** Verify Otp ******** //
const verifyOtp = async (phoneNumber, otp) => {
  try {
    console.log("This is my OTP", otp);
    console.log("This is my phone  number", phoneNumber);
    const response = await client.verify.v2
      .services(serviceSid)
      .verificationChecks.create({ to: phoneNumber, code: otp });

    console.log("This is my otp response", response);
    return response;
  } catch (error) {
    console.log(error);
    throw new Error("Otp verification failed");
  }
};

// ******** Exports ******** //
module.exports = { sendOtpToPhoneNumber, verifyOtp };
