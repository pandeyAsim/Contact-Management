import { Request, Response } from "express";
import { ApiResponse, ApiError } from "../../utils";
import { User } from "../../models";
import bcrypt from "bcrypt";

// Helper function to validate reset token
const validateResetToken = async (token: string): Promise<User | null> => {
  const user = await User.findOne({
    where: {
      resetPasswordToken: token,
    }
  });

  if (!user || !user.resetPasswordExpires) {
    return null;
  }

  // Check if token has expired
  if (user.resetPasswordExpires < new Date()) {
    return null;
  }

  return user;
};

// Helper function to hash new password
const hashNewPassword = async (password: string): Promise<string> => {
  return await bcrypt.hash(password, 10);
};

// Helper function to clear reset token fields
const clearResetTokenFields = async (user: User): Promise<void> => {
  await user.update({
    resetPasswordToken: undefined,
    resetPasswordExpires: undefined
  });
};

// Helper function to create reset password response
const createResetPasswordResponse = () => {
  return {
    status: 200,
    message: "Password reset successfully",
    data: {
      message: "Your password has been updated. You can now login with your new password."
    }
  };
};

export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { token, password } = req.body;

    // Validate reset token
    const user = await validateResetToken(token);

    if (!user) {
      throw new ApiError({
        status: 400,
        message: "Invalid or expired reset token",
      });
    }

    // Hash new password
    const hashedPassword = await hashNewPassword(password);

    // Update user password
    await user.update({
      password: hashedPassword
    });

    // Clear reset token fields
    await clearResetTokenFields(user);

    // Create and send success response
    const responseConfig = createResetPasswordResponse();
    
    new ApiResponse(responseConfig).send(res);
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    
    throw new ApiError({
      status: 500,
      message: "Failed to reset password",
      errors: [
        {
          message: error instanceof Error ? error.message : "Unknown error"
        }
      ]
    });
  }
};

export default resetPassword;
