"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const models_1 = require("../../models");
const utils_1 = require("../../utils");
const get = async (req, res) => {
    try {
        const roles = await models_1.Role.findAll({
            order: [['createdAt', 'DESC']]
        });
        new utils_1.ApiResponse({
            status: 200,
            message: "Roles retrieved successfully",
            data: roles,
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
exports.default = get;
