const nodemailer = require('nodemailer');

/**
 * Configure Nodemailer Transporter
 */
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS, // App Password
  },
});

/**
 * Send Email Generic Function
 */
const sendEmail = async ({ to, subject, title, body, otp, expiry }) => {
  const mailOptions = {
    from: `"PlayVia" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
        <h2 style="color: #333; text-align: center;">${title}</h2>
        <p style="font-size: 16px; color: #555;">${body}</p>
        <div style="text-align: center; margin: 30px 0;">
          <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #ff0000; background: #f4f4f4; padding: 10px 20px; border-radius: 5px;">${otp}</span>
        </div>
        <p style="font-size: 14px; color: #888; text-align: center;">This OTP is valid for ${expiry || 10} minutes.</p>
        <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
        <p style="font-size: 12px; color: #aaa; text-align: center;">If you did not request this, please ignore this email.</p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Email sent to ${to}`);
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Email could not be sent');
  }
};

/**
 * Send Verification Email
 */
const sendVerificationEmail = async (email, otp) => {
  await sendEmail({
    to: email,
    subject: 'Verify your account',
    title: 'Welcome to PlayVia!',
    body: 'Thank you for registering. Please use the following One-Time Password (OTP) to verify your account:',
    otp,
    expiry: process.env.OTP_EXPIRY_TIME,
  });
};

/**
 * Send Password Reset Email
 */
const sendPasswordResetEmail = async (email, otp) => {
  await sendEmail({
    to: email,
    subject: 'Reset your password',
    title: 'Password Reset Request',
    body: 'We received a request to reset your password. Please use the following One-Time Password (OTP) to proceed:',
    otp,
    expiry: process.env.OTP_EXPIRY_TIME,
  });
};

module.exports = {
  sendVerificationEmail,
  sendPasswordResetEmail,
};
