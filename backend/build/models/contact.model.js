"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const sequelize_typescript_1 = require("sequelize-typescript");
const _1 = require(".");
let Contact = class Contact extends sequelize_typescript_1.Model {
};
tslib_1.__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.BIGINT,
        primaryKey: true,
        autoIncrement: true,
    }),
    tslib_1.__metadata("design:type", Number)
], Contact.prototype, "id", void 0);
tslib_1.__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(100),
        allowNull: false,
    }),
    tslib_1.__metadata("design:type", String)
], Contact.prototype, "fullName", void 0);
tslib_1.__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(100),
        allowNull: true,
    }),
    tslib_1.__metadata("design:type", String)
], Contact.prototype, "company", void 0);
tslib_1.__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(255),
        allowNull: true,
    }),
    tslib_1.__metadata("design:type", String)
], Contact.prototype, "avatar", void 0);
tslib_1.__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(15),
        allowNull: false,
    }),
    tslib_1.__metadata("design:type", String)
], Contact.prototype, "phoneNumber", void 0);
tslib_1.__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(100),
        allowNull: false,
    }),
    tslib_1.__metadata("design:type", String)
], Contact.prototype, "email", void 0);
tslib_1.__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(255),
        allowNull: true,
    }),
    tslib_1.__metadata("design:type", String)
], Contact.prototype, "address", void 0);
tslib_1.__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(10),
        allowNull: true,
    }),
    tslib_1.__metadata("design:type", String)
], Contact.prototype, "gender", void 0);
tslib_1.__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(100),
        allowNull: true,
    }),
    tslib_1.__metadata("design:type", String)
], Contact.prototype, "department", void 0);
tslib_1.__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.TEXT,
        allowNull: true,
    }),
    tslib_1.__metadata("design:type", String)
], Contact.prototype, "notes", void 0);
tslib_1.__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.BOOLEAN,
        defaultValue: false,
    }),
    tslib_1.__metadata("design:type", Boolean)
], Contact.prototype, "isStared", void 0);
tslib_1.__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.INTEGER,
        defaultValue: 0,
    }),
    tslib_1.__metadata("design:type", Number)
], Contact.prototype, "viewsCount", void 0);
tslib_1.__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => _1.User),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.BIGINT,
        allowNull: false,
    }),
    tslib_1.__metadata("design:type", Number)
], Contact.prototype, "userId", void 0);
tslib_1.__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => _1.User),
    tslib_1.__metadata("design:type", _1.User)
], Contact.prototype, "user", void 0);
tslib_1.__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => _1.Category),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.BIGINT,
        allowNull: true,
        onDelete: "SET NULL",
    }),
    tslib_1.__metadata("design:type", Number)
], Contact.prototype, "categoryId", void 0);
tslib_1.__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => _1.Category),
    tslib_1.__metadata("design:type", _1.Category)
], Contact.prototype, "category", void 0);
tslib_1.__decorate([
    sequelize_typescript_1.CreatedAt,
    tslib_1.__metadata("design:type", Date)
], Contact.prototype, "createdAt", void 0);
tslib_1.__decorate([
    sequelize_typescript_1.UpdatedAt,
    tslib_1.__metadata("design:type", Date)
], Contact.prototype, "updatedAt", void 0);
tslib_1.__decorate([
    sequelize_typescript_1.DeletedAt,
    tslib_1.__metadata("design:type", Date)
], Contact.prototype, "deletedAt", void 0);
Contact = tslib_1.__decorate([
    (0, sequelize_typescript_1.Table)({
        underscored: true,
        timestamps: true,
        paranoid: true,
    })
], Contact);
exports.default = Contact;
