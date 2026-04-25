const bcrypt = require('bcrypt');

/**
 * Generate a 6-digit random OTP
 */
const generateOtp = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

/**
 * Hash the OTP for secure storage
 */
const hashOtp = async (otp) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(otp, salt);
};

module.exports = {
  generateOtp,
  hashOtp,
};
