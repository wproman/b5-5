"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const notFound = (req, res) => {
    res.status(404).json({
        success: false,
        message: "Route not found",
    });
};
exports.default = notFound;
