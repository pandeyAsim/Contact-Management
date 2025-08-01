"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const models_1 = require("../../models");
const utils_1 = require("../../utils");
const bcrypt_1 = tslib_1.__importDefault(require("bcrypt"));
const jwtUtils_1 = require("../../utils/jwtUtils");
const helper_1 = require("../../utils/helper");
const login = async (req, res) => {
    const { email, password } = req.body;
    const user = await models_1.User.findOne({
        where: { email },
        include: [
            {
                model: models_1.Role,
                attributes: ["id", "title"],
            },
        ],
    });
    if (!user) {
        throw new utils_1.ApiError({
            status: 401,
            message: "Invalid email or password",
        });
    }
    const isPasswordValid = await bcrypt_1.default.compare(password, user.password);
    if (!isPasswordValid) {
        throw new utils_1.ApiError({
            status: 401,
            message: "Invalid email or password",
        });
    }
    if (!user.isEmailVerified) {
        throw new utils_1.ApiError({
            status: 403,
            message: "Email not verified",
            errors: [
                {
                    isEmailVerified: "Email not verified. Please verify your email to login.",
                },
            ],
        });
    }
    const refreshToken = await (0, jwtUtils_1.generateRefreshToken)({
        payload: {
            userId: user.id,
        },
    });
    const createdRefreshToken = await models_1.RefreshToken.create({
        userId: user.id,
        token: refreshToken,
        expiresAt: new Date(new Date().getTime() + jwtUtils_1.JWT_REFRESH_EXPIRES_IN * 60 * 1000),
    });
    const accessToken = await (0, jwtUtils_1.generateAccessToken)({
        payload: {
            userId: user.id,
            refreshTokenId: createdRefreshToken.id,
        },
    });
    user.dataValues.avatar = (0, helper_1.getQualifiedImageUrl)(user?.avatar);
    const userJson = user.toJSON();
    new utils_1.ApiResponse({
        status: 200,
        message: "Login successful",
        data: {
            accessToken,
            refreshToken,
            user: {
                id: userJson.id,
                fullName: userJson.fullName,
                email: userJson.email,
                avatar: userJson.avatar,
                isEmailVerified: userJson.isEmailVerified,
                role: userJson.role ? {
                    id: userJson.role.id,
                    title: userJson.role.title,
                } : undefined,
            },
        },
    }).send(res);
};
exports.default = login;
