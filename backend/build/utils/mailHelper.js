"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendPasswordResetEmail = void 0;
const tslib_1 = require("tslib");
const nodemailer_1 = tslib_1.__importDefault(require("nodemailer"));
const env_config_1 = tslib_1.__importDefault(require("../config/env.config"));
const transporter = nodemailer_1.default.createTransport({
    service: "gmail",
    auth: {
        user: env_config_1.default.GMAIL_USER,
        pass: env_config_1.default.GMAIL_APP_PASSWORD,
    },
});
const sendMail = async ({ to, subject, body, }) => {
    try {
        console.log("Attempting to send email to:", to);
        console.log("Gmail user:", env_config_1.default.GMAIL_USER);
        console.log("App password configured:", !!env_config_1.default.GMAIL_APP_PASSWORD);
        const result = await transporter.sendMail({
            from: `"Contact Management" <${env_config_1.default.GMAIL_USER}>`,
            to,
            subject,
            html: body,
        });
        console.log("Email sent successfully:", result.messageId);
        return result;
    }
    catch (error) {
        console.log("Failed to send email:", error);
        throw error;
    }
};
const sendPasswordResetEmail = async ({ email, resetToken, fullName, }) => {
    const resetLink = `${env_config_1.default.FRONTEND_URL}/reset-password?token=${resetToken}`;
    const emailBody = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>Password Reset Request</h2>
      <p>Hello ${fullName},</p>
      <p>You requested to reset your password. Click the link below to reset your password:</p>
      <a href="${resetLink}" style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">
        Reset Password
      </a>
      <p>This link will expire in 15 minutes.</p>
      <p>If you didn't request this, please ignore this email.</p>
      <p>Best regards,<br>Contact Management Team</p>
    </div>
  `;
    await sendMail({
        to: email,
        subject: "Password Reset Request",
        body: emailBody,
    });
};
exports.sendPasswordResetEmail = sendPasswordResetEmail;
exports.default = sendMail;
