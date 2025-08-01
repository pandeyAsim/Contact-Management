"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
require("../config/env.config");
const db_config_1 = require("../config/db.config");
const roleSeeder_1 = tslib_1.__importDefault(require("./roleSeeder"));
const userSeeder_1 = tslib_1.__importDefault(require("./userSeeder"));
const categorySeeder_1 = tslib_1.__importDefault(require("./categorySeeder"));
const contactSeeder_1 = tslib_1.__importDefault(require("./contactSeeder"));
const runSeeders = async () => {
    try {
        console.log("🚀 Starting database seeding...\n");
        await (0, db_config_1.connectDb)();
        await (0, roleSeeder_1.default)();
        await (0, userSeeder_1.default)();
        await (0, categorySeeder_1.default)();
        await (0, contactSeeder_1.default)();
        console.log("🎊 All seeders completed successfully!");
        console.log("📝 You can now use the following test accounts:");
        console.log("   Admin: admin@example.com / Admin123!");
        console.log("   Editor: editor@example.com / Editor123!");
        console.log("   User: user@example.com / User123!");
        process.exit(0);
    }
    catch (error) {
        console.error("💥 Seeding failed:", error);
        process.exit(1);
    }
};
if (require.main === module) {
    runSeeders();
}
exports.default = runSeeders;
