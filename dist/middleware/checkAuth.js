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
const config_1 = require("../config");
const AppError_1 = __importDefault(require("../errorHelper/AppError"));
const user_interface_1 = require("../modules/users/user.interface");
const user_models_1 = require("../modules/users/user.models");
const jwt_1 = require("../utils/jwt");
const checkAuth = (...authRoles) => {
    return (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        const accessToken = req.cookies.accessToken || ((_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(" ")[1]);
        if (!accessToken) {
            res.status(401).json({ message: "Unauthorized" });
            return next();
        }
        const verifyToken = jwt_1.JwtHelper.verifyToken(accessToken, config_1.envVars.JWT_ACCESS_SECRET
        // process.env.JWT_ACCESS_SECRET as string --- IGNORE ---               
        );
        const isUserExist = yield user_models_1.User.findOne({ email: verifyToken.email });
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
        // if (isUserExist.isVerified === false) {
        //   throw new AppError("User is not verified", 401);
        // }
        if (!verifyToken) {
            res.status(401).json({ message: "Invalid token" });
            return next();
        }
        req.user = verifyToken;
        if (authRoles.length > 0 && !authRoles.includes(verifyToken.role)) {
            throw new AppError_1.default(`Unauthorized access ${verifyToken}`, 403);
        }
        next();
    });
};
exports.default = checkAuth;
