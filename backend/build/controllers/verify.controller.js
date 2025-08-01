"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const models_1 = require("../models");
const verifyEmail = async (req, res) => {
    const { token } = req.params;
    const emailVerification = await models_1.EmailVerification.findOne({
        where: {
            token,
        },
    });
    await models_1.User.update({ isEmailVerified: true }, {
        where: {
            id: emailVerification?.userId,
        },
    });
    res.redirect("https://www.google.com");
};
exports.default = verifyEmail;
