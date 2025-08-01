import { Request, Response } from "express";
import { Category } from "../../models";
import { ApiResponse, ApiError } from "../../utils";

export const getCategories = async (req: Request, res: Response) => {
  try {
    const categories = await Category.findAll({
      order: [["createdAt", "DESC"]],
    });

    new ApiResponse({
      status: 200,
      message: "Categories retrieved successfully",
      data: { categories },
    }).send(res);
  } catch (error) {
    throw new ApiError({
      status: 500,
      message: "Failed to retrieve categories",
      errors: [
        {
          message: error instanceof Error ? error.message : "Unknown error"
        }
      ]
    });
  }
};

export const createCategory = async (req: Request, res: Response) => {
  try {
    const { name } = req.body;

    if (!name) {
      throw new ApiError({
        status: 400,
        message: "Category name is required",
      });
    }

    // Check if category with same name exists
    const existingCategory = await Category.findOne({ where: { name } });
    if (existingCategory) {
      throw new ApiError({
        status: 400,
        message: "Category with this name already exists",
      });
    }

    // Generate slug from name
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    const category = await Category.create({
      name,
      slug,
    });

    new ApiResponse({
      status: 201,
      message: "Category created successfully",
      data: { category },
    }).send(res);
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError({
      status: 500,
      message: "Failed to create category",
      errors: [
        {
          message: error instanceof Error ? error.message : "Unknown error"
        }
      ]
    });
  }
};

export const updateCategory = async (req: Request, res: Response) => {
  try {
    const categoryId = parseInt(req.params.id);
    const { name } = req.body;

    if (!name) {
      throw new ApiError({
        status: 400,
        message: "Category name is required",
      });
    }

    const category = await Category.findByPk(categoryId);
    if (!category) {
      throw new ApiError({
        status: 404,
        message: "Category not found",
      });
    }

    // Check if another category with same name exists
    const existingCategory = await Category.findOne({ 
      where: { 
        name,
        id: { [require('sequelize').Op.ne]: categoryId }
      } 
    });
    if (existingCategory) {
      throw new ApiError({
        status: 400,
        message: "Category with this name already exists",
      });
    }

    // Generate new slug if name changed
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    await category.update({
      name,
      slug,
    });

    new ApiResponse({
      status: 200,
      message: "Category updated successfully",
      data: { category },
    }).send(res);
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError({
      status: 500,
      message: "Failed to update category",
      errors: [
        {
          message: error instanceof Error ? error.message : "Unknown error"
        }
      ]
    });
  }
};

export const deleteCategory = async (req: Request, res: Response) => {
  try {
    const categoryId = parseInt(req.params.id);
    
    const category = await Category.findByPk(categoryId);
    if (!category) {
      throw new ApiError({
        status: 404,
        message: "Category not found",
      });
    }

    await category.destroy();

    new ApiResponse({
      status: 200,
      message: "Category deleted successfully",
    }).send(res);
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError({
      status: 500,
      message: "Failed to delete category",
      errors: [
        {
          message: error instanceof Error ? error.message : "Unknown error"
        }
      ]
    });
  }
};
