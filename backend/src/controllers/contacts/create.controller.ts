import { Contact, Category } from "../../models";
import { ApiResponse, ApiError } from "../../utils";
import { Request, Response } from "express";
import { getQualifiedImageUrl } from "../../utils/helper";

export const create = async (req: Request, res: Response) => {
  try {
    const {
      fullName,
      company,
      phoneNumber,
      email,
      address,
      gender,
      department,
      notes,
      categoryId,
    } = req.body;

    // Validate required fields
    if (!fullName || !phoneNumber || !email) {
      throw new ApiError({
        status: 400,
        message: "Missing required fields",
        errors: [
          {
            message: "fullName, phoneNumber, and email are required"
          }
        ]
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

    // Check if contact with same email already exists for this user
    const existingContact = await Contact.findOne({
      where: {
        email: email.toLowerCase(),
        userId: req.user.id,
      },
    });

    if (existingContact) {
      throw new ApiError({
        status: 409,
        message: "Contact with this email already exists",
      });
    }

    // Handle file upload (avatar)
    const avatarPath = req.file ? req.file.filename : undefined;

    // Create the contact
    const contact = await Contact.create({
      fullName: fullName.trim(),
      company: company?.trim(),
      avatar: avatarPath,
      phoneNumber: phoneNumber.trim(),
      email: email.toLowerCase().trim(),
      address: address?.trim(),
      gender: gender?.toLowerCase(),
      department: department?.trim(),
      notes: notes?.trim(),
      categoryId: categoryId || undefined,
      userId: req.user.id!,
      isStared: false,
      viewsCount: 0,
    });

    // Fetch the created contact with associations
    const createdContact = await Contact.findByPk(contact.id, {
      include: [
        {
          model: Category,
          attributes: ["id", "name"],
        },
      ],
    });

    // Format the response data
    const responseData = {
      ...createdContact!.toJSON(),
      avatar: getQualifiedImageUrl(createdContact!.avatar),
    };

    new ApiResponse({
      status: 201,
      message: "Contact created successfully",
      data: responseData,
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
