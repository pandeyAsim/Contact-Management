import express from "express";
const router = express.Router();
import { getProfile, updateProfile, updateProfileImage } from "../controllers/users";
import { authMiddleware, checkRole, uploadImageFileMiddleware } from "../middlewares";
import FileStorageDirectory from "../enums/FileStorageDirectory.enum";

router.get("/me", authMiddleware, getProfile);
router.put("/profile", authMiddleware, updateProfile);
router.put(
  "/me",
  authMiddleware,
  uploadImageFileMiddleware({
    directory: FileStorageDirectory.PROFILE_PICTURES,
    sizeInMb: 2,
  }).single("image"),
  updateProfileImage
);

router.put(
  "/blog",
  authMiddleware,
  checkRole(["admin", "editor"]),
  (req, res) => {
    res.send("Test route is working");
  }
);

export default router;
