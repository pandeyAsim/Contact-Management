"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ApiError extends Error {
    constructor(options) {
        super(options.message);
        this.status = options.status || 500;
        this.message = options.message || "Something went wrong";
        this.data = options.data;
        this.errors = options.errors;
        Error.captureStackTrace(this, this.constructor);
        if (options.stack) {
            this.stack = options.stack;
        }
    }
}
exports.default = ApiError;
