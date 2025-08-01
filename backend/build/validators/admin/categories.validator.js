"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCategoryValidator = exports.updateCategoryValidator = exports.createCategoryValidator = void 0;
const express_validator_1 = require("express-validator");
exports.createCategoryValidator = [
    (0, express_validator_1.body)("name")
        .notEmpty()
        .withMessage("Category name is required")
        .isLength({ min: 2, max: 50 })
        .withMessage("Category name must be between 2 and 50 characters"),
];
exports.updateCategoryValidator = [
    (0, express_validator_1.param)("id")
        .isInt({ min: 1 })
        .withMessage("Category ID must be a positive integer"),
    (0, express_validator_1.body)("name")
        .notEmpty()
        .withMessage("Category name is required")
        .isLength({ min: 2, max: 50 })
        .withMessage("Category name must be between 2 and 50 characters"),
];
exports.deleteCategoryValidator = [
    (0, express_validator_1.param)("id")
        .isInt({ min: 1 })
        .withMessage("Category ID must be a positive integer"),
];
