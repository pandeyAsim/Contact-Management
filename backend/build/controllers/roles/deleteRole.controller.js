"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const models_1 = require("../../models");
const utils_1 = require("../../utils");
const destroy = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            throw new utils_1.ApiError({
                status: 400,
                message: "Role ID is required",
            });
        }
        const role = await models_1.Role.findByPk(id);
        if (!role) {
            throw new utils_1.ApiError({
                status: 404,
                message: "Role not found",
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
exports.default = destroy;
