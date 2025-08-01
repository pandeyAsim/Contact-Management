import express from "express";
const router = express.Router();
import {
  create,
  destroy,
  get,
  getSingle,
  update,
} from "../controllers/categories";
import {
  createValidator,
  deleteValidator,
  getSingleValidator,
  getValidator,
  updateValidator,
} from "../validators/categories";
import { authMiddleware, checkRole, uploadImageFileMiddleware } from "../middlewares";
import FileStorageDirectory from "../enums/FileStorageDirectory.enum";
import validate from "../validators/validate";

router.post(
  "/",
  authMiddleware,
  checkRole(["admin"]),
  uploadImageFileMiddleware({
    directory: FileStorageDirectory.CATEGORY_IMAGES,
    sizeInMb: 2,
  }).single("image"),
  createValidator,
  validate,
  create
);

router.delete(
  "/:id",
  authMiddleware,
  checkRole(["admin"]),
  deleteValidator,
  validate,
  destroy
);

router.get("/", authMiddleware, getValidator, validate, get);

router.get("/:id", authMiddleware, getSingleValidator, validate, getSingle);

router.put(
  "/:id",
  authMiddleware,
  checkRole(["admin"]),
  uploadImageFileMiddleware({
    directory: FileStorageDirectory.CATEGORY_IMAGES,
    sizeInMb: 2,
  }).single("image"),
  updateValidator,
  validate,
  update
);

export default router;
