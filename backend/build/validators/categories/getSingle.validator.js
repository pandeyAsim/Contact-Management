"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSingleValidator = void 0;
const helper_1 = require("../../utils/helper");
const models_1 = require("../../models");
const express_validator_1 = require("express-validator");
exports.getSingleValidator = [
    (0, express_validator_1.param)("id")
        .exists()
        .withMessage("ID is required")
        .bail()
        .isNumeric()
        .withMessage("ID must be a number")
        .custom(async (value, { req }) => {
        const category = await models_1.Category.findOne({
            where: { id: value },
            attributes: ["id", "name", "slug", "image"],
        });
        if (!category) {
            throw new Error("category not found");
        }
        category.dataValues.image = (0, helper_1.getQualifiedImageUrl)(category.image);
        req.category = category;
        return true;
    })
        .bail(),
];
