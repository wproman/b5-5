"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.globalErrorHandler = void 0;
const config_1 = require("../config");
const AppError_1 = __importDefault(require("../errorHelper/AppError"));
const handleCastError_1 = require("../helpers/handleCastError");
const handleDuplicateError_1 = require("../helpers/handleDuplicateError");
const handleZodError_1 = require("../helpers/handleZodError");
const handlerValidationError_1 = require("../helpers/handlerValidationError");
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const globalErrorHandler = (err, req, res, next) => {
    // ✅ CRITICAL FIX: Check if headers have already been sent
    if (res.headersSent) {
        console.error('GlobalErrorHandler: Headers already sent, skipping error response');
        return next(err);
    }
    if (config_1.envVars.NODE_ENV === "development") {
        console.log('GlobalErrorHandler:', err);
    }
    let errorSources = [];
    let statusCode = 500;
    let message = "Something Went Wrong!!";
    //Duplicate error
    if (err.code === 11000) {
        const simplifiedError = (0, handleDuplicateError_1.handlerDuplicateError)(err);
        statusCode = simplifiedError.statusCode;
        message = simplifiedError.message;
    }
    // Object ID error / Cast Error
    else if (err.name === "CastError") {
        const simplifiedError = (0, handleCastError_1.handleCastError)(err);
        statusCode = simplifiedError.statusCode;
        message = simplifiedError.message;
    }
    else if (err.name === "ZodError") {
        const simplifiedError = (0, handleZodError_1.handlerZodError)(err);
        statusCode = simplifiedError.statusCode;
        message = simplifiedError.message;
        errorSources = simplifiedError.errorSources;
    }
    //Mongoose Validation Error
    else if (err.name === "ValidationError") {
        const simplifiedError = (0, handlerValidationError_1.handlerValidationError)(err);
        statusCode = simplifiedError.statusCode;
        errorSources = simplifiedError.errorSources;
        message = simplifiedError.message;
    }
    else if (err instanceof AppError_1.default) {
        statusCode = err.statusCode;
        message = err.message;
    }
    else if (err instanceof Error) {
        statusCode = 500;
        message = err.message;
    }
    // ✅ Double check before sending response
    if (!res.headersSent) {
        res.status(statusCode).json({
            success: false,
            message,
            errorSources,
            err: config_1.envVars.NODE_ENV === "development" ? err : null,
            stack: config_1.envVars.NODE_ENV === "development" ? err.stack : null
        });
    }
    else {
        console.error('GlobalErrorHandler: Cannot send response - headers already sent');
    }
};
exports.globalErrorHandler = globalErrorHandler;
