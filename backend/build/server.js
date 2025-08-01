"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
require("dotenv/config");
const express_1 = tslib_1.__importDefault(require("express"));
const app = (0, express_1.default)();
const db_config_1 = require("./config/db.config");
const env_config_1 = tslib_1.__importDefault(require("./config/env.config"));
const routes_1 = tslib_1.__importDefault(require("./routes"));
const utils_1 = require("./utils");
const middlewares_1 = require("./middlewares");
const cors_1 = tslib_1.__importDefault(require("cors"));
const path_1 = tslib_1.__importDefault(require("path"));
app.use((0, cors_1.default)({
    origin: "http://localhost:3000",
    credentials: true,
}));
app.use("/uploads", express_1.default.static(path_1.default.join(__dirname, "../uploads")));
app.use(express_1.default.json({}));
app.use("/api", routes_1.default);
app.use((req, res) => {
    throw new utils_1.ApiError({
        status: 404,
        message: "Route not found",
    });
});
app.use(middlewares_1.errorHandler);
app.listen(env_config_1.default.APP_PORT, async () => {
    console.log(`Server is running on http://localhost:${env_config_1.default.APP_PORT}`);
    try {
        await (0, db_config_1.connectDb)();
    }
    catch (error) {
        process.exit(1);
    }
});
