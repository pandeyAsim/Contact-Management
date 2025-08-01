"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getQualifiedImageUrl = exports.generateUniqueSlug = exports.generateSlug = exports.slugifyString = void 0;
const tslib_1 = require("tslib");
const slugify_1 = tslib_1.__importDefault(require("slugify"));
const nanoid_1 = require("nanoid");
const env_config_1 = tslib_1.__importDefault(require("../config/env.config"));
const sequelize_1 = require("sequelize");
const slugifyString = (str) => {
    return (0, slugify_1.default)(str, {
        remove: /[*+~.()'"!:@]/g,
        replacement: "-",
        lower: true,
        trim: true,
    });
};
exports.slugifyString = slugifyString;
const generateSlug = (len) => {
    return (0, nanoid_1.nanoid)(len);
};
exports.generateSlug = generateSlug;
const generateUniqueSlug = async ({ model, text, id, }) => {
    if (text.length > 80) {
        text = text.slice(0, 80);
    }
    const slug = (0, exports.slugifyString)(text);
    const existing = await model.findOne({
        where: {
            slug,
            ...(id && {
                id: {
                    [sequelize_1.Op.ne]: id,
                },
            }),
        },
    });
    if (!existing) {
        return slug;
    }
    const newSlug = `${slug}-${(0, exports.generateSlug)(6)}`;
    if (newSlug.length < 6) {
        return (0, exports.generateSlug)(6);
    }
    return newSlug;
};
exports.generateUniqueSlug = generateUniqueSlug;
const getQualifiedImageUrl = (relativePath, useDefault = true) => {
    console.log('getQualifiedImageUrl called with:', { relativePath, useDefault, APP_URL: env_config_1.default.APP_URL });
    if ((!relativePath || relativePath === null) && useDefault) {
        const defaultUrl = `${env_config_1.default.APP_URL}/uploads/default/avatar-modern.svg`;
        console.log('Returning default avatar URL:', defaultUrl);
        return defaultUrl;
    }
    if (!relativePath || relativePath === null) {
        console.log('No path and no default requested, returning empty string');
        return "";
    }
    let normalizedPath = relativePath.replace(/\\/g, '/');
    if (!normalizedPath.startsWith('uploads/')) {
        normalizedPath = `uploads/${normalizedPath}`;
    }
    normalizedPath = normalizedPath.replace(/\/+/g, '/');
    const fullUrl = `${env_config_1.default.APP_URL}/${normalizedPath}`;
    console.log('Returning full URL:', fullUrl);
    return fullUrl;
};
exports.getQualifiedImageUrl = getQualifiedImageUrl;
