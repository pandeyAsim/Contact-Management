"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const path_1 = tslib_1.__importDefault(require("path"));
const models_1 = require("../../models");
const utils_1 = require("../../utils");
const FileStorageDirectory_enum_1 = tslib_1.__importDefault(require("../../enums/FileStorageDirectory.enum"));
const helper_1 = require("../../utils/helper");
const updateProfileImage = async (req, res) => {
    try {
        console.log('req.file:', req.file);
        console.log('req.body:', req.body);
        console.log('req.user:', req.user);
        if (!req.file) {
            throw new utils_1.ApiError({
                status: 400,
                message: "No file uploaded",
            });
        }
        if (!req.user || !req.user.id) {
            throw new utils_1.ApiError({
                status: 401,
                message: "User not authenticated",
            });
        }
        const imgPath = path_1.default.join(FileStorageDirectory_enum_1.default.UPLOADS, FileStorageDirectory_enum_1.default.PROFILE_PICTURES, req.file.filename);
        console.log('Updating user with ID:', req.user.id);
        console.log('Image path:', imgPath);
        const updateResult = await models_1.User.update({ avatar: imgPath }, {
            where: {
                id: req.user.id,
            },
        });
        console.log('Update result:', updateResult);
        const updatedUser = await models_1.User.findOne({
            where: { id: req.user.id },
            include: [
                {
                    model: models_1.Role,
                    as: "role",
                    attributes: ["id", "title"],
                },
            ],
            attributes: {
                exclude: ["password", "createdAt", "updatedAt", "deletedAt"],
            },
        });
        if (!updatedUser) {
            throw new utils_1.ApiError({
                status: 404,
                message: "User not found after update",
            });
        }
        updatedUser.dataValues.avatar = (0, helper_1.getQualifiedImageUrl)(updatedUser.avatar);
        new utils_1.ApiResponse({
            status: 200,
            message: "Profile image updated successfully",
            data: updatedUser,
        }).send(res);
    }
    catch (error) {
        console.error('Update profile image error:', error);
        if (error instanceof utils_1.ApiError) {
            throw error;
        }
        throw new utils_1.ApiError({
            status: 500,
            message: "Internal server error while updating profile image",
            errors: [{ server: error instanceof Error ? error.message : 'Unknown error' }]
        });
    }
};
exports.default = updateProfileImage;
