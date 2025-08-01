"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.get = void 0;
const utils_1 = require("../../utils");
const paginationUtil_1 = require("../../utils/paginationUtil");
const sequelize_1 = require("sequelize");
const models_1 = require("../../models");
const helper_1 = require("../../utils/helper");
const buildSearchConditions = (search) => {
    if (!search)
        return {};
    return {
        [sequelize_1.Op.or]: [
            {
                name: {
                    [sequelize_1.Op.like]: `%${search}%`,
                },
            },
        ],
    };
};
const buildQueryConfig = (whereCondition, sortBy, orderBy, limit, offset) => {
    return {
        attributes: ["id", "name", "slug", "image"],
        where: whereCondition,
        order: [[sortBy, orderBy]],
        limit,
        offset,
    };
};
const formatCategoriesResponse = (categories) => {
    return categories.map(category => ({
        ...category.dataValues,
        image: (0, helper_1.getQualifiedImageUrl)(category.image)
    }));
};
const get = async (req, res) => {
    const { page, size, search, sortBy, orderBy } = (0, paginationUtil_1.decodeGetQuery)(req.query);
    const { limit, offset } = (0, paginationUtil_1.getPagination)({ page, size });
    const whereCondition = buildSearchConditions(search);
    const queryConfig = buildQueryConfig(whereCondition, sortBy, orderBy, limit, offset);
    const paginatedData = await models_1.Category.findAndCountAll(queryConfig);
    const formattedCategories = formatCategoriesResponse(paginatedData.rows);
    const updatedPaginatedData = {
        ...paginatedData,
        rows: formattedCategories
    };
    const response = (0, paginationUtil_1.getPagingData)({
        paginatedData: updatedPaginatedData,
        page,
        limit,
    });
    new utils_1.ApiResponse({
        status: 200,
        message: "Category retrieved successfully",
        data: response,
    }).send(res);
};
exports.get = get;
