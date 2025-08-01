"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.destroy = void 0;
const tslib_1 = require("tslib");
const utils_1 = require("../../utils");
const models_1 = require("../../models");
const fs_1 = tslib_1.__importDefault(require("fs"));
const path_1 = tslib_1.__importDefault(require("path"));
const destroy = async (req, res) => {
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
        if (contact.avatar) {
            const avatarPath = path_1.default.join(process.cwd(), 'uploads', 'contact_images', contact.avatar);
            if (fs_1.default.existsSync(avatarPath)) {
                try {
                    fs_1.default.unlinkSync(avatarPath);
                }
                catch (fileError) {
                    console.warn(`Failed to delete avatar file: ${avatarPath}`, fileError);
                }
            }
        }
        await contact.destroy();
        new utils_1.ApiResponse({
            status: 200,
            message: "Contact deleted successfully",
        }).send(res);
    }
    catch (error) {
        if (error instanceof utils_1.ApiError) {
            throw error;
        }
        throw new utils_1.ApiError({
            status: 500,
            message: "Failed to delete contact",
            errors: [
                {
                    message: error instanceof Error ? error.message : "Unknown error"
                }
            ]
        });
    }
};
exports.destroy = destroy;
