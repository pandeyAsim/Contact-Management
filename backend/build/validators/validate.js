"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_validator_1 = require("express-validator");
const utils_1 = require("../utils");
const extractValidationErrors = (errors) => {
    const extractedErrors = [];
    errors.forEach((err) => {
        switch (err.type) {
            case "field":
                extractedErrors.push({ [err.path]: err.msg });
                break;
            default:
                extractedErrors.push({
                    [err.type]: err.msg,
                });
        }
    });
    return extractedErrors;
};
const createValidationError = (errors, extractedErrors) => {
    return new utils_1.ApiError({
        message: errors[0].msg,
        errors: extractedErrors,
        status: 400,
    });
};
const validate = (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        const errorArray = errors.array();
        const extractedErrors = extractValidationErrors(errorArray);
        const validationError = createValidationError(errorArray, extractedErrors);
        throw validationError;
    }
    next();
};
exports.default = validate;
