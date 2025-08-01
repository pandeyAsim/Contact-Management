import { Request, Response } from "express";
import { ApiResponse } from "../../utils";
import { generateUniqueSlug, getQualifiedImageUrl } from "../../utils/helper";
import { Category } from "../../models";
import path from "path";
import FileStorageDirectory from "../../enums/FileStorageDirectory.enum";

// Helper function to process image upload for update
const processImageUpdate = (file?: Express.Multer.File): string | undefined => {
  if (!file) return undefined;
  
  return path.join(
    FileStorageDirectory.UPLOADS,
    FileStorageDirectory.CATEGORY_IMAGES,
    file.filename
  );
};

// Helper function to generate slug if name changed
const processSlugUpdate = async (newName: string, currentCategory: Category): Promise<string | undefined> => {
  if (!newName || newName === currentCategory.name) return undefined;
  
  return await generateUniqueSlug({
    model: Category,
    text: newName,
    id: currentCategory.id?.toString(),
  });
};

// Helper function to prepare update data
const prepareUpdateData = (name: string, slug: string | undefined, imagePath: string | undefined, category: Category) => {
  return {
    name: name || category.name,
    slug: slug || category.slug,
    image: imagePath || category.image,
  };
};

// Helper function to format response
const formatUpdateResponse = (category: Category) => {
  return {
    ...category.dataValues,
    image: getQualifiedImageUrl(category.image)
  };
};

export const update = async (req: Request, res: Response) => {
  const category = req.category;
  const { name } = req.body;

  // Process slug update if name changed
  const slug = await processSlugUpdate(name, category);

  // Process image upload if provided
  const imagePath = processImageUpdate(req.file);

  // Prepare update data
  const updateData = prepareUpdateData(name, slug, imagePath, category);

  // Update category in database
  await Category.update(updateData, {
    where: { id: category.id },
  });

  // Fetch updated category
  const updatedCategory = await Category.findOne({
    where: { id: category.id },
    attributes: ["id", "name", "slug", "image", "createdAt", "updatedAt"],
  });

  // Format response data
  const responseData = formatUpdateResponse(updatedCategory!);

  new ApiResponse({
    status: 200,
    message: "Category updated successfully",
    data: responseData,
  }).send(res);
};
