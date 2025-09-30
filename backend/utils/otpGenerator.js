// ******** Generate 6-Digit OTP Function ******** //
const otpGenerate = () => {
  return Math.floor(100000 + Math.random() * 90000).toString();
};

// ******** Exports ******** //
module.exports = otpGenerate;
