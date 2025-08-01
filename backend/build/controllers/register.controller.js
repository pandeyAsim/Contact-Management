"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const utils_1 = require("../utils");
const models_1 = require("../models");
const bcrypt_1 = tslib_1.__importDefault(require("bcrypt"));
const mailHelper_1 = tslib_1.__importDefault(require("../utils/mailHelper"));
const uuid_1 = require("uuid");
const register = async (req, res) => {
    const { email, password } = req.body;
    const hashedPassword = await bcrypt_1.default.hash(password, 10);
    const userRole = await models_1.Role.findOne({
        where: {
            title: "user",
        },
    });
    if (!userRole) {
        throw new utils_1.ApiError({
            status: 500,
            message: "User role not found",
        });
    }
    const user = await models_1.User.create({
        email: email,
        password: hashedPassword,
        roleId: userRole.id,
    });
    const token = (0, uuid_1.v4)();
    const expiryDate = new Date(new Date().getTime() + 5 * 60 * 1000);
    await models_1.EmailVerification.create({
        userId: user.id,
        token,
        expiresAt: expiryDate,
    });
    await (0, mailHelper_1.default)({
        to: email,
        subject: "Email Verification",
        body: `<p>Click <a href="http://localhost:8080/api/auth/verify/${token}">here</a> to verify your email.</p>`,
    });
    const createdUser = await models_1.User.findOne({
        where: { id: user.id },
        attributes: ["id", "email", "roleId", "createdAt", "updatedAt"],
        include: [
            {
                model: models_1.Role,
                attributes: ["id", "title"],
            },
        ],
    });
    new utils_1.ApiResponse({
        status: 201,
        message: "User created successfully",
        data: createdUser,
    }).send(res);
};
exports.default = register;
