"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const express_1 = tslib_1.__importDefault(require("express"));
const router = express_1.default.Router();
const categories_1 = require("../controllers/categories");
const categories_2 = require("../validators/categories");
const middlewares_1 = require("../middlewares");
const FileStorageDirectory_enum_1 = tslib_1.__importDefault(require("../enums/FileStorageDirectory.enum"));
const validate_1 = tslib_1.__importDefault(require("../validators/validate"));
router.post("/", middlewares_1.authMiddleware, (0, middlewares_1.checkRole)(["admin"]), (0, middlewares_1.uploadImageFileMiddleware)({
    directory: FileStorageDirectory_enum_1.default.CATEGORY_IMAGES,
    sizeInMb: 2,
}).single("image"), categories_2.createValidator, validate_1.default, categories_1.create);
router.delete("/:id", middlewares_1.authMiddleware, (0, middlewares_1.checkRole)(["admin"]), categories_2.deleteValidator, validate_1.default, categories_1.destroy);
router.get("/", middlewares_1.authMiddleware, categories_2.getValidator, validate_1.default, categories_1.get);
router.get("/:id", middlewares_1.authMiddleware, categories_2.getSingleValidator, validate_1.default, categories_1.getSingle);
router.put("/:id", middlewares_1.authMiddleware, (0, middlewares_1.checkRole)(["admin"]), (0, middlewares_1.uploadImageFileMiddleware)({
    directory: FileStorageDirectory_enum_1.default.CATEGORY_IMAGES,
    sizeInMb: 2,
}).single("image"), categories_2.updateValidator, validate_1.default, categories_1.update);
exports.default = router;
