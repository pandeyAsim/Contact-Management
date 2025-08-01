import path from "path";
import { ApiResponse } from "../../utils";
import { Request, Response } from "express";
import FileStorageDirectory from "../../enums/FileStorageDirectory.enum";
import { generateUniqueSlug, getQualifiedImageUrl } from "../../utils/helper";
import { Category } from "../../models";

// Helper function to process uploaded image
const processImageUpload = (file?: Express.Multer.File): string | undefined => {
  if (!file) return undefined;
  
  return path.join(
    FileStorageDirectory.UPLOADS,
    FileStorageDirectory.CATEGORY_IMAGES,
    file.filename
  );
};

// Helper function to format category response
const formatCategoryResponse = (category: Category) => {
  const categoryData = {
    ...category.dataValues,
    image: getQualifiedImageUrl(category.image)
  };
  return categoryData;
};

export const create = async (req: Request, res: Response) => {
  const { name } = req.body;
  
  // Process image upload if provided
  const imagePath = processImageUpload(req.file);

  // Generate unique slug for the category
  const slug = await generateUniqueSlug({
    model: Category,
    text: name,
  });

  // Create category with processed data
  const categoryData = {
    name,
    slug,
    image: imagePath,
  };

  const category = await Category.create(categoryData);

  // Fetch the created category with specific attributes
  const createdCategory = await Category.findOne({
    where: { id: category.id },
    attributes: ["id", "name", "slug", "image", "createdAt", "updatedAt"],
  });

  // Format response data
  const responseData = formatCategoryResponse(createdCategory!);

  new ApiResponse({
    status: 201,
    message: "Category created successfully",
    data: responseData,
  }).send(res);
};
