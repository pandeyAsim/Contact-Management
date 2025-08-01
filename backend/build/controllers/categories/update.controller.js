"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.update = void 0;
const tslib_1 = require("tslib");
const utils_1 = require("../../utils");
const helper_1 = require("../../utils/helper");
const models_1 = require("../../models");
const path_1 = tslib_1.__importDefault(require("path"));
const FileStorageDirectory_enum_1 = tslib_1.__importDefault(require("../../enums/FileStorageDirectory.enum"));
const processImageUpdate = (file) => {
    if (!file)
        return undefined;
    return path_1.default.join(FileStorageDirectory_enum_1.default.UPLOADS, FileStorageDirectory_enum_1.default.CATEGORY_IMAGES, file.filename);
};
const processSlugUpdate = async (newName, currentCategory) => {
    if (!newName || newName === currentCategory.name)
        return undefined;
    return await (0, helper_1.generateUniqueSlug)({
        model: models_1.Category,
        text: newName,
        id: currentCategory.id?.toString(),
    });
};
const prepareUpdateData = (name, slug, imagePath, category) => {
    return {
        name: name || category.name,
        slug: slug || category.slug,
        image: imagePath || category.image,
    };
};
const formatUpdateResponse = (category) => {
    return {
        ...category.dataValues,
        image: (0, helper_1.getQualifiedImageUrl)(category.image)
    };
};
const update = async (req, res) => {
    const category = req.category;
    const { name } = req.body;
    const slug = await processSlugUpdate(name, category);
    const imagePath = processImageUpdate(req.file);
    const updateData = prepareUpdateData(name, slug, imagePath, category);
    await models_1.Category.update(updateData, {
        where: { id: category.id },
    });
    const updatedCategory = await models_1.Category.findOne({
        where: { id: category.id },
        attributes: ["id", "name", "slug", "image", "createdAt", "updatedAt"],
    });
    const responseData = formatUpdateResponse(updatedCategory);
    new utils_1.ApiResponse({
        status: 200,
        message: "Category updated successfully",
        data: responseData,
    }).send(res);
};
exports.update = update;
