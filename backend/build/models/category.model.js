"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const sequelize_typescript_1 = require("sequelize-typescript");
const _1 = require(".");
let Category = class Category extends sequelize_typescript_1.Model {
};
tslib_1.__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.BIGINT,
        primaryKey: true,
        autoIncrement: true,
    }),
    tslib_1.__metadata("design:type", Number)
], Category.prototype, "id", void 0);
tslib_1.__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(100),
        allowNull: false,
        unique: true,
    }),
    tslib_1.__metadata("design:type", String)
], Category.prototype, "name", void 0);
tslib_1.__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(100),
        allowNull: false,
        unique: true,
    }),
    tslib_1.__metadata("design:type", String)
], Category.prototype, "slug", void 0);
tslib_1.__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(255),
        allowNull: true,
    }),
    tslib_1.__metadata("design:type", String)
], Category.prototype, "image", void 0);
tslib_1.__decorate([
    sequelize_typescript_1.CreatedAt,
    tslib_1.__metadata("design:type", Date)
], Category.prototype, "createdAt", void 0);
tslib_1.__decorate([
    sequelize_typescript_1.UpdatedAt,
    tslib_1.__metadata("design:type", Date)
], Category.prototype, "updatedAt", void 0);
tslib_1.__decorate([
    sequelize_typescript_1.DeletedAt,
    tslib_1.__metadata("design:type", Object)
], Category.prototype, "deletedAt", void 0);
tslib_1.__decorate([
    (0, sequelize_typescript_1.HasMany)(() => _1.Contact),
    tslib_1.__metadata("design:type", Array)
], Category.prototype, "contacts", void 0);
Category = tslib_1.__decorate([
    (0, sequelize_typescript_1.Table)({
        underscored: true,
        timestamps: true,
        paranoid: true,
    })
], Category);
exports.default = Category;
