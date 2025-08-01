"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCategory = exports.updateCategory = exports.createCategory = exports.getCategories = void 0;
const models_1 = require("../../models");
const utils_1 = require("../../utils");
const getCategories = async (req, res) => {
    try {
        const categories = await models_1.Category.findAll({
            order: [["createdAt", "DESC"]],
        });
        new utils_1.ApiResponse({
            status: 200,
            message: "Categories retrieved successfully",
            data: { categories },
        }).send(res);
    }
    catch (error) {
        throw new utils_1.ApiError({
            status: 500,
            message: "Failed to retrieve categories",
            errors: [
                {
                    message: error instanceof Error ? error.message : "Unknown error"
                }
            ]
        });
    }
};
exports.getCategories = getCategories;
const createCategory = async (req, res) => {
    try {
        const { name } = req.body;
        if (!name) {
            throw new utils_1.ApiError({
                status: 400,
                message: "Category name is required",
            });
        }
        const existingCategory = await models_1.Category.findOne({ where: { name } });
        if (existingCategory) {
            throw new utils_1.ApiError({
                status: 400,
                message: "Category with this name already exists",
            });
        }
        const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        const category = await models_1.Category.create({
            name,
            slug,
        });
        new utils_1.ApiResponse({
            status: 201,
            message: "Category created successfully",
            data: { category },
        }).send(res);
    }
    catch (error) {
        if (error instanceof utils_1.ApiError) {
            throw error;
        }
        throw new utils_1.ApiError({
            status: 500,
            message: "Failed to create category",
            errors: [
                {
                    message: error instanceof Error ? error.message : "Unknown error"
                }
            ]
        });
    }
};
exports.createCategory = createCategory;
const updateCategory = async (req, res) => {
    try {
        const categoryId = parseInt(req.params.id);
        const { name } = req.body;
        if (!name) {
            throw new utils_1.ApiError({
                status: 400,
                message: "Category name is required",
            });
        }
        const category = await models_1.Category.findByPk(categoryId);
        if (!category) {
            throw new utils_1.ApiError({
                status: 404,
                message: "Category not found",
            });
        }
        const existingCategory = await models_1.Category.findOne({
            where: {
                name,
                id: { [require('sequelize').Op.ne]: categoryId }
            }
        });
        if (existingCategory) {
            throw new utils_1.ApiError({
                status: 400,
                message: "Category with this name already exists",
            });
        }
        const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        await category.update({
            name,
            slug,
        });
        new utils_1.ApiResponse({
            status: 200,
            message: "Category updated successfully",
            data: { category },
        }).send(res);
    }
    catch (error) {
        if (error instanceof utils_1.ApiError) {
            throw error;
        }
        throw new utils_1.ApiError({
            status: 500,
            message: "Failed to update category",
            errors: [
                {
                    message: error instanceof Error ? error.message : "Unknown error"
                }
            ]
        });
    }
};
exports.updateCategory = updateCategory;
const deleteCategory = async (req, res) => {
    try {
        const categoryId = parseInt(req.params.id);
        const category = await models_1.Category.findByPk(categoryId);
        if (!category) {
            throw new utils_1.ApiError({
                status: 404,
                message: "Category not found",
            });
        }
        await category.destroy();
        new utils_1.ApiResponse({
            status: 200,
            message: "Category deleted successfully",
        }).send(res);
    }
    catch (error) {
        if (error instanceof utils_1.ApiError) {
            throw error;
        }
        throw new utils_1.ApiError({
            status: 500,
            message: "Failed to delete category",
            errors: [
                {
                    message: error instanceof Error ? error.message : "Unknown error"
                }
            ]
        });
    }
};
exports.deleteCategory = deleteCategory;
