"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteContact = exports.updateContact = exports.createContact = exports.getContacts = void 0;
const models_1 = require("../../models");
const utils_1 = require("../../utils");
const getContacts = async (req, res) => {
    try {
        const contacts = await models_1.Contact.findAll({
            include: [
                {
                    model: models_1.Category,
                    attributes: ["id", "name"],
                    required: false,
                },
                {
                    model: models_1.User,
                    attributes: ["id", "fullName", "email"],
                    required: false,
                },
            ],
            order: [["createdAt", "DESC"]],
        });
        new utils_1.ApiResponse({
            status: 200,
            message: "Contacts retrieved successfully",
            data: { contacts },
        }).send(res);
    }
    catch (error) {
        throw new utils_1.ApiError({
            status: 500,
            message: "Failed to retrieve contacts",
            errors: [
                {
                    message: error instanceof Error ? error.message : "Unknown error"
                }
            ]
        });
    }
};
exports.getContacts = getContacts;
const createContact = async (req, res) => {
    try {
        const { fullName, email, phoneNumber, categoryId, userId } = req.body;
        if (!fullName) {
            throw new utils_1.ApiError({
                status: 400,
                message: "Contact full name is required",
            });
        }
        if (!email) {
            throw new utils_1.ApiError({
                status: 400,
                message: "Contact email is required",
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
        if (userId) {
            const user = await models_1.User.findByPk(userId);
            if (!user) {
                throw new utils_1.ApiError({
                    status: 400,
                    message: "Invalid user ID",
                });
            }
        }
        const contact = await models_1.Contact.create({
            fullName,
            email,
            phoneNumber,
            categoryId: categoryId || null,
            userId: userId || 1,
        });
        const createdContact = await models_1.Contact.findByPk(contact.id, {
            include: [
                {
                    model: models_1.Category,
                    attributes: ["id", "name"],
                    required: false,
                },
                {
                    model: models_1.User,
                    attributes: ["id", "fullName", "email"],
                    required: false,
                },
            ],
        });
        new utils_1.ApiResponse({
            status: 201,
            message: "Contact created successfully",
            data: { contact: createdContact },
        }).send(res);
    }
    catch (error) {
        if (error instanceof utils_1.ApiError) {
            throw error;
        }
        throw new utils_1.ApiError({
            status: 500,
            message: "Failed to create contact",
            errors: [
                {
                    message: error instanceof Error ? error.message : "Unknown error"
                }
            ]
        });
    }
};
exports.createContact = createContact;
const updateContact = async (req, res) => {
    try {
        const contactId = parseInt(req.params.id);
        const { fullName, email, phoneNumber, categoryId } = req.body;
        const contact = await models_1.Contact.findByPk(contactId);
        if (!contact) {
            throw new utils_1.ApiError({
                status: 404,
                message: "Contact not found",
            });
        }
        const updateData = {};
        if (fullName !== undefined)
            updateData.fullName = fullName;
        if (email !== undefined)
            updateData.email = email;
        if (phoneNumber !== undefined)
            updateData.phoneNumber = phoneNumber;
        if (categoryId !== undefined)
            updateData.categoryId = categoryId || null;
        await contact.update(updateData);
        const updatedContact = await models_1.Contact.findByPk(contactId, {
            include: [
                {
                    model: models_1.Category,
                    attributes: ["id", "name"],
                    required: false,
                },
                {
                    model: models_1.User,
                    attributes: ["id", "fullName", "email"],
                    required: false,
                },
            ],
        });
        new utils_1.ApiResponse({
            status: 200,
            message: "Contact updated successfully",
            data: { contact: updatedContact },
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
exports.updateContact = updateContact;
const deleteContact = async (req, res) => {
    try {
        const contactId = parseInt(req.params.id);
        const contact = await models_1.Contact.findByPk(contactId);
        if (!contact) {
            throw new utils_1.ApiError({
                status: 404,
                message: "Contact not found",
            });
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
exports.deleteContact = deleteContact;
