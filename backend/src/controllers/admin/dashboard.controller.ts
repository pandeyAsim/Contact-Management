import { Request, Response } from "express";
import { User, Contact, Category } from "../../models";
import { ApiResponse, ApiError } from "../../utils";

export const getDashboardStats = async (req: Request, res: Response) => {
  try {
    console.log("Dashboard stats endpoint hit by user:", req.user?.fullName);
    
    const totalUsers = await User.count();
    const totalContacts = await Contact.count();
    const totalCategories = await Category.count();
    
    console.log("Counts - Users:", totalUsers, "Contacts:", totalContacts, "Categories:", totalCategories);
    
    // Get recent contacts (last 7 days)
    const lastWeek = new Date();
    lastWeek.setDate(lastWeek.getDate() - 7);
    
    const recentContacts = await Contact.count({
      where: {
        createdAt: {
          [require('sequelize').Op.gte]: lastWeek
        }
      }
    });

    // Get contacts by category
    const contactsByCategory = await Category.findAll({
      attributes: ['name'],
      include: [{
        model: Contact,
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

    new ApiResponse({
      status: 200,
      message: "Dashboard stats retrieved successfully",
      data: stats,
    }).send(res);
  } catch (error) {
    throw new ApiError({
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
