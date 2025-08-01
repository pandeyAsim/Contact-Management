"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
require("../config/env.config");
const db_config_1 = require("../config/db.config");
const models_1 = require("../models");
const bcrypt_1 = tslib_1.__importDefault(require("bcrypt"));
const resetPassword = async (email, newPassword) => {
    try {
        await (0, db_config_1.connectDb)();
        const user = await models_1.User.findOne({ where: { email } });
        if (!user) {
            console.log(`User ${email} not found`);
            return;
        }
        const hashedPassword = await bcrypt_1.default.hash(newPassword, 10);
        await user.update({ password: hashedPassword });
        console.log(`Password updated for ${email}`);
        console.log(`New password: ${newPassword}`);
        process.exit(0);
    }
    catch (error) {
        console.error("Error:", error);
        process.exit(1);
    }
};
resetPassword("darshangotame@gmail.com", "Test123!");
