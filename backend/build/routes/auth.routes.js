"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const express_1 = tslib_1.__importDefault(require("express"));
const router = express_1.default.Router();
const users_1 = require("../controllers/users");
const validators_1 = require("../validators");
const validate_1 = tslib_1.__importDefault(require("../validators/validate"));
const middlewares_1 = require("../middlewares");
const FileStorageDirectory_enum_1 = tslib_1.__importDefault(require("../enums/FileStorageDirectory.enum"));
router.post("/register", (0, validators_1.registerValidator)(), validate_1.default, users_1.register);
router.post("/login", (0, validators_1.loginValidator)(), validate_1.default, users_1.login);
router.post("/logout", middlewares_1.authMiddleware, users_1.logout);
router.post("/refresh", users_1.refreshToken);
router.get("/verify/:token", (0, validators_1.verifyValidator)(), validate_1.default, users_1.verifyEmail);
router.post("/forgot-password", (0, validators_1.forgotPasswordValidator)(), validate_1.default, users_1.forgotPassword);
router.post("/reset-password", (0, validators_1.resetPasswordValidator)(), validate_1.default, users_1.resetPassword);
router.get("/profile", middlewares_1.authMiddleware, users_1.getProfile);
router.put("/profile/image", middlewares_1.authMiddleware, (0, middlewares_1.uploadImageFileMiddleware)({
    directory: FileStorageDirectory_enum_1.default.PROFILE_PICTURES,
    sizeInMb: 2,
}).single("image"), users_1.updateProfileImage);
exports.default = router;
