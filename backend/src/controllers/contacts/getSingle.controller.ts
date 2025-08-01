import { Request, Response } from "express";
import { ApiResponse, ApiError } from "../../utils";
import { Contact, Category, User } from "../../models";
import { getQualifiedImageUrl } from "../../utils/helper";

export const getSingle = async (req: Request, res: Response) => {
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
        userId: req.user.id!, // Ensure user can only access their own contacts
      },
      include: [
        {
          model: Category,
          attributes: ["id", "name", "slug"],
        },
        {
          model: User,
          attributes: ["id", "email", "fullName"],
        },
      ],
    });

    if (!contact) {
      throw new ApiError({
        status: 404,
        message: "Contact not found",
      });
    }

    // Increment views count for analytics
    await contact.increment('viewsCount');

    // Format the response data
    const responseData = {
      ...contact.toJSON(),
      avatar: getQualifiedImageUrl(contact.avatar),
      viewsCount: contact.viewsCount + 1, // Include the incremented count
    };

    new ApiResponse({
      status: 200,
      message: "Contact retrieved successfully",
      data: responseData,
    }).send(res);
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    
    throw new ApiError({
      status: 500,
      message: "Failed to retrieve contact",
      errors: [
        {
          message: error instanceof Error ? error.message : "Unknown error"
        }
      ]
    });
  }
};
