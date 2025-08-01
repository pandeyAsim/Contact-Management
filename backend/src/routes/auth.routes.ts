import express from "express";
const router = express.Router();
import { register, login, logout, refreshToken, verifyEmail, getProfile, forgotPassword, resetPassword, updateProfileImage } from "../controllers/users";
import {
  registerValidator,
  loginValidator,
  verifyValidator,
  forgotPasswordValidator,
  resetPasswordValidator,
} from "../validators";
import validate from "../validators/validate";
import { authMiddleware, uploadImageFileMiddleware } from "../middlewares";
import FileStorageDirectory from "../enums/FileStorageDirectory.enum";

router.post("/register", registerValidator(), validate, register);
router.post("/login", loginValidator(), validate, login);
router.post("/logout", authMiddleware, logout);
router.post("/refresh", refreshToken);
router.get("/verify/:token", verifyValidator(), validate, verifyEmail);
router.post("/forgot-password", forgotPasswordValidator(), validate, forgotPassword);
router.post("/reset-password", resetPasswordValidator(), validate, resetPassword);
router.get("/profile", authMiddleware, getProfile);
router.put(
  "/profile/image",
  authMiddleware,
  uploadImageFileMiddleware({
    directory: FileStorageDirectory.PROFILE_PICTURES,
    sizeInMb: 2,
  }).single("image"),
  updateProfileImage
);

export default router;
