const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * Verify Resend API Key is provided on server startup.
 */
const verifyEmailConnection = () => {
  if (!process.env.RESEND_API_KEY) {
    console.error('[Email] ❌ RESEND_API_KEY is missing from environment variables.');
  } else {
    console.log('[Email] ✅ Resend initialized. Ready to send emails.');
  }
};

// Run verification on module load
verifyEmailConnection();

/**
 * Send Email Generic Function with retry support
 */
const sendEmail = async ({ to, subject, title, body, otp, expiry }, retryCount = 0) => {
  try {
    const data = await resend.emails.send({
      from: 'PlayVia <onboarding@resend.dev>', // Update this to your verified domain in production
      to: [to],
      subject: subject,
      html: `
        <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: auto; background: #0f0f0f; border-radius: 12px; overflow: hidden;">
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #FF0000, #FF4500); padding: 30px; text-align: center;">
            <h1 style="color: #fff; margin: 0; font-size: 28px; letter-spacing: 1px;">▶ PlayVia</h1>
          </div>
          <!-- Body -->
          <div style="padding: 40px 30px; background: #1a1a1a;">
            <h2 style="color: #ffffff; text-align: center; margin-top: 0;">${title}</h2>
            <p style="font-size: 15px; color: #aaaaaa; text-align: center;">${body}</p>
            
            <!-- OTP Box -->
            <div style="text-align: center; margin: 30px 0;">
              <div style="display: inline-block; background: #0f0f0f; border: 2px solid #FF0000; border-radius: 10px; padding: 16px 32px;">
                <span style="font-size: 36px; font-weight: bold; letter-spacing: 12px; color: #FF0000;">${otp}</span>
              </div>
            </div>
            
            <p style="font-size: 13px; color: #666; text-align: center;">
              This OTP is valid for <strong style="color: #aaa;">${expiry || 10} minutes</strong>. Do not share it with anyone.
            </p>
          </div>
          <!-- Footer -->
          <div style="background: #0a0a0a; padding: 20px; text-align: center;">
            <p style="font-size: 12px; color: #444; margin: 0;">
              If you did not request this, you can safely ignore this email.
            </p>
            <p style="font-size: 12px; color: #333; margin: 8px 0 0 0;">© 2025 PlayVia. All rights reserved.</p>
          </div>
        </div>
      `,
    });

    if (data.error) {
      throw new Error(data.error.message);
    }

    console.log(`[Email] ✅ Email sent to ${to} — Message ID: ${data.data?.id}`);
    return data;
  } catch (error) {
    console.error(`[Email] ❌ Failed to send email to ${to}. Attempt ${retryCount + 1}/3.`);
    console.error('[Email] Error:', error.message);
    
    if (retryCount < 2) {
      // Wait 2 seconds before retrying
      await new Promise(resolve => setTimeout(resolve, 2000));
      return sendEmail({ to, subject, title, body, otp, expiry }, retryCount + 1);
    }
    
    throw new Error(`Email could not be sent after 3 attempts: ${error.message}`);
  }
};

/**
 * Send Verification Email
 */
const sendVerificationEmail = async (email, otp) => {
  await sendEmail({
    to: email,
    subject: '🔐 Verify your PlayVia account',
    title: 'Welcome to PlayVia!',
    body: 'Thank you for registering. Use the OTP below to verify your email address:',
    otp,
    expiry: process.env.OTP_EXPIRY_TIME || 10,
  });
};

/**
 * Send Password Reset Email
 */
const sendPasswordResetEmail = async (email, otp) => {
  await sendEmail({
    to: email,
    subject: '🔑 Reset your PlayVia password',
    title: 'Password Reset Request',
    body: 'We received a request to reset your password. Use the OTP below to proceed:',
    otp,
    expiry: process.env.OTP_EXPIRY_TIME || 10,
  });
};

module.exports = {
  sendVerificationEmail,
  sendPasswordResetEmail,
};
