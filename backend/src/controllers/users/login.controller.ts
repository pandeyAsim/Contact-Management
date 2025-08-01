import { RefreshToken, Role, User } from "../../models";
import { ApiError, ApiResponse } from "../../utils";
import { Request, Response } from "express";
import bcrypt from "bcrypt";
import {
  generateAccessToken,
  generateRefreshToken,
  JWT_REFRESH_EXPIRES_IN,
} from "../../utils/jwtUtils";
import { getQualifiedImageUrl } from "../../utils/helper";

const login = async (req: Request, res: Response) => {
  // Get email and password from request body
  const { email, password } = req.body;

  // Get user by email from DB
  const user = await User.findOne({
    where: { email },
    include: [
      {
        model: Role,
        attributes: ["id", "title"],
      },
    ],
  });

  // Check if user exists, if not, throw error
  if (!user) {
    throw new ApiError({
      status: 401,
      message: "Invalid email or password",
    });
  }

  // compare password with hashed password in DB
  const isPasswordValid = await bcrypt.compare(password, user.password);

  // If password is not valid, throw error
  if (!isPasswordValid) {
    throw new ApiError({
      status: 401,
      message: "Invalid email or password",
    });
  }

  if (!user.isEmailVerified) {
    throw new ApiError({
      status: 403,
      message: "Email not verified",
      errors: [
        {
          isEmailVerified:
            "Email not verified. Please verify your email to login.",
        },
      ],
    });
  }

  //   Generate Refresh Token with user id in payload
  const refreshToken = await generateRefreshToken({
    payload: {
      userId: user.id,
    },
  });

  // Save Refresh Token to DB
  const createdRefreshToken = await RefreshToken.create({
    userId: user.id!,
    token: refreshToken,
    expiresAt: new Date(
      new Date().getTime() + JWT_REFRESH_EXPIRES_IN * 60 * 1000
    ),
  });

  //   Generate Access Token with refresh token id in payload
  const accessToken = await generateAccessToken({
    payload: {
      userId: user.id,
      refreshTokenId: createdRefreshToken.id,
    },
  });

  user.dataValues.avatar = getQualifiedImageUrl(user?.avatar);

  //   Send response
  const userJson = user.toJSON();
  new ApiResponse({
    status: 200,
    message: "Login successful",
    data: {
      accessToken,
      refreshToken,
      user: {
        id: userJson.id,
        fullName: userJson.fullName,
        email: userJson.email,
        avatar: userJson.avatar,
        isEmailVerified: userJson.isEmailVerified,
        role: userJson.role ? {
          id: userJson.role.id,
          title: userJson.role.title,
        } : undefined,
      },
    },
  }).send(res);
};

export default login;
