"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSingleByAdmin = void 0;
const utils_1 = require("../../utils");
const formatAdminCategoryResponse = (category) => {
    return {
        ...category,
    };
};
const getSingleByAdmin = async (req, res) => {
    const categoryData = formatAdminCategoryResponse(req.category);
    new utils_1.ApiResponse({
        status: 200,
        message: "Category retrieved successfully by admin",
        data: categoryData,
    }).send(res);
};
exports.getSingleByAdmin = getSingleByAdmin;
