"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../utils");
const checkRole = (roles) => {
    return (req, res, next) => {
        const user = req.user;
        if (!roles.includes(user.role.title)) {
            throw new utils_1.ApiError({
                status: 403,
                message: "Forbidden",
            });
        }
        next();
    };
};
exports.default = checkRole;
