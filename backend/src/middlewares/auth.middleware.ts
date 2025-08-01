import { getAuthToken, verifyToken } from "../utils/jwtUtils";
import { ApiError } from "../utils";
import { NextFunction, Request, Response } from "express";
import { RefreshToken, Role, User } from "../models";
import env from "../config/env.config";
import { getQualifiedImageUrl } from "../utils/helper";

const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    console.log('=== AUTH MIDDLEWARE DEBUG ===');
    console.log('Request URL:', req.url);
    console.log('Authorization header:', req.headers.authorization);
    
    const token = getAuthToken({ req });
    console.log('Extracted token:', token ? 'Present' : 'Missing');

    if (!token) {
      console.log('❌ Token not provided');
      throw new ApiError({
        status: 401,
        message: "Token not provided",
      });
    }

    console.log('Verifying token...');
    const payload = verifyToken({ token });
    console.log('Token payload:', payload ? 'Valid' : 'Invalid');

    if (!payload) {
      console.log('❌ Invalid token payload');
      throw new ApiError({
        status: 401,
        message: "Invalid token",
      });
    }

    const refreshTokenId = payload.refreshTokenId;
    console.log('Refresh token ID from payload:', refreshTokenId);

    //get refresh token from DB if it exists
    const refreshToken = await RefreshToken.findOne({
      where: { id: refreshTokenId },
    });
    console.log('Refresh token found in DB:', refreshToken ? 'Yes' : 'No');

    if (!refreshToken) {
      console.log('❌ Refresh token not found in DB');
      throw new ApiError({
        status: 401,
        message: "Refresh token not found",
      });
    }

    const now = new Date();
    console.log('Current time:', now);
    console.log('Refresh token expires at:', refreshToken.expiresAt);
    console.log('Is refresh token expired?', refreshToken.expiresAt < now);

    if (refreshToken.expiresAt < new Date()) {
      console.log('❌ Refresh token expired');
      throw new ApiError({
        status: 401,
        message: "Refresh token expired",
      });
    }

    if (refreshToken.isExpired) {
      console.log('❌ Refresh token marked as expired');
      throw new ApiError({
        status: 401,
        message: "Refresh token is expired",
      });
    }

    // Verify refresh token
    console.log('Verifying refresh token...');
    await verifyToken({
      token: refreshToken.token,
    });

    console.log('Looking up user with ID:', payload.userId);
    const user = await User.findOne({
      where: { id: payload.userId },
      attributes: ["id", "email", "isEmailVerified", "fullName", "avatar"],
      include: [
        {
          model: Role,
          attributes: ["id", "title"],
        },
      ],
    });

    console.log('User found:', user ? `${user.fullName} (${user.email})` : 'Not found');

    if (!user) {
      console.log('❌ User not found');
      throw new ApiError({
        status: 401,
        message: "User not found",
      });
    }

    console.log('User email verified:', user.isEmailVerified);
    if (!user.isEmailVerified) {
      console.log('❌ Email not verified');
      throw new ApiError({
        status: 403,
        message: "Email not verified",
      });
    }

    user!.dataValues.avatar = getQualifiedImageUrl(user?.avatar);

    req.user = user;
    req.refreshTokenId = refreshTokenId;
    console.log('✅ Authentication successful for user:', user.fullName);
    console.log('User role:', user.role?.title);
    next();
  } catch (error) {
    console.log('❌ Auth middleware error:', error);
    if (error instanceof ApiError) {
      return next(error);
    }

    throw new ApiError({
      status: 401,
      message: "Unauthorized access",
    });
  }
};

export default authMiddleware;
