import { Request, Response } from "express";
import { ApiResponse } from "../../utils";

// Helper function to format single category response
const formatSingleCategoryResponse = (category: any) => {
  return {
    ...category,
  };
};

export const getSingle = async (req: Request, res: Response) => {
  // Format the category data
  const categoryData = formatSingleCategoryResponse(req.category);

  new ApiResponse({
    status: 200,
    message: "Category retrieved successfully",
    data: categoryData,
  }).send(res);
};
