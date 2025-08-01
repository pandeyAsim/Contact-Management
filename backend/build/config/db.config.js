"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDb = void 0;
const tslib_1 = require("tslib");
const sequelize_typescript_1 = require("sequelize-typescript");
const env_config_1 = tslib_1.__importDefault(require("./env.config"));
const models = tslib_1.__importStar(require("../models"));
const createSequelizeInstance = () => {
    return new sequelize_typescript_1.Sequelize({
        database: env_config_1.default.DB_NAME,
        dialect: env_config_1.default.DB_DIALECT,
        username: env_config_1.default.DB_USER,
        password: env_config_1.default.DB_PASSWORD,
        models: Object.values(models),
        logging: false,
    });
};
const sequelize = createSequelizeInstance();
const connectDb = async () => {
    try {
        await sequelize.authenticate();
        console.log("Database connection has been established successfully.");
        const syncOptions = {
            alter: false,
            force: false,
        };
        await sequelize.sync(syncOptions);
        console.log("Database tables synchronized successfully.");
    }
    catch (error) {
        console.error("Unable to connect to the database:", error);
        throw error;
    }
};
exports.connectDb = connectDb;
exports.default = sequelize;
