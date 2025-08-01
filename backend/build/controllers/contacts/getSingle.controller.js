"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSingle = void 0;
const utils_1 = require("../../utils");
const models_1 = require("../../models");
const helper_1 = require("../../utils/helper");
const getSingle = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            throw new utils_1.ApiError({
                status: 400,
                message: "Contact ID is required",
            });
        }
        const contact = await models_1.Contact.findOne({
            where: {
                id: parseInt(id),
                userId: req.user.id,
            },
            include: [
                {
                    model: models_1.Category,
                    attributes: ["id", "name", "slug"],
                },
                {
                    model: models_1.User,
                    attributes: ["id", "email", "fullName"],
                },
            ],
        });
        if (!contact) {
            throw new utils_1.ApiError({
                status: 404,
                message: "Contact not found",
            });
        }
        await contact.increment('viewsCount');
        const responseData = {
            ...contact.toJSON(),
            avatar: (0, helper_1.getQualifiedImageUrl)(contact.avatar),
            viewsCount: contact.viewsCount + 1,
        };
        new utils_1.ApiResponse({
            status: 200,
            message: "Contact retrieved successfully",
            data: responseData,
        }).send(res);
    }
    catch (error) {
        if (error instanceof utils_1.ApiError) {
            throw error;
        }
        throw new utils_1.ApiError({
            status: 500,
            message: "Failed to retrieve contact",
            errors: [
                {
                    message: error instanceof Error ? error.message : "Unknown error"
                }
            ]
        });
    }
};
exports.getSingle = getSingle;
