import { Request, Response } from "express";
import { Role } from "../../models";
import { ApiResponse, ApiError } from "../../utils";

export const getRoles = async (req: Request, res: Response) => {
  try {
    const roles = await Role.findAll({
      attributes: ["id", "title"],
      order: [["title", "ASC"]],
    });

    new ApiResponse({
      status: 200,
      message: "Roles retrieved successfully",
      data: { roles },
    }).send(res);
  } catch (error) {
    throw new ApiError({
      status: 500,
      message: "Failed to retrieve roles",
      errors: [
        {
          message: error instanceof Error ? error.message : "Unknown error"
        }
      ]
    });
  }
};

export const createRole = async (req: Request, res: Response) => {
  try {
    const { title } = req.body;

    // Validate title
    if (!title || title.trim() === '') {
      throw new ApiError({
        status: 400,
        message: "Title is required",
        errors: [
          {
            field: "title",
            message: "Title must be a non-empty string"
          }
        ]
      });
    }

    // Check if role with same title exists
    const existingRole = await Role.findOne({ where: { title: title.trim() } });
    if (existingRole) {
      throw new ApiError({
        status: 400,
        message: "Role with this title already exists",
      });
    }

    const role = await Role.create({
      title: title.trim(),
    });

    new ApiResponse({
      status: 201,
      message: "Role created successfully",
      data: { role },
    }).send(res);
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError({
      status: 500,
      message: "Failed to create role",
      errors: [
        {
          message: error instanceof Error ? error.message : "Unknown error"
        }
      ]
    });
  }
};

export const deleteRole = async (req: Request, res: Response) => {
  try {
    const roleId = parseInt(req.params.id);
    
    const role = await Role.findByPk(roleId);
    if (!role) {
      throw new ApiError({
        status: 404,
        message: "Role not found",
      });
    }

    // Prevent deletion of system roles (admin, user, etc.)
    const systemRoles = ['admin', 'user', 'editor'];
    if (systemRoles.includes(role.title.toLowerCase())) {
      throw new ApiError({
        status: 400,
        message: "Cannot delete system roles",
      });
    }

    await role.destroy();

    new ApiResponse({
      status: 200,
      message: "Role deleted successfully",
    }).send(res);
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError({
      status: 500,
      message: "Failed to delete role",
      errors: [
        {
          message: error instanceof Error ? error.message : "Unknown error"
        }
      ]
    });
  }
};
