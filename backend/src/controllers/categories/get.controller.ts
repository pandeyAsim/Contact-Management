import { Request, Response } from "express";
import { ApiResponse } from "../../utils";
import {
  decodeGetQuery,
  getPagination,
  getPagingData,
} from "../../utils/paginationUtil";
import { Op } from "sequelize";
import { Category } from "../../models";
import { getQualifiedImageUrl } from "../../utils/helper";

// Helper function to build search conditions
const buildSearchConditions = (search: string) => {
  if (!search) return {};
  
  return {
    [Op.or]: [
      {
        name: {
          [Op.like]: `%${search}%`,
        },
      },
    ],
  };
};

// Helper function to build query configuration
const buildQueryConfig = (whereCondition: any, sortBy: string, orderBy: string, limit: number, offset: number) => {
  return {
    attributes: ["id", "name", "slug", "image"],
    where: whereCondition,
    order: [[sortBy, orderBy]] as any,
    limit,
    offset,
  };
};

// Helper function to format categories with image URLs
const formatCategoriesResponse = (categories: Category[]) => {
  return categories.map(category => ({
    ...category.dataValues,
    image: getQualifiedImageUrl(category.image)
  }));
};

export const get = async (req: Request, res: Response) => {
  // Parse and extract query parameters
  const { page, size, search, sortBy, orderBy } = decodeGetQuery(req.query);
  const { limit, offset } = getPagination({ page, size });

  // Build search conditions
  const whereCondition = buildSearchConditions(search);

  // Build query configuration
  const queryConfig = buildQueryConfig(whereCondition, sortBy, orderBy, limit, offset);

  // Execute database query
  const paginatedData = await Category.findAndCountAll(queryConfig);

  // Format categories with qualified image URLs
  const formattedCategories = formatCategoriesResponse(paginatedData.rows);
  
  // Update the paginated data with formatted categories
  const updatedPaginatedData = {
    ...paginatedData,
    rows: formattedCategories
  };

  // Prepare paginated response
  const response = getPagingData({
    paginatedData: updatedPaginatedData,
    page,
    limit,
  });

  new ApiResponse({
    status: 200,
    message: "Category retrieved successfully",
    data: response,
  }).send(res);
};
