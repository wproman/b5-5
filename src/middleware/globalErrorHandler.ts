


import { NextFunction, Request, Response } from "express";

import { envVars } from "../config";
import AppError from "../errorHelper/AppError";
import { handleCastError } from "../helpers/handleCastError";
import { handlerDuplicateError } from "../helpers/handleDuplicateError";
import { handlerZodError } from "../helpers/handleZodError";
import { handlerValidationError } from "../helpers/handlerValidationError";
import { TErrorSources } from "../interfaces/error.types";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const globalErrorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    // ✅ CRITICAL FIX: Check if headers have already been sent
    if (res.headersSent) {
        console.error('GlobalErrorHandler: Headers already sent, skipping error response');
        return next(err);
    }

    if (envVars.NODE_ENV === "development") {
        console.log('GlobalErrorHandler:', err);
    }

    let errorSources: TErrorSources[] = []
    let statusCode = 500
    let message = "Something Went Wrong!!"

    //Duplicate error
    if (err.code === 11000) {
        const simplifiedError = handlerDuplicateError(err)
        statusCode = simplifiedError.statusCode;
        message = simplifiedError.message
    }
    // Object ID error / Cast Error
    else if (err.name === "CastError") {
        const simplifiedError = handleCastError(err)
        statusCode = simplifiedError.statusCode;
        message = simplifiedError.message
    }
    else if (err.name === "ZodError") {
        const simplifiedError = handlerZodError(err)
        statusCode = simplifiedError.statusCode
        message = simplifiedError.message
        errorSources = simplifiedError.errorSources as TErrorSources[]
    }
    //Mongoose Validation Error
    else if (err.name === "ValidationError") {
        const simplifiedError = handlerValidationError(err)
        statusCode = simplifiedError.statusCode;
        errorSources = simplifiedError.errorSources as TErrorSources[]
        message = simplifiedError.message
    }
    else if (err instanceof AppError) {
        statusCode = err.statusCode
        message = err.message
    } else if (err instanceof Error) {
        statusCode = 500;
        message = err.message
    }

    // ✅ Double check before sending response
    if (!res.headersSent) {
        res.status(statusCode).json({
            success: false,
            message,
            errorSources,
            err: envVars.NODE_ENV === "development" ? err : null,
            stack: envVars.NODE_ENV === "development" ? err.stack : null
        });
    } else {
        console.error('GlobalErrorHandler: Cannot send response - headers already sent');
    }
}