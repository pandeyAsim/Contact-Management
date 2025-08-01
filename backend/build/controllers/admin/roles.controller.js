"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteRole = exports.createRole = exports.getRoles = void 0;
const models_1 = require("../../models");
const utils_1 = require("../../utils");
const getRoles = async (req, res) => {
    try {
        const roles = await models_1.Role.findAll({
            attributes: ["id", "title"],
            order: [["title", "ASC"]],
        });
        new utils_1.ApiResponse({
            status: 200,
            message: "Roles retrieved successfully",
            data: { roles },
        }).send(res);
    }
    catch (error) {
        throw new utils_1.ApiError({
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
exports.getRoles = getRoles;
const createRole = async (req, res) => {
    try {
        const { title } = req.body;
        if (!title || title.trim() === '') {
            throw new utils_1.ApiError({
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
        const existingRole = await models_1.Role.findOne({ where: { title: title.trim() } });
        if (existingRole) {
            throw new utils_1.ApiError({
                status: 400,
                message: "Role with this title already exists",
            });
        }
        const role = await models_1.Role.create({
            title: title.trim(),
        });
        new utils_1.ApiResponse({
            status: 201,
            message: "Role created successfully",
            data: { role },
        }).send(res);
    }
    catch (error) {
        if (error instanceof utils_1.ApiError) {
            throw error;
        }
        throw new utils_1.ApiError({
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
exports.createRole = createRole;
const deleteRole = async (req, res) => {
    try {
        const roleId = parseInt(req.params.id);
        const role = await models_1.Role.findByPk(roleId);
        if (!role) {
            throw new utils_1.ApiError({
                status: 404,
                message: "Role not found",
            });
        }
        const systemRoles = ['admin', 'user', 'editor'];
        if (systemRoles.includes(role.title.toLowerCase())) {
            throw new utils_1.ApiError({
                status: 400,
                message: "Cannot delete system roles",
            });
        }
        await role.destroy();
        new utils_1.ApiResponse({
            status: 200,
            message: "Role deleted successfully",
        }).send(res);
    }
    catch (error) {
        if (error instanceof utils_1.ApiError) {
            throw error;
        }
        throw new utils_1.ApiError({
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
exports.deleteRole = deleteRole;
