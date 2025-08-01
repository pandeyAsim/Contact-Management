import { RefreshToken, Role, User } from "../../models";
import { ApiError, ApiResponse } from "../../utils";
import {
  generateAccessToken,
  getAuthToken,
  verifyToken,
} from "../../utils/jwtUtils";
import { Request, Response } from "express";

const refreshToken = async (req: Request, res: Response): Promise<void> => {
  const token = getAuthToken({ req });

  // check if token exists
  if (!token) {
    throw new ApiError({
      status: 401,
      message: "Unauthorized",
      errors: [
        {
          token: "Token not found",
        },
      ],
      stack: "Token not found",
    });
  }

  try {
    const decodedToken = await verifyToken({ token });

    if (!decodedToken) {
      throw new ApiError({
        status: 401,
        message: "Unauthorized",
        errors: [
          {
            token: "Token not valid",
          },
        ],
        stack: "Token not valid",
      });
    }

    const refreshToken = await RefreshToken.findOne({
      where: {
        token: token,
      },
    });

    if (!refreshToken) {
      throw new ApiError({
        message: "Invalid token",
        status: 401,
        errors: [
          {
            token: "Invalid token",
          },
        ],
      });
    }

    // check if refresh token is expired
    if (refreshToken.isExpired) {
      throw new ApiError({
        status: 401,
        message: "Unauthorized",
        errors: [
          {
            token: "Refresh token expired",
          },
        ],
        stack: "Refresh token expired",
      });
    }

    if (refreshToken.expiresAt < new Date()) {
      throw new ApiError({
        message: "Invalid token",
        status: 401,
        errors: [
          {
            token: "Token expired",
          },
        ],
      });
    }

    const user = await User.findByPk(decodedToken!.userId, {
      attributes: ["id", "email"],
      include: [
        {
          model: Role,
          attributes: ["id", "title"],
        },
      ],
    });

    if (!user) {
      throw new ApiError({
        status: 401,
        message: "Unauthorized",
        errors: [
          {
            token: "User not found",
          },
        ],
        stack: "User not found",
      });
    }

    const accessToken = await generateAccessToken({
      payload: {
        userId: user.id,
        refreshTokenId: refreshToken.id,
      },
    });

    new ApiResponse({
      status: 200,
      message: "Refresh token",
      data: {
        accessToken,
        user,
      },
    }).send(res);
  } catch (error: any) {
    console.error("Error in refreshToken controller:", error);
    throw new ApiError({
      status: 401,
      message: "Unauthorized",
      stack: error.stack,
    });
  }
};

export default refreshToken;
