import nodemailer from "nodemailer";
import env from "../config/env.config";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: env.GMAIL_USER,
    pass: env.GMAIL_APP_PASSWORD,
  },
});

const sendMail = async ({
  to,
  subject,
  body,
}: {
  to: string;
  subject: string;
  body: string;
}) => {
  try {
    console.log("Attempting to send email to:", to);
    console.log("Gmail user:", env.GMAIL_USER);
    console.log("App password configured:", !!env.GMAIL_APP_PASSWORD);
    
    const result = await transporter.sendMail({
      from: `"Contact Management" <${env.GMAIL_USER}>`,
      to,
      subject,
      html: body,
    });
    
    console.log("Email sent successfully:", result.messageId);
    return result;
  } catch (error) {
    console.log("Failed to send email:", error);
    throw error; // Re-throw to handle in calling function
  }
};

export const sendPasswordResetEmail = async ({
  email,
  resetToken,
  fullName,
}: {
  email: string;
  resetToken: string;
  fullName: string;
}) => {
  const resetLink = `${env.FRONTEND_URL}/reset-password?token=${resetToken}`;
  
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

export default sendMail;
