import express from "express";
const router = express.Router();
import AuthRoutes from "./auth.routes";
import UserRoutes from "./users.routes";
import CategoryRoutes from "./categories.routes";
import ContactRoutes from "./contacts.routes";
import AdminRoutes from "./admin.routes";

router.use("/auth", AuthRoutes);
router.use("/users", UserRoutes);
router.use("/categories", CategoryRoutes);
router.use("/contacts", ContactRoutes);
router.use("/admin", AdminRoutes);

export default router;
