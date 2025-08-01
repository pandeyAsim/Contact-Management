"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const express_1 = tslib_1.__importDefault(require("express"));
const router = express_1.default.Router();
const users_1 = require("../controllers/users");
const middlewares_1 = require("../middlewares");
const FileStorageDirectory_enum_1 = tslib_1.__importDefault(require("../enums/FileStorageDirectory.enum"));
router.get("/me", middlewares_1.authMiddleware, users_1.getProfile);
router.put("/profile", middlewares_1.authMiddleware, users_1.updateProfile);
router.put("/me", middlewares_1.authMiddleware, (0, middlewares_1.uploadImageFileMiddleware)({
    directory: FileStorageDirectory_enum_1.default.PROFILE_PICTURES,
    sizeInMb: 2,
}).single("image"), users_1.updateProfileImage);
router.put("/blog", middlewares_1.authMiddleware, (0, middlewares_1.checkRole)(["admin", "editor"]), (req, res) => {
    res.send("Test route is working");
});
exports.default = router;
