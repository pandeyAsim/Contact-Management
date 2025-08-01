"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.create = void 0;
const models_1 = require("../../models");
const utils_1 = require("../../utils");
const helper_1 = require("../../utils/helper");
const create = async (req, res) => {
    try {
        const { fullName, company, phoneNumber, email, address, gender, department, notes, categoryId, } = req.body;
        if (!fullName || !phoneNumber || !email) {
            throw new utils_1.ApiError({
                status: 400,
                message: "Missing required fields",
                errors: [
                    {
                        message: "fullName, phoneNumber, and email are required"
                    }
                ]
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
        const existingContact = await models_1.Contact.findOne({
            where: {
                email: email.toLowerCase(),
                userId: req.user.id,
            },
        });
        if (existingContact) {
            throw new utils_1.ApiError({
                status: 409,
                message: "Contact with this email already exists",
            });
        }
        const avatarPath = req.file ? req.file.filename : undefined;
        const contact = await models_1.Contact.create({
            fullName: fullName.trim(),
            company: company?.trim(),
            avatar: avatarPath,
            phoneNumber: phoneNumber.trim(),
            email: email.toLowerCase().trim(),
            address: address?.trim(),
            gender: gender?.toLowerCase(),
            department: department?.trim(),
            notes: notes?.trim(),
            categoryId: categoryId || undefined,
            userId: req.user.id,
            isStared: false,
            viewsCount: 0,
        });
        const createdContact = await models_1.Contact.findByPk(contact.id, {
            include: [
                {
                    model: models_1.Category,
                    attributes: ["id", "name"],
                },
            ],
        });
        const responseData = {
            ...createdContact.toJSON(),
            avatar: (0, helper_1.getQualifiedImageUrl)(createdContact.avatar),
        };
        new utils_1.ApiResponse({
            status: 201,
            message: "Contact created successfully",
            data: responseData,
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
exports.create = create;
