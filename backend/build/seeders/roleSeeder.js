"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const models_1 = require("../models");
const seedRoles = async () => {
    try {
        console.log("🌱 Seeding roles...");
        const roles = [
            { id: 1, title: "admin" },
            { id: 2, title: "user" },
            { id: 3, title: "editor" },
        ];
        for (const roleData of roles) {
            const [role, created] = await models_1.Role.findOrCreate({
                where: { id: roleData.id },
                defaults: roleData,
            });
            if (created) {
                console.log(`✅ Created role: ${role.title}`);
            }
            else {
                console.log(`⏭️  Role already exists: ${role.title}`);
            }
        }
        console.log("🎉 Roles seeding completed!\n");
    }
    catch (error) {
        console.error("❌ Error seeding roles:", error);
        throw error;
    }
};
exports.default = seedRoles;
