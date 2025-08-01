import { Request, Response } from "express";
import { User, Role } from "../../models";
import { ApiResponse, ApiError } from "../../utils";
import { getQualifiedImageUrl } from "../../utils/helper";
import bcrypt from "bcrypt";

const updateProfile = async (req: Request, res: Response) => {
  try {
    if (!req.user || !req.user.id) {
      throw new ApiError({
        status: 401,
        message: "User not authenticated",
      });
    }

    const { fullName, email, currentPassword, newPassword } = req.body;

    // Find the user
    const user = await User.findOne({
      where: { id: req.user.id },
      include: [
        {
          model: Role,
          attributes: ["id", "title"],
        },
      ],
    });

    if (!user) {
      throw new ApiError({
        status: 404,
        message: "User not found",
      });
    }

    // Prepare update data
    const updateData: any = {};

    // Update fullName if provided
    if (fullName !== undefined && fullName.trim() !== user.fullName) {
      if (fullName.trim() === '') {
        throw new ApiError({
          status: 400,
          message: "Full name cannot be empty",
        });
      }
      updateData.fullName = fullName.trim();
    }

    // Update email if provided
    if (email !== undefined && email.toLowerCase() !== user.email.toLowerCase()) {
      // Check if email is already taken by another user
      const existingUser = await User.findOne({
        where: { 
          email: email.toLowerCase(),
          id: { [Symbol.for('sequelize.op.ne')]: req.user.id }
        },
      });

      if (existingUser) {
        throw new ApiError({
          status: 409,
          message: "Email address is already taken",
        });
      }

      updateData.email = email.toLowerCase().trim();
      // When email is changed, mark as unverified
      updateData.isEmailVerified = false;
    }

    // Update password if provided
    if (newPassword) {
      if (!currentPassword) {
        throw new ApiError({
          status: 400,
          message: "Current password is required to change password",
        });
      }

      // Verify current password
      const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
      if (!isCurrentPasswordValid) {
        throw new ApiError({
          status: 400,
          message: "Current password is incorrect",
        });
      }

      // Hash new password
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      updateData.password = hashedPassword;
    }

    // Only proceed if there are changes
    if (Object.keys(updateData).length === 0) {
      throw new ApiError({
        status: 400,
        message: "No changes provided",
      });
    }

    // Update the user
    await user.update(updateData);

    // Fetch updated user data
    const updatedUser = await User.findOne({
      where: { id: req.user.id },
      attributes: ["id", "email", "isEmailVerified", "fullName", "avatar", "createdAt", "updatedAt"],
      include: [
        {
          model: Role,
          attributes: ["id", "title"],
        },
      ],
    });

    // Prepare response data
    const userData = {
      id: updatedUser!.id,
      email: updatedUser!.email,
      fullName: updatedUser!.fullName,
      avatar: getQualifiedImageUrl(updatedUser!.avatar),
      isEmailVerified: updatedUser!.isEmailVerified,
      role: updatedUser!.role,
      createdAt: updatedUser!.createdAt,
      updatedAt: updatedUser!.updatedAt,
    };

    new ApiResponse({
      status: 200,
      message: "Profile updated successfully",
      data: userData,
    }).send(res);
  } catch (error) {
    console.error('Update profile error:', error);
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError({
      status: 500,
      message: "Internal server error while updating profile",
      errors: [{ server: error instanceof Error ? error.message : 'Unknown error' }]
    });
  }
};

export default updateProfile;
