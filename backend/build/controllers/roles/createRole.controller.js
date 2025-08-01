"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const models_1 = require("../../models");
const utils_1 = require("../../utils");
const create = async (req, res) => {
    try {
        const body = req.body;
        if (!body || typeof body.title === 'undefined') {
            throw new utils_1.ApiError({
                status: 400,
                message: "Title is required",
                errors: [
                    {
                        field: "title",
                        message: "Title field is missing or empty"
                    }
                ]
            });
        }
        if (!body.title || body.title.trim() === '') {
            throw new utils_1.ApiError({
                status: 400,
                message: "Title cannot be empty",
                errors: [
                    {
                        field: "title",
                        message: "Title must be a non-empty string"
                    }
                ]
            });
        }
        const role = await models_1.Role.create({
            title: body.title.trim(),
        });
        new utils_1.ApiResponse({
            status: 201,
            message: "Role created successfully",
            data: role,
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
exports.default = create;
