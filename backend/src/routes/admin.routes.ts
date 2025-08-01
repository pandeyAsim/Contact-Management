import express from "express";
import { authMiddleware, checkRole } from "../middlewares";
import validate from "../validators/validate";
import {
  // Admin validators
  createUserValidator,
  updateUserValidator,
  updateUserRoleValidator,
  deleteUserValidator,
  createContactValidator,
  updateContactValidator,
  deleteContactValidator,
  createCategoryValidator,
  updateCategoryValidator,
  deleteCategoryValidator,
  createRoleValidator,
  deleteRoleValidator,
} from "../validators";
import {
  // User controllers
  getUsers,
  createUser,
  updateUser,
  updateUserRole,
  deleteUser,
  // Contact controllers
  getContacts,
  createContact,
  updateContact,
  deleteContact,
  // Category controllers
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  // Dashboard controllers
  getDashboardStats,
  // Role controllers
  getRoles,
  createRole,
  deleteRole,
} from "../controllers/admin";

const router = express.Router();

// User routes
router.get("/users", authMiddleware, checkRole(["admin"]), getUsers);
router.post("/users", authMiddleware, checkRole(["admin"]), createUserValidator, validate, createUser);
router.put("/users/:id", authMiddleware, checkRole(["admin"]), updateUserValidator, validate, updateUser);
router.put("/users/:id/role", authMiddleware, checkRole(["admin"]), updateUserRoleValidator, validate, updateUserRole);
router.delete("/users/:id", authMiddleware, checkRole(["admin"]), deleteUserValidator, validate, deleteUser);

// Contact routes
router.get("/contacts", authMiddleware, checkRole(["admin"]), getContacts);
router.post("/contacts", authMiddleware, checkRole(["admin"]), createContactValidator, validate, createContact);
router.put("/contacts/:id", authMiddleware, checkRole(["admin"]), updateContactValidator, validate, updateContact);
router.delete("/contacts/:id", authMiddleware, checkRole(["admin"]), deleteContactValidator, validate, deleteContact);

// Category routes
router.get("/categories", authMiddleware, checkRole(["admin"]), getCategories);
router.post("/categories", authMiddleware, checkRole(["admin"]), createCategoryValidator, validate, createCategory);
router.put("/categories/:id", authMiddleware, checkRole(["admin"]), updateCategoryValidator, validate, updateCategory);
router.delete("/categories/:id", authMiddleware, checkRole(["admin"]), deleteCategoryValidator, validate, deleteCategory);

// Dashboard routes
router.get("/dashboard/stats", authMiddleware, checkRole(["admin"]), getDashboardStats);

// Role routes
router.get("/roles", authMiddleware, checkRole(["admin"]), getRoles);
router.post("/roles", authMiddleware, checkRole(["admin"]), createRoleValidator, validate, createRole);
router.delete("/roles/:id", authMiddleware, checkRole(["admin"]), deleteRoleValidator, validate, deleteRole);

export default router;
