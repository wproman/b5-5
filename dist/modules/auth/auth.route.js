"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthRoutes = void 0;
const express_1 = require("express");
const passport_1 = __importDefault(require("passport"));
const checkAuth_1 = __importDefault(require("../../middleware/checkAuth"));
const validateRequest_1 = require("../../middleware/validateRequest");
const user_interface_1 = require("../users/user.interface");
const user_validate_zod_1 = require("../users/user.validate.zod");
const auth_controller_1 = require("./auth.controller");
const router = (0, express_1.Router)();
router.post("/register", (0, validateRequest_1.validateRequest)(user_validate_zod_1.userSchemaZod), auth_controller_1.AuthController.createUser);
router.post("/login", auth_controller_1.AuthController.credentialsLogin);
router.post("/refresh-token", auth_controller_1.AuthController.getNewAccessToken);
router.post("/logout", auth_controller_1.AuthController.logout);
router.patch("/reset-password", (0, checkAuth_1.default)(...Object.values(user_interface_1.UserRole)), auth_controller_1.AuthController.resetPassword);
router.get("/google", (req, res, next) => {
    passport_1.default.authenticate("google", { scope: ["profile", "email"] })(req, res, next);
});
router.get("/google/callback", passport_1.default.authenticate("google", { failureRedirect: "/login" }), auth_controller_1.AuthController.googleCallbackController);
exports.AuthRoutes = router;
