"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const models_1 = require("./models");
const db_config_1 = tslib_1.__importDefault(require("./config/db.config"));
const bcrypt_1 = tslib_1.__importDefault(require("bcrypt"));
const checkUsers = async () => {
    try {
        await db_config_1.default.authenticate();
        console.log("Database connected successfully.");
        const users = await models_1.User.findAll({
            attributes: ['id', 'email', 'password', 'isEmailVerified'],
            include: ['role']
        });
        console.log("Found users:", users.length);
        for (const user of users) {
            console.log(`\nUser: ${user.email}`);
            console.log(`Email verified: ${user.isEmailVerified}`);
            console.log(`Role: ${user.role?.title || 'No role'}`);
            const testPasswords = ['Admin123!', 'User123!', 'Test123!', 'password'];
            for (const testPassword of testPasswords) {
                try {
                    const isValid = await bcrypt_1.default.compare(testPassword, user.password);
                    if (isValid) {
                        console.log(`✅ Password "${testPassword}" works for ${user.email}`);
                        break;
                    }
                }
                catch (error) {
                    console.log(`❌ Error testing password "${testPassword}": ${error}`);
                }
            }
        }
        process.exit(0);
    }
    catch (error) {
        console.error("Error:", error);
        process.exit(1);
    }
};
checkUsers();
