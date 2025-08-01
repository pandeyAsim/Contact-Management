"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.create = void 0;
const tslib_1 = require("tslib");
const path_1 = tslib_1.__importDefault(require("path"));
const utils_1 = require("../../utils");
const FileStorageDirectory_enum_1 = tslib_1.__importDefault(require("../../enums/FileStorageDirectory.enum"));
const helper_1 = require("../../utils/helper");
const models_1 = require("../../models");
const processImageUpload = (file) => {
    if (!file)
        return undefined;
    return path_1.default.join(FileStorageDirectory_enum_1.default.UPLOADS, FileStorageDirectory_enum_1.default.CATEGORY_IMAGES, file.filename);
};
const formatCategoryResponse = (category) => {
    const categoryData = {
        ...category.dataValues,
        image: (0, helper_1.getQualifiedImageUrl)(category.image)
    };
    return categoryData;
};
const create = async (req, res) => {
    const { name } = req.body;
    const imagePath = processImageUpload(req.file);
    const slug = await (0, helper_1.generateUniqueSlug)({
        model: models_1.Category,
        text: name,
    });
    const categoryData = {
        name,
        slug,
        image: imagePath,
    };
    const category = await models_1.Category.create(categoryData);
    const createdCategory = await models_1.Category.findOne({
        where: { id: category.id },
        attributes: ["id", "name", "slug", "image", "createdAt", "updatedAt"],
    });
    const responseData = formatCategoryResponse(createdCategory);
    new utils_1.ApiResponse({
        status: 201,
        message: "Category created successfully",
        data: responseData,
    }).send(res);
};
exports.create = create;
