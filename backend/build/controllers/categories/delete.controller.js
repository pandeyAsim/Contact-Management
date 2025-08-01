"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.destroy = void 0;
const utils_1 = require("../../utils");
const performCategoryDeletion = async (category) => {
    await category.destroy();
};
const createDeletionResponse = () => {
    return {
        status: 204,
        message: "Category deleted successfully",
    };
};
const destroy = async (req, res) => {
    const category = req.category;
    await performCategoryDeletion(category);
    const responseConfig = createDeletionResponse();
    new utils_1.ApiResponse(responseConfig).send(res);
};
exports.destroy = destroy;
