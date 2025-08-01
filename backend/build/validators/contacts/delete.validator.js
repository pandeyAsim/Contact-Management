"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteValidator = void 0;
const express_validator_1 = require("express-validator");
exports.deleteValidator = [
    (0, express_validator_1.param)("id")
        .exists()
        .withMessage("Contact ID is required")
        .bail()
        .isInt({ min: 1 })
        .withMessage("Contact ID must be a positive integer"),
];
