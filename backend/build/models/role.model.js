"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const sequelize_typescript_1 = require("sequelize-typescript");
const user_model_1 = tslib_1.__importDefault(require("./user.model"));
let Role = class Role extends sequelize_typescript_1.Model {
};
tslib_1.__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.BIGINT,
        primaryKey: true,
        autoIncrement: true,
    }),
    tslib_1.__metadata("design:type", Number)
], Role.prototype, "id", void 0);
tslib_1.__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING,
        allowNull: false,
    }),
    tslib_1.__metadata("design:type", String)
], Role.prototype, "title", void 0);
tslib_1.__decorate([
    sequelize_typescript_1.CreatedAt,
    tslib_1.__metadata("design:type", Date)
], Role.prototype, "createdAt", void 0);
tslib_1.__decorate([
    sequelize_typescript_1.UpdatedAt,
    tslib_1.__metadata("design:type", Date)
], Role.prototype, "updatedAt", void 0);
tslib_1.__decorate([
    (0, sequelize_typescript_1.HasMany)(() => user_model_1.default),
    tslib_1.__metadata("design:type", Array)
], Role.prototype, "users", void 0);
Role = tslib_1.__decorate([
    (0, sequelize_typescript_1.Table)({
        underscored: true,
        timestamps: true,
    })
], Role);
exports.default = Role;
