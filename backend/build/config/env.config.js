"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = require("dotenv");
const envalid_1 = require("envalid");
(0, dotenv_1.config)();
const env = (0, envalid_1.cleanEnv)(process.env, {
    APP_URL: (0, envalid_1.str)(),
    FRONTEND_URL: (0, envalid_1.str)({
        default: "http://localhost:3002"
    }),
    APP_PORT: (0, envalid_1.port)({
        default: 8080,
    }),
    DB_USER: (0, envalid_1.str)(),
    DB_NAME: (0, envalid_1.str)(),
    DB_PASSWORD: (0, envalid_1.str)(),
    DB_HOST: (0, envalid_1.str)(),
    DB_PORT: (0, envalid_1.port)(),
    DB_DIALECT: (0, envalid_1.str)(),
    JWT_SECRET: (0, envalid_1.str)(),
    GMAIL_APP_PASSWORD: (0, envalid_1.str)(),
    GMAIL_USER: (0, envalid_1.str)(),
});
exports.default = env;
