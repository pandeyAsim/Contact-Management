"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const models_1 = require("../models");
const helper_1 = require("../utils/helper");
const seedCategories = async () => {
    try {
        console.log("🌱 Seeding categories...");
        const categories = [
            { name: "Family" },
            { name: "Friends" },
            { name: "Work" },
            { name: "Business" },
            { name: "School" },
            { name: "Emergency" },
            { name: "Healthcare" },
            { name: "Services" },
        ];
        for (const categoryData of categories) {
            const existingCategory = await models_1.Category.findOne({
                where: { name: categoryData.name },
            });
            if (!existingCategory) {
                const slug = await (0, helper_1.generateUniqueSlug)({
                    model: models_1.Category,
                    text: categoryData.name,
                });
                const category = await models_1.Category.create({
                    ...categoryData,
                    slug,
                });
                console.log(`✅ Created category: ${category.name} (${category.slug})`);
            }
            else {
                console.log(`⏭️  Category already exists: ${categoryData.name}`);
            }
        }
        console.log("🎉 Categories seeding completed!\n");
    }
    catch (error) {
        console.error("❌ Error seeding categories:", error);
        throw error;
    }
};
exports.default = seedCategories;
