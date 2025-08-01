"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.update = void 0;
const tslib_1 = require("tslib");
const utils_1 = require("../../utils");
const models_1 = require("../../models");
const helper_1 = require("../../utils/helper");
const fs_1 = tslib_1.__importDefault(require("fs"));
const path_1 = tslib_1.__importDefault(require("path"));
const update = async (req, res) => {
    try {
        const { id } = req.params;
        const { fullName, company, phoneNumber, email, address, gender, department, notes, categoryId, isStared, } = req.body;
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
        if (categoryId) {
            const category = await models_1.Category.findByPk(categoryId);
            if (!category) {
                throw new utils_1.ApiError({
                    status: 400,
                    message: "Invalid category ID",
                });
            }
        }
        if (email && email.toLowerCase() !== contact.email.toLowerCase()) {
            const existingContact = await models_1.Contact.findOne({
                where: {
                    email: email.toLowerCase(),
                    userId: req.user.id,
                    id: { [Symbol.for('sequelize.op.ne')]: parseInt(id) },
                },
            });
            if (existingContact) {
                throw new utils_1.ApiError({
                    status: 409,
                    message: "Another contact with this email already exists",
                });
            }
        }
        let avatarPath = contact.avatar;
        if (req.file) {
            if (contact.avatar) {
                const oldAvatarPath = path_1.default.join(process.cwd(), 'uploads', 'contact_images', contact.avatar);
                if (fs_1.default.existsSync(oldAvatarPath)) {
                    fs_1.default.unlinkSync(oldAvatarPath);
                }
            }
            avatarPath = req.file.filename;
        }
        const updateData = {};
        if (fullName !== undefined)
            updateData.fullName = fullName.trim();
        if (company !== undefined)
            updateData.company = company?.trim();
        if (phoneNumber !== undefined)
            updateData.phoneNumber = phoneNumber.trim();
        if (email !== undefined)
            updateData.email = email.toLowerCase().trim();
        if (address !== undefined)
            updateData.address = address?.trim();
        if (gender !== undefined)
            updateData.gender = gender?.toLowerCase();
        if (department !== undefined)
            updateData.department = department?.trim();
        if (notes !== undefined)
            updateData.notes = notes?.trim();
        if (categoryId !== undefined)
            updateData.categoryId = categoryId || undefined;
        if (isStared !== undefined)
            updateData.isStared = Boolean(isStared);
        if (req.file)
            updateData.avatar = avatarPath;
        await contact.update(updateData);
        const updatedContact = await models_1.Contact.findByPk(contact.id, {
            include: [
                {
                    model: models_1.Category,
                    attributes: ["id", "name", "slug"],
                },
            ],
        });
        const responseData = {
            ...updatedContact.toJSON(),
            avatar: (0, helper_1.getQualifiedImageUrl)(updatedContact.avatar),
        };
        new utils_1.ApiResponse({
            status: 200,
            message: "Contact updated successfully",
            data: responseData,
        }).send(res);
    }
    catch (error) {
        if (error instanceof utils_1.ApiError) {
            throw error;
        }
        throw new utils_1.ApiError({
            status: 500,
            message: "Failed to update contact",
            errors: [
                {
                    message: error instanceof Error ? error.message : "Unknown error"
                }
            ]
        });
    }
};
exports.update = update;
