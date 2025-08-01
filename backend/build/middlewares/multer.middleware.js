"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.multerDiskStorage = exports.uploadFileMiddleware = exports.uploadImageFileMiddleware = exports.uploadsDir = exports.rootDir = void 0;
const tslib_1 = require("tslib");
const multer_1 = tslib_1.__importDefault(require("multer"));
const path_1 = tslib_1.__importDefault(require("path"));
const fs_1 = tslib_1.__importDefault(require("fs"));
const uuid_1 = require("uuid");
const app_root_path_1 = tslib_1.__importDefault(require("app-root-path"));
const utils_1 = require("../utils");
const FileStorageDirectory_enum_1 = tslib_1.__importDefault(require("../enums/FileStorageDirectory.enum"));
exports.rootDir = app_root_path_1.default.path;
exports.uploadsDir = path_1.default.join(exports.rootDir, FileStorageDirectory_enum_1.default.UPLOADS);
const uploadImageFileMiddleware = ({ directory, sizeInMb = 10, }) => {
    const upload = (0, multer_1.default)({
        storage: (0, exports.multerDiskStorage)(directory),
        limits: {
            fileSize: sizeInMb * 1024 * 1024,
        },
        fileFilter: (req, file, cb) => {
            console.log('File received:', {
                fieldname: file.fieldname,
                originalname: file.originalname,
                mimetype: file.mimetype
            });
            if (file.mimetype.startsWith("image")) {
                cb(null, true);
            }
            else {
                cb(new utils_1.ApiError({
                    status: 400,
                    message: "Only images are allowed!",
                    errors: [
                        {
                            [file.fieldname]: "Only images are allowed!",
                        },
                    ],
                }));
            }
        },
    });
    return upload;
};
exports.uploadImageFileMiddleware = uploadImageFileMiddleware;
const uploadFileMiddleware = ({ directory, sizeInMb = 30, }) => {
    return (0, multer_1.default)({
        storage: (0, exports.multerDiskStorage)(directory),
        limits: {
            fileSize: sizeInMb * 1024 * 1024,
        },
    });
};
exports.uploadFileMiddleware = uploadFileMiddleware;
const multerDiskStorage = (directory) => {
    return multer_1.default.diskStorage({
        destination: async function (req, file, cb) {
            try {
                const fullPath = path_1.default.join(exports.uploadsDir, directory);
                if (!(await fs_1.default.promises.stat(fullPath).catch(() => false))) {
                    await fs_1.default.promises.mkdir(fullPath, { recursive: true });
                }
                cb(null, fullPath);
            }
            catch (err) {
                cb(err.message, "");
            }
        },
        filename: function (req, file, cb) {
            try {
                const fileName = (0, uuid_1.v4)();
                cb(null, fileName + path_1.default.extname(file.originalname));
            }
            catch (err) {
                cb(err.message, "");
            }
        },
    });
};
exports.multerDiskStorage = multerDiskStorage;
