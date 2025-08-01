"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const sequelize_typescript_1 = require("sequelize-typescript");
const user_model_1 = tslib_1.__importDefault(require("./user.model"));
let RefreshToken = class RefreshToken extends sequelize_typescript_1.Model {
};
tslib_1.__decorate([
    (0, sequelize_typescript_1.Column)({ autoIncrement: true, primaryKey: true, type: sequelize_typescript_1.DataType.BIGINT }),
    tslib_1.__metadata("design:type", Number)
], RefreshToken.prototype, "id", void 0);
tslib_1.__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => user_model_1.default),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.BIGINT,
        allowNull: false,
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
    }),
    tslib_1.__metadata("design:type", Number)
], RefreshToken.prototype, "userId", void 0);
tslib_1.__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => user_model_1.default),
    tslib_1.__metadata("design:type", user_model_1.default)
], RefreshToken.prototype, "user", void 0);
tslib_1.__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING,
        allowNull: false,
    }),
    tslib_1.__metadata("design:type", String)
], RefreshToken.prototype, "token", void 0);
tslib_1.__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DATE,
        allowNull: false,
    }),
    tslib_1.__metadata("design:type", Date)
], RefreshToken.prototype, "expiresAt", void 0);
tslib_1.__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.BOOLEAN,
        allowNull: true,
        defaultValue: false,
    }),
    tslib_1.__metadata("design:type", Boolean)
], RefreshToken.prototype, "isExpired", void 0);
tslib_1.__decorate([
    sequelize_typescript_1.CreatedAt,
    tslib_1.__metadata("design:type", Date)
], RefreshToken.prototype, "createdAt", void 0);
tslib_1.__decorate([
    sequelize_typescript_1.UpdatedAt,
    tslib_1.__metadata("design:type", Date)
], RefreshToken.prototype, "updatedAt", void 0);
RefreshToken = tslib_1.__decorate([
    (0, sequelize_typescript_1.Table)({
        underscored: true,
        timestamps: true,
    })
], RefreshToken);
exports.default = RefreshToken;
