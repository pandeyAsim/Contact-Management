"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getValidator = void 0;
const models_1 = require("../../models");
const express_validator_1 = require("express-validator");
exports.getValidator = [
    (0, express_validator_1.query)("page")
        .optional()
        .isInt({ min: 1 })
        .withMessage("Page must be a positive integer")
        .bail(),
    (0, express_validator_1.query)("size")
        .optional()
        .isInt({ min: 1 })
        .withMessage("Size must be a positive integer")
        .bail(),
    (0, express_validator_1.query)("search")
        .optional()
        .trim()
        .notEmpty()
        .withMessage("Search query is required")
        .bail()
        .isString()
        .withMessage("Search query must be a string")
        .bail()
        .isLength({ max: 255 })
        .withMessage("Search query must be less than 255 characters")
        .bail()
        .customSanitizer((value) => value.replace(/[^a-zA-Z0-9\s]/g, ""))
        .bail(),
    (0, express_validator_1.query)("sort")
        .optional()
        .trim()
        .notEmpty()
        .withMessage("Sort is required")
        .isString()
        .withMessage("Sort must be a string")
        .bail()
        .custom((value) => {
        const sortColumn = Object.keys(models_1.Contact.getAttributes()).includes(value);
        if (!sortColumn) {
            throw new Error("Invalid sort column");
        }
        return true;
    })
        .bail(),
    (0, express_validator_1.query)("order")
        .optional()
        .trim()
        .notEmpty()
        .withMessage("Order is required")
        .bail()
        .isString()
        .withMessage("Order must be a string")
        .isIn(["asc", "desc", "ASC", "DESC"])
        .withMessage("Invalid order value")
        .bail()
        .custom((value, { req }) => {
        req.query.orderBy = value.toLowerCase();
        return true;
    }),
    (0, express_validator_1.query)("isStared")
        .optional()
        .isBoolean()
        .withMessage("isStared must be a boolean")
        .bail(),
    (0, express_validator_1.query)("isFrequent")
        .optional()
        .isBoolean()
        .withMessage("isFrequent must be a boolean")
        .bail(),
    (0, express_validator_1.query)("category")
        .optional()
        .isInt({ min: 1 })
        .withMessage("Category must be a positive integer")
        .bail()
        .custom(async (value, { req }) => {
        const category = await models_1.Category.findOne({
            where: { id: value },
        });
        if (!category) {
            throw new Error("Category not found");
        }
        req.category = category;
        return true;
    }),
];
