import { Request, Response } from "express";
import { ApiResponse } from "../../utils";
import { Category } from "../../models";

// Helper function to perform category deletion
const performCategoryDeletion = async (category: Category): Promise<void> => {
  await category.destroy();
};

// Helper function to create deletion response
const createDeletionResponse = () => {
  return {
    status: 204,
    message: "Category deleted successfully",
  };
};

export const destroy = async (req: Request, res: Response) => {
  const category: Category = req.category;

  // Perform category deletion
  await performCategoryDeletion(category);

  // Create and send response
  const responseConfig = createDeletionResponse();
  
  new ApiResponse(responseConfig).send(res);
};
