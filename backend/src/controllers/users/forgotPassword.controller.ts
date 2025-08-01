import { Request, Response } from "express";
import { ApiResponse, ApiError } from "../../utils";
import { User } from "../../models";
import { sendPasswordResetEmail } from "../../utils/mailHelper";
import { nanoid } from "nanoid";

// Helper function to generate reset token
const generateResetToken = (): string => {
  return nanoid(32);
};

// Helper function to create forgot password response
const createForgotPasswordResponse = () => {
  return {
    status: 200,
    message: "Password reset email sent successfully",
    data: {
      message: "If the email exists, you will receive a password reset link"
    }
  };
};

export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    // Find user by email
    const user = await User.findOne({
      where: { email: email.toLowerCase() }
    });

    // Always return success for security (don't reveal if email exists)
    if (!user) {
      const responseConfig = createForgotPasswordResponse();
      return new ApiResponse(responseConfig).send(res);
    }

    // Generate reset token
    const resetToken = generateResetToken();
    const resetTokenExpiry = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    // Update user with reset token
    await user.update({
      resetPasswordToken: resetToken,
      resetPasswordExpires: resetTokenExpiry
    });

    // Send password reset email
    await sendPasswordResetEmail({
      email: user.email,
      resetToken,
      fullName: user.fullName || 'User'
    });

    // Create and send success response
    const responseConfig = createForgotPasswordResponse();
    
    new ApiResponse(responseConfig).send(res);
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    
    throw new ApiError({
      status: 500,
      message: "Failed to process password reset request",
      errors: [
        {
          message: error instanceof Error ? error.message : "Unknown error"
        }
      ]
    });
  }
};

export default forgotPassword;
