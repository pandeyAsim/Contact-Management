import { Request, Response } from "express";
import { Contact, Category, User } from "../../models";
import { ApiResponse, ApiError } from "../../utils";

export const getContacts = async (req: Request, res: Response) => {
  try {
    const contacts = await Contact.findAll({
      include: [
        {
          model: Category,
          attributes: ["id", "name"],
          required: false,
        },
        {
          model: User,
          attributes: ["id", "fullName", "email"],
          required: false,
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    new ApiResponse({
      status: 200,
      message: "Contacts retrieved successfully",
      data: { contacts },
    }).send(res);
  } catch (error) {
    throw new ApiError({
      status: 500,
      message: "Failed to retrieve contacts",
      errors: [
        {
          message: error instanceof Error ? error.message : "Unknown error"
        }
      ]
    });
  }
};

export const createContact = async (req: Request, res: Response) => {
  try {
    const { fullName, email, phoneNumber, categoryId, userId } = req.body;

    if (!fullName) {
      throw new ApiError({
        status: 400,
        message: "Contact full name is required",
      });
    }

    if (!email) {
      throw new ApiError({
        status: 400,
        message: "Contact email is required",
      });
    }

    // Validate category if provided
    if (categoryId) {
      const category = await Category.findByPk(categoryId);
      if (!category) {
        throw new ApiError({
          status: 400,
          message: "Invalid category ID",
        });
      }
    }

    // Validate user if provided
    if (userId) {
      const user = await User.findByPk(userId);
      if (!user) {
        throw new ApiError({
          status: 400,
          message: "Invalid user ID",
        });
      }
    }

    const contact = await Contact.create({
      fullName,
      email,
      phoneNumber,
      categoryId: categoryId || null,
      userId: userId || 1, // Default to user ID 1 if not provided
    });

    // Fetch the complete contact with associations
    const createdContact = await Contact.findByPk(contact.id, {
      include: [
        {
          model: Category,
          attributes: ["id", "name"],
          required: false,
        },
        {
          model: User,
          attributes: ["id", "fullName", "email"],
          required: false,
        },
      ],
    });

    new ApiResponse({
      status: 201,
      message: "Contact created successfully",
      data: { contact: createdContact },
    }).send(res);
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError({
      status: 500,
      message: "Failed to create contact",
      errors: [
        {
          message: error instanceof Error ? error.message : "Unknown error"
        }
      ]
    });
  }
};

export const updateContact = async (req: Request, res: Response) => {
  try {
    const contactId = parseInt(req.params.id);
    const { fullName, email, phoneNumber, categoryId } = req.body;

    const contact = await Contact.findByPk(contactId);
    if (!contact) {
      throw new ApiError({
        status: 404,
        message: "Contact not found",
      });
    }

    const updateData: any = {};
    if (fullName !== undefined) updateData.fullName = fullName;
    if (email !== undefined) updateData.email = email;
    if (phoneNumber !== undefined) updateData.phoneNumber = phoneNumber;
    if (categoryId !== undefined) updateData.categoryId = categoryId || null;

    await contact.update(updateData);

    // Return updated contact with relationships
    const updatedContact = await Contact.findByPk(contactId, {
      include: [
        {
          model: Category,
          attributes: ["id", "name"],
          required: false,
        },
        {
          model: User,
          attributes: ["id", "fullName", "email"],
          required: false,
        },
      ],
    });

    new ApiResponse({
      status: 200,
      message: "Contact updated successfully",
      data: { contact: updatedContact },
    }).send(res);
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError({
      status: 500,
      message: "Failed to update contact",
      errors: [
        {
          message: error instanceof Error ? error.message : "Unknown error"
        }
      ]
    });
  }
};

export const deleteContact = async (req: Request, res: Response) => {
  try {
    const contactId = parseInt(req.params.id);
    
    const contact = await Contact.findByPk(contactId);
    if (!contact) {
      throw new ApiError({
        status: 404,
        message: "Contact not found",
      });
    }

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
