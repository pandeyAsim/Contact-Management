"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDashboardStats = void 0;
const models_1 = require("../../models");
const utils_1 = require("../../utils");
const getDashboardStats = async (req, res) => {
    try {
        console.log("Dashboard stats endpoint hit by user:", req.user?.fullName);
        const totalUsers = await models_1.User.count();
        const totalContacts = await models_1.Contact.count();
        const totalCategories = await models_1.Category.count();
        console.log("Counts - Users:", totalUsers, "Contacts:", totalContacts, "Categories:", totalCategories);
        const lastWeek = new Date();
        lastWeek.setDate(lastWeek.getDate() - 7);
        const recentContacts = await models_1.Contact.count({
            where: {
                createdAt: {
                    [require('sequelize').Op.gte]: lastWeek
                }
            }
        });
        const contactsByCategory = await models_1.Category.findAll({
            attributes: ['name'],
            include: [{
                    model: models_1.Contact,
                    attributes: ['id']
                }]
        });
        const stats = {
            totalUsers,
            totalContacts,
            totalCategories,
            recentContacts,
            contactsByCategory: contactsByCategory.map(category => ({
                category: category.name,
                count: category.contacts?.length || 0
            }))
        };
        console.log("Final stats being sent:", stats);
        new utils_1.ApiResponse({
            status: 200,
            message: "Dashboard stats retrieved successfully",
            data: stats,
        }).send(res);
    }
    catch (error) {
        throw new utils_1.ApiError({
            status: 500,
            message: "Failed to retrieve dashboard stats",
            errors: [
                {
                    message: error instanceof Error ? error.message : "Unknown error"
                }
            ]
        });
    }
};
exports.getDashboardStats = getDashboardStats;
