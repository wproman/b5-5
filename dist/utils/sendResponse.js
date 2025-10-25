"use strict";
//status code
//data
//message
//success
//meta
Object.defineProperty(exports, "__esModule", { value: true });
const sendResponse = (res, data) => {
    var _a;
    res.status(data.statusCode).json({
        success: (_a = data.success) !== null && _a !== void 0 ? _a : true,
        message: data.message,
        data: data.data,
        meta: data.meta,
    });
};
exports.default = sendResponse;
