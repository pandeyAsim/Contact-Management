import { Request, Response } from "express";
import { ApiResponse, ApiError } from "../../utils";
import { Contact, Category } from "../../models";
import { getQualifiedImageUrl } from "../../utils/helper";
import fs from "fs";
import path from "path";

export const update = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
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
      isStared,
    } = req.body;

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

    // Check if email is being changed and if it conflicts with another contact
    if (email && email.toLowerCase() !== contact.email.toLowerCase()) {
      const existingContact = await Contact.findOne({
        where: {
          email: email.toLowerCase(),
          userId: req.user.id!,
          id: { [Symbol.for('sequelize.op.ne')]: parseInt(id) }, // Exclude current contact
        },
      });

      if (existingContact) {
        throw new ApiError({
          status: 409,
          message: "Another contact with this email already exists",
        });
      }
    }

    // Handle avatar upload
    let avatarPath = contact.avatar;
    if (req.file) {
      // Delete old avatar if it exists
      if (contact.avatar) {
        const oldAvatarPath = path.join(process.cwd(), 'uploads', 'contact_images', contact.avatar);
        if (fs.existsSync(oldAvatarPath)) {
          fs.unlinkSync(oldAvatarPath);
        }
      }
      avatarPath = req.file.filename;
    }

    // Prepare update data
    const updateData: any = {};
    
    if (fullName !== undefined) updateData.fullName = fullName.trim();
    if (company !== undefined) updateData.company = company?.trim();
    if (phoneNumber !== undefined) updateData.phoneNumber = phoneNumber.trim();
    if (email !== undefined) updateData.email = email.toLowerCase().trim();
    if (address !== undefined) updateData.address = address?.trim();
    if (gender !== undefined) updateData.gender = gender?.toLowerCase();
    if (department !== undefined) updateData.department = department?.trim();
    if (notes !== undefined) updateData.notes = notes?.trim();
    if (categoryId !== undefined) updateData.categoryId = categoryId || undefined;
    if (isStared !== undefined) updateData.isStared = Boolean(isStared);
    if (req.file) updateData.avatar = avatarPath;

    // Update the contact
    await contact.update(updateData);

    // Fetch the updated contact with associations
    const updatedContact = await Contact.findByPk(contact.id, {
      include: [
        {
          model: Category,
          attributes: ["id", "name", "slug"],
        },
      ],
    });

    // Format the response data
    const responseData = {
      ...updatedContact!.toJSON(),
      avatar: getQualifiedImageUrl(updatedContact!.avatar),
    };

    new ApiResponse({
      status: 200,
      message: "Contact updated successfully",
      data: responseData,
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
