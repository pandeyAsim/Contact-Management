import { User, Role } from "../../models";
import { ApiResponse, ApiError } from "../../utils";
import { Request, Response } from "express";
import { getQualifiedImageUrl } from "../../utils/helper";

const getProfile = async (req: Request, res: Response) => {
  try {
    // The authMiddleware should have already validated the token and attached the user
    // But let's add extra safety checks
    if (!req.user) {
      throw new ApiError({
        status: 401,
        message: "User not authenticated",
      });
    }

    // Fetch fresh user data with role information to ensure data integrity
    const user = await User.findOne({
      where: { id: req.user.id },
      attributes: ["id", "email", "isEmailVerified", "fullName", "avatar", "createdAt", "updatedAt"],
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

    // Ensure the user's email is verified
    if (!user.isEmailVerified) {
      throw new ApiError({
        status: 403,
        message: "Email not verified. Please verify your email before accessing your profile.",
      });
    }

    // Prepare user data for response
    const userData = {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      avatar: getQualifiedImageUrl(user.avatar),
      isEmailVerified: user.isEmailVerified,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    new ApiResponse({
      status: 200,
      message: "Profile retrieved successfully",
      data: userData,
    }).send(res);
  } catch (error) {
    // If it's already an ApiError, just throw it
    if (error instanceof ApiError) {
      throw error;
    }
    
    // For any other error, wrap it
    throw new ApiError({
      status: 500,
      message: "Failed to retrieve profile",
      errors: [
        {
          message: error instanceof Error ? error.message : "Unknown error"
        }
      ]
    });
  }
};

export default getProfile;
