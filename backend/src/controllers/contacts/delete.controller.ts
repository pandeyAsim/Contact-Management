import { Request, Response } from "express";
import { ApiResponse, ApiError } from "../../utils";
import { Contact } from "../../models";
import fs from "fs";
import path from "path";

export const destroy = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id) {
      throw new ApiError({
        status: 400,
        message: "Contact ID is required",
      });
    }

    // Find the contact and ensure it belongs to the authenticated user
    const contact = await Contact.findOne({
      where: {
        id: parseInt(id),
        userId: req.user.id!,
      },
    });

    if (!contact) {
      throw new ApiError({
        status: 404,
        message: "Contact not found",
      });
    }

    // Delete avatar file if it exists
    if (contact.avatar) {
      const avatarPath = path.join(process.cwd(), 'uploads', 'contact_images', contact.avatar);
      if (fs.existsSync(avatarPath)) {
        try {
          fs.unlinkSync(avatarPath);
        } catch (fileError) {
          console.warn(`Failed to delete avatar file: ${avatarPath}`, fileError);
          // Don't throw error for file deletion failure
        }
      }
    }

    // Soft delete the contact (thanks to paranoid: true in the model)
    await contact.destroy();

    new ApiResponse({
      status: 200,
      message: "Contact deleted successfully",
    }).send(res);
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    
    throw new ApiError({
      status: 500,
      message: "Failed to delete contact",
      errors: [
        {
          message: error instanceof Error ? error.message : "Unknown error"
        }
      ]
    });
  }
};
