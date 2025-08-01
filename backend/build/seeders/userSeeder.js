"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const models_1 = require("../models");
const bcrypt_1 = tslib_1.__importDefault(require("bcrypt"));
const seedUsers = async () => {
    try {
        console.log("🌱 Seeding users...");
        const users = [
            {
                email: "admin@example.com",
                password: "Admin123!",
                fullName: "System Administrator",
                roleId: 1,
                isEmailVerified: true,
            },
            {
                email: "editor@example.com",
                password: "Editor123!",
                fullName: "Content Editor",
                roleId: 3,
                isEmailVerified: true,
            },
            {
                email: "user@example.com",
                password: "User123!",
                fullName: "Regular User",
                roleId: 2,
                isEmailVerified: true,
            },
            {
                email: "john.doe@example.com",
                password: "John123!",
                fullName: "John Doe",
                roleId: 2,
                isEmailVerified: true,
            },
            {
                email: "jane.smith@example.com",
                password: "Jane123!",
                fullName: "Jane Smith",
                roleId: 2,
                isEmailVerified: false,
            },
        ];
        for (const userData of users) {
            const existingUser = await models_1.User.findOne({
                where: { email: userData.email },
            });
            if (!existingUser) {
                const hashedPassword = await bcrypt_1.default.hash(userData.password, 10);
                const user = await models_1.User.create({
                    ...userData,
                    password: hashedPassword,
                });
                console.log(`✅ Created user: ${user.email} (${user.fullName})`);
            }
            else {
                console.log(`⏭️  User already exists: ${userData.email}`);
            }
        }
        console.log("🎉 Users seeding completed!\n");
    }
    catch (error) {
        console.error("❌ Error seeding users:", error);
        throw error;
    }
};
exports.default = seedUsers;
