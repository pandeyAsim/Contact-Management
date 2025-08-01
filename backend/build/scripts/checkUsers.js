"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("../config/env.config");
const db_config_1 = require("../config/db.config");
const models_1 = require("../models");
const checkUsers = async () => {
    try {
        await (0, db_config_1.connectDb)();
        const users = await models_1.User.findAll({
            include: [
                {
                    model: models_1.Role,
                    attributes: ["id", "title"],
                },
            ],
        });
        console.log("=== ALL USERS IN DATABASE ===");
        users.forEach(user => {
            console.log(`ID: ${user.id}`);
            console.log(`Email: ${user.email}`);
            console.log(`Full Name: ${user.fullName}`);
            console.log(`Role: ${user.role?.title}`);
            console.log(`Email Verified: ${user.isEmailVerified}`);
            console.log(`Created: ${user.createdAt}`);
            console.log("---");
        });
        process.exit(0);
    }
    catch (error) {
        console.error("Error:", error);
        process.exit(1);
    }
};
checkUsers();
