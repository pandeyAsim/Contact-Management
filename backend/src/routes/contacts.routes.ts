import express from "express";
const router = express.Router();
import {
  create,
  destroy,
  get,
  getSingle,
  update,
  toggleStar,
} from "../controllers/contacts";
import {
  createValidator,
  deleteValidator,
  getSingleValidator,
  getValidator,
  updateValidator,
} from "../validators/contacts";
import { authMiddleware, checkRole, uploadImageFileMiddleware } from "../middlewares";
import FileStorageDirectory from "../enums/FileStorageDirectory.enum";
import validate from "../validators/validate";

router.post(
  "/",
  authMiddleware,
  uploadImageFileMiddleware({
    directory: FileStorageDirectory.CONTACT_IMAGES,
    sizeInMb: 2,
  }).single("image"),
  createValidator,
  validate,
  create
);

router.delete(
  "/:id",
  authMiddleware,
  deleteValidator,
  validate,
  destroy
);

router.get("/", authMiddleware, getValidator, validate, get);

router.get("/:id", authMiddleware, getSingleValidator, validate, getSingle);

router.put(
  "/:id",
  authMiddleware,
  uploadImageFileMiddleware({
    directory: FileStorageDirectory.CONTACT_IMAGES,
    sizeInMb: 2,
  }).single("image"),
  updateValidator,
  validate,
  update
);

router.patch("/:id/star", authMiddleware, getSingleValidator, validate, toggleStar);

export default router;
