import { Request, Response } from "express";
import { ApiResponse, ApiError } from "../../utils";
import { Contact } from "../../models";

export const toggleStar = async (req: Request, res: Response) => {
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

    // Toggle the starred status
    const updatedContact = await contact.update({
      isStared: !contact.isStared,
    });

    new ApiResponse({
      status: 200,
      message: `Contact ${updatedContact.isStared ? 'starred' : 'unstarred'} successfully`,
      data: {
        id: updatedContact.id,
        isStared: updatedContact.isStared,
      },
    }).send(res);
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    
    throw new ApiError({
      status: 500,
      message: "Failed to toggle contact star status",
      errors: [
        {
          message: error instanceof Error ? error.message : "Unknown error"
        }
      ]
    });
  }
};
