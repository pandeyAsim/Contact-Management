"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ApiResponse {
    constructor(response) {
        this.status = response.status;
        this.message = response.message;
        this.data = response.data;
    }
    send(res) {
        return res.status(this.status || 200).json(this);
    }
}
exports.default = ApiResponse;
