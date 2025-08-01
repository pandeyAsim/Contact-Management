import { Request, Response } from "express";
import { User, Role } from "../../models";
import { ApiResponse, ApiError } from "../../utils";

export const getUsers = async (req: Request, res: Response) => {
  try {
    console.log("Users endpoint hit by user:", req.user?.fullName, "with role:", req.user?.role?.title);
    
    const users = await User.findAll({
      attributes: ["id", "email", "fullName", "isEmailVerified", "createdAt", "updatedAt"],
      include: [
        {
          model: Role,
          attributes: ["id", "title"],
          required: false, // Left join to include users without roles
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    console.log("Found", users.length, "users in database");

    // Ensure all users have proper structure
    const formattedUsers = users.map(user => ({
      id: user.id,
      email: user.email || '',
      fullName: user.fullName || '',
      isEmailVerified: user.isEmailVerified || false,
      role: user.role ? { name: user.role.title, id: user.role.id } : { name: 'user', id: null },
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    }));

    console.log("Formatted users sample:", formattedUsers.slice(0, 2));

    new ApiResponse({
      status: 200,
      message: "Users retrieved successfully",
      data: { users: formattedUsers },
    }).send(res);
  } catch (error) {
    throw new ApiError({
      status: 500,
      message: "Failed to retrieve users",
      errors: [
        {
          message: error instanceof Error ? error.message : "Unknown error"
        }
      ]
    });
  }
};

export const createUser = async (req: Request, res: Response) => {
  try {
    const { fullName, email, password, roleId } = req.body;

    if (!fullName) {
      throw new ApiError({
        status: 400,
        message: "Full name is required",
      });
    }

    if (!email) {
      throw new ApiError({
        status: 400,
        message: "Email is required",
      });
    }

    if (!password) {
      throw new ApiError({
        status: 400,
        message: "Password is required",
      });
    }

    // Check if user with email already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      throw new ApiError({
        status: 400,
        message: "User with this email already exists",
      });
    }

    // Validate role if provided
    if (roleId) {
      const role = await Role.findByPk(roleId);
      if (!role) {
        throw new ApiError({
          status: 400,
          message: "Invalid role ID",
        });
      }
    }

    const bcrypt = require('bcryptjs');
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      fullName,
      email,
      password: hashedPassword,
      roleId: roleId || 2, // Default to user role (ID 2)
      isEmailVerified: true, // Admin-created users are verified by default
    });

    // Fetch the complete user with role
    const createdUser = await User.findByPk(user.id, {
      attributes: ["id", "email", "fullName", "isEmailVerified", "createdAt", "updatedAt"],
      include: [
        {
          model: Role,
          attributes: ["id", "title"],
          required: false,
        },
      ],
    });

    new ApiResponse({
      status: 201,
      message: "User created successfully",
      data: { user: createdUser },
    }).send(res);
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError({
      status: 500,
      message: "Failed to create user",
      errors: [
        {
          message: error instanceof Error ? error.message : "Unknown error"
        }
      ]
    });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  try {
    const userId = parseInt(req.params.id);
    const { fullName, email, role } = req.body;

    const user = await User.findByPk(userId);
    if (!user) {
      throw new ApiError({
        status: 404,
        message: "User not found",
      });
    }

    // Update basic user info
    const updateData: any = {};
    if (fullName !== undefined) updateData.fullName = fullName;
    if (email !== undefined) updateData.email = email;

    // Handle role update if provided
    if (role) {
      const roleRecord = await Role.findOne({ where: { title: role } });
      if (roleRecord) {
        updateData.roleId = roleRecord.id;
      }
    }

    await user.update(updateData);

    // Return updated user with role info
    const updatedUser = await User.findByPk(userId, {
      include: [
        {
          model: Role,
          attributes: ["id", "title"],
        },
      ],
    });

    new ApiResponse({
      status: 200,
      message: "User updated successfully",
      data: { 
        user: {
          id: updatedUser!.id,
          email: updatedUser!.email,
          fullName: updatedUser!.fullName,
          isEmailVerified: updatedUser!.isEmailVerified,
          role: updatedUser!.role ? { name: updatedUser!.role.title, id: updatedUser!.role.id } : { name: 'user', id: null }
        }
      },
    }).send(res);
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError({
      status: 500,
      message: "Failed to update user",
      errors: [
        {
          message: error instanceof Error ? error.message : "Unknown error"
        }
      ]
    });
  }
};

export const updateUserRole = async (req: Request, res: Response) => {
  try {
    const userId = parseInt(req.params.id);
    const { role } = req.body;

    if (!role) {
      throw new ApiError({
        status: 400,
        message: "Role is required",
      });
    }

    // Find the role by title
    const roleRecord = await Role.findOne({ where: { title: role } });
    if (!roleRecord) {
      throw new ApiError({
        status: 404,
        message: "Role not found",
      });
    }

    const user = await User.findByPk(userId);
    if (!user) {
      throw new ApiError({
        status: 404,
        message: "User not found",
      });
    }

    // Update user role
    await user.update({ roleId: roleRecord.id });

    // Return updated user with role info
    const updatedUser = await User.findByPk(userId, {
      include: [
        {
          model: Role,
          attributes: ["id", "title"],
        },
      ],
    });

    new ApiResponse({
      status: 200,
      message: "User role updated successfully",
      data: { 
        user: {
          id: updatedUser!.id,
          email: updatedUser!.email,
          fullName: updatedUser!.fullName,
          role: updatedUser!.role
        }
      },
    }).send(res);
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError({
      status: 500,
      message: "Failed to update user role",
      errors: [
        {
          message: error instanceof Error ? error.message : "Unknown error"
        }
      ]
    });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const userId = parseInt(req.params.id);
    
    // Prevent admin from deleting themselves
    if (req.user?.id === userId) {
      throw new ApiError({
        status: 400,
        message: "You cannot delete your own account",
      });
    }

    const user = await User.findByPk(userId);
    if (!user) {
      throw new ApiError({
        status: 404,
        message: "User not found",
      });
    }

    await user.destroy();

    new ApiResponse({
      status: 200,
      message: "User deleted successfully",
    }).send(res);
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError({
      status: 500,
      message: "Failed to delete user",
      errors: [
        {
          message: error instanceof Error ? error.message : "Unknown error"
        }
      ]
    });
  }
};
