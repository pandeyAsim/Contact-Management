"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSingle = void 0;
const utils_1 = require("../../utils");
const formatSingleCategoryResponse = (category) => {
    return {
        ...category,
    };
};
const getSingle = async (req, res) => {
    const categoryData = formatSingleCategoryResponse(req.category);
    new utils_1.ApiResponse({
        status: 200,
        message: "Category retrieved successfully",
        data: categoryData,
    }).send(res);
};
exports.getSingle = getSingle;
