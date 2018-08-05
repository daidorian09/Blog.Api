"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Response {
    constructor(isSucessfull, statusCode, data) {
        this.isSuccessful = isSucessfull;
        this.statusCode = statusCode;
        this.data = data;
    }
}
exports.Response = Response;
