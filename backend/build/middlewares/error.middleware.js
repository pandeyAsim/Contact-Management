"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../utils");
const errorHandler = (err, req, res, next) => {
    let error;
    if (!(err instanceof utils_1.ApiError)) {
        error = new utils_1.ApiError({
            status: 500,
            message: "Something went wrong",
            errors: [
                {
                    message: err.message,
                },
            ],
            stack: err.stack,
        });
    }
    else {
        error = err;
    }
    const response = {
        ...error,
        message: error.message,
        errors: error.errors,
    };
    res.status(error.status).json(response);
    next();
    return;
};
exports.default = errorHandler;
