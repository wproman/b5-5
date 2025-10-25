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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = exports.credentialslogin = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const AppError_1 = __importDefault(require("../../errorHelper/AppError"));
const userToken_1 = require("../../utils/userToken");
const driver_model_1 = require("../driver/driver.model");
const user_models_1 = require("../users/user.models");
const createUserService = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { role } = payload, userData = __rest(payload, ["role"]);
    // Common validation
    if (!['rider', 'driver'].includes(role)) {
        throw new AppError_1.default("Invalid role", 400);
    }
    const hashedPassword = bcryptjs_1.default.hashSync(userData.password, 10);
    // Create user
    const user = yield user_models_1.User.create(Object.assign(Object.assign({}, userData), { role, password: hashedPassword }));
    if (role === 'driver') {
        if (!payload.licenseNumber || !payload.vehicleInfo) {
            yield user_models_1.User.deleteOne({ _id: user._id }); // Rollback
            throw new AppError_1.default("Missing driver information", 400);
        }
        yield driver_model_1.DriverModel.create({
            userId: user._id,
            licenseNumber: payload.licenseNumber,
            vehicleInfo: payload.vehicleInfo,
            approvalStatus: 'pending'
        });
    }
    return user;
});
const credentialslogin = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = payload;
    if (!email || !password) {
        throw new AppError_1.default("Email and password are required", 400);
    }
    const isUserExist = yield user_models_1.User.findOne({ email });
    if (!isUserExist) {
        throw new AppError_1.default("User not found", 404);
    }
    // 🚫 Blocked or deleted check
    if (isUserExist.isBlocked) {
        throw new AppError_1.default("Your account has been blocked. Please contact support.", 403);
    }
    if (isUserExist.isDeleted) {
        throw new AppError_1.default("This account has been deleted.", 403);
    }
    const isPasswordValid = yield bcryptjs_1.default.compare(password, isUserExist.password);
    if (!isPasswordValid) {
        throw new AppError_1.default("Invalid credentials", 401);
    }
    const userTokens = yield userToken_1.UserToken.createUserToken(isUserExist);
    // remove password before returning user object
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const _a = isUserExist.toObject(), { password: _ } = _a, userWithoutPassword = __rest(_a, ["password"]);
    return {
        accessToken: userTokens.accessToken,
        refreshToken: userTokens.refreshToken,
        user: userWithoutPassword,
    };
});
exports.credentialslogin = credentialslogin;
const getNewAccessToken = (refreshToken) => __awaiter(void 0, void 0, void 0, function* () {
    const newAccessToken = (yield userToken_1.UserToken.creatNewAccessTokenWithRefreshToken(refreshToken)).accessToken;
    return {
        accessToken: newAccessToken,
    };
});
const resetPassword = (oldPassword, newPassword, decodedToken) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_models_1.User.findById(decodedToken.id);
    if (!user) {
        throw new AppError_1.default("User not found", 404);
    }
    const isOldPasswordMatch = yield bcryptjs_1.default.compare(oldPassword, user.password);
    if (!isOldPasswordMatch) {
        throw new AppError_1.default("Old password doesn't match", 403);
    }
    user.password = yield bcryptjs_1.default.hash(newPassword, 10);
    yield user.save();
    return true;
});
exports.AuthService = {
    createUserService,
    credentialslogin: exports.credentialslogin,
    getNewAccessToken,
    resetPassword
};
