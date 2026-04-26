const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    avatar: {
      type: String,
      default: function() {
        return `https://ui-avatars.com/api/?name=${encodeURIComponent(this.username || 'User')}&background=random&color=fff&size=256`;
      },
    },
    referralCount: {
      type: Number,
      default: 0,
    },
    referralCode: {
      type: String,
      unique: true,
      sparse: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    otp: {
      type: String,
    },
    otpExpiry: {
      type: Date,
    },
    resetOtp: {
      type: String,
    },
    resetOtpExpiry: {
      type: Date,
    },
    otpAttempts: {
      type: Number,
      default: 0,
    },
    role: {
      type: String,
      enum: ['user', 'admin', 'creator'],
      default: 'user',
    },
    isBanned: {
      type: Boolean,
      default: false,
    },
    name: {
      type: String,
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
userSchema.pre('save', async function () {
  if (!this.isModified('password')) {
    return;
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Match user entered password to hashed password in database
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Match user entered OTP to hashed OTP in database
userSchema.methods.matchOtp = async function (enteredOtp) {
  if (!this.otp) return false;
  return await bcrypt.compare(enteredOtp, this.otp);
};

// Match user entered reset OTP to hashed reset OTP in database
userSchema.methods.matchResetOtp = async function (enteredOtp) {
  if (!this.resetOtp) return false;
  return await bcrypt.compare(enteredOtp, this.resetOtp);
};

const User = mongoose.model('User', userSchema);
module.exports = User;
