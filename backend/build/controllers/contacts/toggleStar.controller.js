"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toggleStar = void 0;
const utils_1 = require("../../utils");
const models_1 = require("../../models");
const toggleStar = async (req, res) => {
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
        });
        if (!contact) {
            throw new utils_1.ApiError({
                status: 404,
                message: "Contact not found",
            });
        }
        const updatedContact = await contact.update({
            isStared: !contact.isStared,
        });
        new utils_1.ApiResponse({
            status: 200,
            message: `Contact ${updatedContact.isStared ? 'starred' : 'unstarred'} successfully`,
            data: {
                id: updatedContact.id,
                isStared: updatedContact.isStared,
            },
        }).send(res);
    }
    catch (error) {
        if (error instanceof utils_1.ApiError) {
            throw error;
        }
        throw new utils_1.ApiError({
            status: 500,
            message: "Failed to toggle contact star status",
            errors: [
                {
                    message: error instanceof Error ? error.message : "Unknown error"
                }
            ]
        });
    }
};
exports.toggleStar = toggleStar;
