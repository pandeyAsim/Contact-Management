import path from "path";
import { Role, User } from "../../models";
import { ApiError, ApiResponse } from "../../utils";
import { Request, Response } from "express";
import FileStorageDirectory from "../../enums/FileStorageDirectory.enum";
import { getQualifiedImageUrl } from "../../utils/helper";

const updateProfileImage = async (req: Request, res: Response) => {
  try {
    console.log('req.file:', req.file);
    console.log('req.body:', req.body);
    console.log('req.user:', req.user);
    
    if (!req.file) {
      throw new ApiError({
        status: 400,
        message: "No file uploaded",
      });
    }

    if (!req.user || !req.user.id) {
      throw new ApiError({
        status: 401,
        message: "User not authenticated",
      });
    }

    const imgPath = path.join(
      FileStorageDirectory.UPLOADS,
      FileStorageDirectory.PROFILE_PICTURES,
      req.file.filename
    );

    console.log('Updating user with ID:', req.user.id);
    console.log('Image path:', imgPath);

    const updateResult = await User.update(
      { avatar: imgPath },
      {
        where: {
          id: req.user.id,
        },
      }
    );

    console.log('Update result:', updateResult);

    const updatedUser = await User.findOne({
      where: { id: req.user.id },
      include: [
        {
          model: Role,
          as: "role",
          attributes: ["id", "title"],
        },
      ],
      attributes: {
        exclude: ["password", "createdAt", "updatedAt", "deletedAt"],
      },
    });

    if (!updatedUser) {
      throw new ApiError({
        status: 404,
        message: "User not found after update",
      });
    }

    // Update the avatar URL with default fallback
    updatedUser.dataValues.avatar = getQualifiedImageUrl(updatedUser.avatar);

    new ApiResponse({
      status: 200,
      message: "Profile image updated successfully",
      data: updatedUser,
    }).send(res);
  } catch (error) {
    console.error('Update profile image error:', error);
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError({
      status: 500,
      message: "Internal server error while updating profile image",
      errors: [{ server: error instanceof Error ? error.message : 'Unknown error' }]
    });
  }
};

export default updateProfileImage;
