"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.updateUserRole = exports.updateUser = exports.createUser = exports.getUsers = void 0;
const models_1 = require("../../models");
const utils_1 = require("../../utils");
const getUsers = async (req, res) => {
    try {
        console.log("Users endpoint hit by user:", req.user?.fullName, "with role:", req.user?.role?.title);
        const users = await models_1.User.findAll({
            attributes: ["id", "email", "fullName", "isEmailVerified", "createdAt", "updatedAt"],
            include: [
                {
                    model: models_1.Role,
                    attributes: ["id", "title"],
                    required: false,
                },
            ],
            order: [["createdAt", "DESC"]],
        });
        console.log("Found", users.length, "users in database");
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
        new utils_1.ApiResponse({
            status: 200,
            message: "Users retrieved successfully",
            data: { users: formattedUsers },
        }).send(res);
    }
    catch (error) {
        throw new utils_1.ApiError({
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
exports.getUsers = getUsers;
const createUser = async (req, res) => {
    try {
        const { fullName, email, password, roleId } = req.body;
        if (!fullName) {
            throw new utils_1.ApiError({
                status: 400,
                message: "Full name is required",
            });
        }
        if (!email) {
            throw new utils_1.ApiError({
                status: 400,
                message: "Email is required",
            });
        }
        if (!password) {
            throw new utils_1.ApiError({
                status: 400,
                message: "Password is required",
            });
        }
        const existingUser = await models_1.User.findOne({ where: { email } });
        if (existingUser) {
            throw new utils_1.ApiError({
                status: 400,
                message: "User with this email already exists",
            });
        }
        if (roleId) {
            const role = await models_1.Role.findByPk(roleId);
            if (!role) {
                throw new utils_1.ApiError({
                    status: 400,
                    message: "Invalid role ID",
                });
            }
        }
        const bcrypt = require('bcryptjs');
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await models_1.User.create({
            fullName,
            email,
            password: hashedPassword,
            roleId: roleId || 2,
            isEmailVerified: true,
        });
        const createdUser = await models_1.User.findByPk(user.id, {
            attributes: ["id", "email", "fullName", "isEmailVerified", "createdAt", "updatedAt"],
            include: [
                {
                    model: models_1.Role,
                    attributes: ["id", "title"],
                    required: false,
                },
            ],
        });
        new utils_1.ApiResponse({
            status: 201,
            message: "User created successfully",
            data: { user: createdUser },
        }).send(res);
    }
    catch (error) {
        if (error instanceof utils_1.ApiError) {
            throw error;
        }
        throw new utils_1.ApiError({
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
exports.createUser = createUser;
const updateUser = async (req, res) => {
    try {
        const userId = parseInt(req.params.id);
        const { fullName, email, role } = req.body;
        const user = await models_1.User.findByPk(userId);
        if (!user) {
            throw new utils_1.ApiError({
                status: 404,
                message: "User not found",
            });
        }
        const updateData = {};
        if (fullName !== undefined)
            updateData.fullName = fullName;
        if (email !== undefined)
            updateData.email = email;
        if (role) {
            const roleRecord = await models_1.Role.findOne({ where: { title: role } });
            if (roleRecord) {
                updateData.roleId = roleRecord.id;
            }
        }
        await user.update(updateData);
        const updatedUser = await models_1.User.findByPk(userId, {
            include: [
                {
                    model: models_1.Role,
                    attributes: ["id", "title"],
                },
            ],
        });
        new utils_1.ApiResponse({
            status: 200,
            message: "User updated successfully",
            data: {
                user: {
                    id: updatedUser.id,
                    email: updatedUser.email,
                    fullName: updatedUser.fullName,
                    isEmailVerified: updatedUser.isEmailVerified,
                    role: updatedUser.role ? { name: updatedUser.role.title, id: updatedUser.role.id } : { name: 'user', id: null }
                }
            },
        }).send(res);
    }
    catch (error) {
        if (error instanceof utils_1.ApiError) {
            throw error;
        }
        throw new utils_1.ApiError({
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
exports.updateUser = updateUser;
const updateUserRole = async (req, res) => {
    try {
        const userId = parseInt(req.params.id);
        const { role } = req.body;
        if (!role) {
            throw new utils_1.ApiError({
                status: 400,
                message: "Role is required",
            });
        }
        const roleRecord = await models_1.Role.findOne({ where: { title: role } });
        if (!roleRecord) {
            throw new utils_1.ApiError({
                status: 404,
                message: "Role not found",
            });
        }
        const user = await models_1.User.findByPk(userId);
        if (!user) {
            throw new utils_1.ApiError({
                status: 404,
                message: "User not found",
            });
        }
        await user.update({ roleId: roleRecord.id });
        const updatedUser = await models_1.User.findByPk(userId, {
            include: [
                {
                    model: models_1.Role,
                    attributes: ["id", "title"],
                },
            ],
        });
        new utils_1.ApiResponse({
            status: 200,
            message: "User role updated successfully",
            data: {
                user: {
                    id: updatedUser.id,
                    email: updatedUser.email,
                    fullName: updatedUser.fullName,
                    role: updatedUser.role
                }
            },
        }).send(res);
    }
    catch (error) {
        if (error instanceof utils_1.ApiError) {
            throw error;
        }
        throw new utils_1.ApiError({
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
exports.updateUserRole = updateUserRole;
const deleteUser = async (req, res) => {
    try {
        const userId = parseInt(req.params.id);
        if (req.user?.id === userId) {
            throw new utils_1.ApiError({
                status: 400,
                message: "You cannot delete your own account",
            });
        }
        const user = await models_1.User.findByPk(userId);
        if (!user) {
            throw new utils_1.ApiError({
                status: 404,
                message: "User not found",
            });
        }
        await user.destroy();
        new utils_1.ApiResponse({
            status: 200,
            message: "User deleted successfully",
        }).send(res);
    }
    catch (error) {
        if (error instanceof utils_1.ApiError) {
            throw error;
        }
        throw new utils_1.ApiError({
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
exports.deleteUser = deleteUser;
