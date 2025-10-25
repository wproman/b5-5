"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Catch async errors wrapper
const catchAsync = (fn) => {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch((error) => {
            // Check if headers have already been sent
            if (res.headersSent) {
                return;
            }
            next(error);
        });
    };
};
exports.default = catchAsync;
