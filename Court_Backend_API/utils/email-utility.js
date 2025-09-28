const nodemailer = require("nodemailer");
require("dotenv").config();

const sendResetEmail = async (to, resetLink) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASS,
      },
    });

    const body = generateResetEmailBody(resetLink);

    const mailOptions = {
      from: process.env.EMAIL,
      to,
      subject: "Password Reset Request",
      html: body,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`Password reset email sent: ${info.response}`);

    return info;
  } catch (error) {
    console.error("Error sending password reset email:", error);
    throw error;
  }
};

const generateResetEmailBody = (resetLink) => {
  const urlRegex = /(https?:\/\/[^\s]+)/g;

  const formattedLink = resetLink.replace(
    urlRegex,
    '<a href="$1" target="_blank" style="color: #007BFF; text-decoration: underline;">$1</a>'
  );
  return `
    <div style="font-family: Arial, sans-serif; line-height: 1.5; color: #333;">
      <h2>Password Reset Request</h2>
      <p>You requested to reset your password. Click the link below to reset it:</p>
      <p>${formattedLink}</p>
      <p>Or click the button below:</p>
      <p>
        <a href="${resetLink}" style="display: inline-block; padding: 10px 15px; background-color: #007BFF; color: #fff; text-decoration: none; border-radius: 5px;">
          Reset Password
        </a>
      </p>
      <p>If you didn't request a password reset, please ignore this email.</p>
      <p>Thanks, <br>Your App Team</p>
    </div>
  `;
};

const sendEmailOtp = async (email, otp) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASS,
      },
    });

    const body = generateEmailOtpBody(otp);

    const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: "Email verification",
      html: body,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`Password reset email sent: ${info.response}`);

    return info;
  } catch (error) {
    console.error("Error sending password reset email:", error);
    throw error;
  }
};

const generateEmailOtpBody = (otp) => {
  const urlRegex = /(https?:\/\/[^\s]+)/g;

  return `
    <div style="font-family: Arial, sans-serif; line-height: 1.5; color: #333;">
      <h2>Password Reset Request</h2>
      <p>Here is your otp to verify your email</p>
      <p>${otp}</p>
      <p>Thanks, <br>Your App Team</p>
    </div>
  `;
};

module.exports = { sendResetEmail, sendEmailOtp };