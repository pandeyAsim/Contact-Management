"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const path_1 = tslib_1.__importDefault(require("path"));
const models_1 = require("../models");
const utils_1 = require("../utils");
const FileStorageDirectory_enum_1 = tslib_1.__importDefault(require("../enums/FileStorageDirectory.enum"));
const helper_1 = require("../utils/helper");
const updateProfileImage = async (req, res) => {
    if (!req.file) {
        throw new utils_1.ApiError({
            status: 400,
            message: "No file uploaded",
        });
    }
    const imgPath = path_1.default.join(FileStorageDirectory_enum_1.default.UPLOADS, FileStorageDirectory_enum_1.default.PROFILE_PICTURES, req.file.filename);
    await models_1.User.update({ avatar: imgPath }, {
        where: {
            id: req.user.id,
        },
    });
    const updatedUser = await models_1.User.findOne({
        where: { id: req.user.id },
        include: [
            {
                model: models_1.Role,
                attributes: ["id", "title"],
            },
        ],
        attributes: {
            exclude: ["password", "createdAt", "updatedAt", "deletedAt"],
        },
    });
    updatedUser.dataValues.avatar = (0, helper_1.getQualifiedImageUrl)(updatedUser?.avatar);
    new utils_1.ApiResponse({
        status: 200,
        message: "Profile image updated successfully",
        data: updatedUser,
    }).send(res);
};
exports.default = updateProfileImage;
