"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.get = void 0;
const utils_1 = require("../../utils");
const paginationUtil_1 = require("../../utils/paginationUtil");
const models_1 = require("../../models");
const helper_1 = require("../../utils/helper");
const sequelize_1 = require("sequelize");
const get = async (req, res) => {
    try {
        const { page, size, search, sortBy, orderBy } = (0, paginationUtil_1.decodeGetQuery)(req.query);
        const { limit, offset } = (0, paginationUtil_1.getPagination)({ page, size });
        const { isStared, isFrequent, categoryId } = req.query;
        const whereCondition = {
            userId: req.user.id,
        };
        if (isStared && isStared === "true") {
            whereCondition.isStared = true;
        }
        if (categoryId) {
            whereCondition.categoryId = parseInt(categoryId);
        }
        if (search) {
            whereCondition[sequelize_1.Op.or] = [
                {
                    fullName: {
                        [sequelize_1.Op.like]: `%${search}%`,
                    },
                },
                {
                    email: {
                        [sequelize_1.Op.like]: `%${search}%`,
                    },
                },
                {
                    phoneNumber: {
                        [sequelize_1.Op.like]: `%${search}%`,
                    },
                },
                {
                    company: {
                        [sequelize_1.Op.like]: `%${search}%`,
                    },
                },
            ];
        }
        const query = {
            attributes: [
                "id",
                "fullName",
                "avatar",
                "phoneNumber",
                "email",
                "company",
                "isStared",
                "viewsCount",
                "createdAt",
                "updatedAt"
            ],
            include: [
                {
                    model: models_1.Category,
                    attributes: ["id", "name", "slug"],
                    required: false,
                },
            ],
            where: whereCondition,
        };
        const orderCondition = [];
        if (isFrequent && isFrequent === "true") {
            orderCondition.push(["viewsCount", "DESC"]);
        }
        orderCondition.push([sortBy, orderBy]);
        query.order = orderCondition;
        query.limit = limit;
        query.offset = offset;
        const paginatedData = await models_1.Contact.findAndCountAll(query);
        paginatedData.rows.forEach((contact) => {
            contact.dataValues.avatar = (0, helper_1.getQualifiedImageUrl)(contact.avatar);
        });
        const response = (0, paginationUtil_1.getPagingData)({
            paginatedData,
            page,
            limit,
        });
        new utils_1.ApiResponse({
            status: 200,
            message: "Contacts retrieved successfully",
            data: response,
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
exports.get = get;
