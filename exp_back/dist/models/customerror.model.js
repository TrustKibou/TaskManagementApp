"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomError = void 0;
class CustomError extends Error {
    statusCode;
    constructor(statusCode, message) {
        super(message); //Invoke the parent class Error constructor with its parameters
        this.statusCode = statusCode;
    }
}
exports.CustomError = CustomError;
