"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = exports.logout = void 0;
const config_1 = require("../../config");
const AppError_1 = __importDefault(require("../../errorHelper/AppError"));
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const setCookie_1 = require("../../utils/setCookie");
const userToken_1 = require("../../utils/userToken");
const auth_service_1 = require("./auth.service");
// Create User Controller
const createUser = (0, catchAsync_1.default)((req, res, _next) => __awaiter(void 0, void 0, void 0, function* () {
    const userData = req.body;
    const newUser = yield auth_service_1.AuthService.createUserService(userData);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: 201,
        message: "User created successfully",
        data: newUser,
    });
}));
const credentialsLogin = (0, catchAsync_1.default)((req, res, _next) => __awaiter(void 0, void 0, void 0, function* () {
    const logingInfo = yield auth_service_1.AuthService.credentialslogin(req.body);
    setCookie_1.CookieHelper.setAuthCookie(res, logingInfo);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: 200,
        message: "User logged in successfully",
        data: logingInfo,
    });
}));
const getNewAccessToken = (0, catchAsync_1.default)((req, res, _next) => __awaiter(void 0, void 0, void 0, function* () {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
        throw new AppError_1.default("Unauthorized", 401);
    }
    const tokenInfo = yield auth_service_1.AuthService.getNewAccessToken(refreshToken);
    setCookie_1.CookieHelper.setAuthCookie(res, tokenInfo);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: 200,
        message: "User logged in successfully",
        data: tokenInfo,
    });
}));
const googleCallbackController = (0, catchAsync_1.default)((req, res, _next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    if (!user) {
        throw new AppError_1.default("User not found", 404);
    }
    const tokenInfo = yield userToken_1.UserToken.createUserToken(user);
    setCookie_1.CookieHelper.setAuthCookie(res, tokenInfo);
    res.redirect(config_1.envVars.FRONTEN_URL);
}));
exports.logout = (0, catchAsync_1.default)((req, res, _next) => __awaiter(void 0, void 0, void 0, function* () {
    setCookie_1.CookieHelper.clearAuthCookies(res);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: 200,
        message: "User logged out successfully",
        data: null,
    });
}));
const resetPassword = (0, catchAsync_1.default)((req, res, _next) => __awaiter(void 0, void 0, void 0, function* () {
    const newPassword = req.body.newPassword;
    const oldPassword = req.body.oldPassword;
    const decodateToken = req.user;
    yield auth_service_1.AuthService.resetPassword(oldPassword, newPassword, decodateToken);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: 200,
        message: "User password changed  successfully",
        data: null,
    });
}));
exports.AuthController = {
    createUser,
    credentialsLogin,
    getNewAccessToken,
    logout: exports.logout,
    resetPassword,
    googleCallbackController
};
