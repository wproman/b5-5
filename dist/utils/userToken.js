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
exports.UserToken = void 0;
const config_1 = require("../config");
const AppError_1 = __importDefault(require("../errorHelper/AppError"));
const user_interface_1 = require("../modules/users/user.interface");
const user_models_1 = require("../modules/users/user.models");
const jwt_1 = require("./jwt");
const createUserToken = (user) => __awaiter(void 0, void 0, void 0, function* () {
    const JwtPayload = {
        email: user.email,
        role: user.role,
        id: user.id,
    };
    const accessToken = jwt_1.JwtHelper.generateToken(JwtPayload, config_1.envVars.JWT_ACCESS_SECRET, config_1.envVars.JWT_ACCESS_EXPIRES);
    const refreshToken = jwt_1.JwtHelper.generateToken(JwtPayload, config_1.envVars.JWT_REFRESH_SECRET, config_1.envVars.JWT_REFRESH_EXPIRES);
    return {
        accessToken,
        refreshToken,
    };
});
const creatNewAccessTokenWithRefreshToken = (refreshToken) => __awaiter(void 0, void 0, void 0, function* () {
    const verifiedRefreshToken = jwt_1.JwtHelper.verifyToken(refreshToken, config_1.envVars.JWT_REFRESH_SECRET);
    const isUserExist = yield user_models_1.User.findOne({ email: verifiedRefreshToken.email });
    if (!isUserExist) {
        throw new AppError_1.default("User not found", 404);
    }
    if (isUserExist.isActive === user_interface_1.IsActive.BLOCKED) {
        throw new AppError_1.default("User is blocked", 401);
    }
    if (isUserExist.isActive === user_interface_1.IsActive.DELETED) {
        throw new AppError_1.default("User is deleted", 401);
    }
    if (isUserExist.isActive === user_interface_1.IsActive.INACTIVE) {
        throw new AppError_1.default("User is inactive", 401);
    }
    if (isUserExist.isVerified === false) {
        throw new AppError_1.default("User is not verified", 401);
    }
    const payload = { email: isUserExist.email, role: isUserExist.role, id: isUserExist._id, };
    const accessToken = jwt_1.JwtHelper.generateToken(payload, config_1.envVars.JWT_ACCESS_SECRET, config_1.envVars.JWT_ACCESS_EXPIRES);
    return {
        accessToken,
    };
});
exports.UserToken = {
    createUserToken,
    creatNewAccessTokenWithRefreshToken,
};
