import { Request, Response } from "express";
import { ApiResponse, ApiError } from "../../utils";
import { RefreshToken } from "../../models";

// Helper function to invalidate refresh token
const invalidateRefreshToken = async (refreshTokenId: number): Promise<void> => {
  await RefreshToken.destroy({
    where: { id: refreshTokenId }
  });
};

// Helper function to create logout response
const createLogoutResponse = () => {
  return {
    status: 200,
    message: "Logged out successfully",
    data: {
      message: "User session has been terminated"
    }
  };
};

const logout = async (req: Request, res: Response) => {
  try {
    // Check if refresh token ID exists (from auth middleware)
    if (!req.refreshTokenId) {
      throw new ApiError({
        status: 400,
        message: "Invalid session",
      });
    }

    // Invalidate the refresh token
    await invalidateRefreshToken(req.refreshTokenId);

    // Create and send success response
    const responseConfig = createLogoutResponse();
    
    new ApiResponse(responseConfig).send(res);
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    
    throw new ApiError({
      status: 500,
      message: "Failed to logout",
      errors: [
        {
          message: error instanceof Error ? error.message : "Unknown error"
        }
      ]
    });
  }
};

export default logout;
