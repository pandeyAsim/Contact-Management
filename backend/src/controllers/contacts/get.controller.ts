import { Request, Response } from "express";
import { ApiResponse, ApiError } from "../../utils";
import {
  decodeGetQuery,
  getPagination,
  getPagingData,
} from "../../utils/paginationUtil";
import { Category, Contact } from "../../models";
import { getQualifiedImageUrl } from "../../utils/helper";
import { FindAndCountOptions, Op, Order } from "sequelize";

export const get = async (req: Request, res: Response) => {
  try {
    const { page, size, search, sortBy, orderBy } = decodeGetQuery(req.query);
    const { limit, offset } = getPagination({ page, size });
    const { isStared, isFrequent, categoryId } = req.query;

    // Base where condition - always filter by current user
    const whereCondition: any = {
      userId: req.user.id!, // Only show contacts belonging to the authenticated user
    };

    // Filter by starred contacts
    if (isStared && isStared === "true") {
      whereCondition.isStared = true;
    }

    // Filter by category
    if (categoryId) {
      whereCondition.categoryId = parseInt(categoryId as string);
    }

    // Search functionality
    if (search) {
      whereCondition[Op.or] = [
        {
          fullName: {
            [Op.like]: `%${search}%`,
          },
        },
        {
          email: {
            [Op.like]: `%${search}%`,
          },
        },
        {
          phoneNumber: {
            [Op.like]: `%${search}%`,
          },
        },
        {
          company: {
            [Op.like]: `%${search}%`,
          },
        },
      ];
    }

    const query: FindAndCountOptions = {
      attributes: [
        "id", 
        "fullName", 
        "avatar", 
        "phoneNumber", 
        "email", 
        "company", 
        "isStared", 
        "viewsCount",
        "createdAt",
        "updatedAt"
      ],
      include: [
        {
          model: Category,
          attributes: ["id", "name", "slug"],
          required: false, // LEFT JOIN to include contacts without categories
        },
      ],
      where: whereCondition,
    };

    // Build order condition
    const orderCondition: Order = [];
    
    // If requesting frequent contacts, prioritize by views
    if (isFrequent && isFrequent === "true") {
      orderCondition.push(["viewsCount", "DESC"]);
    }
    
    // Add the main sort order
    orderCondition.push([sortBy, orderBy]);

    query.order = orderCondition;
    query.limit = limit;
    query.offset = offset;

    const paginatedData = await Contact.findAndCountAll(query);

    // Process avatar URLs
    paginatedData.rows.forEach((contact) => {
      contact.dataValues.avatar = getQualifiedImageUrl(contact.avatar);
    });

    const response = getPagingData({
      paginatedData,
      page,
      limit,
    });

    new ApiResponse({
      status: 200,
      message: "Contacts retrieved successfully",
      data: response,
    }).send(res);
  } catch (error) {
    throw new ApiError({
      status: 500,
      message: "Failed to retrieve contacts",
      errors: [
        {
          message: error instanceof Error ? error.message : "Unknown error"
        }
      ]
    });
  }
};
