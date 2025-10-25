"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRoutes = void 0;
const express_1 = require("express");
const checkAuth_1 = __importDefault(require("../../middleware/checkAuth"));
const validateRequest_1 = require("../../middleware/validateRequest");
const user_controller_1 = require("./user.controller");
const user_interface_1 = require("./user.interface");
const user_validate_zod_1 = require("./user.validate.zod");
const router = (0, express_1.Router)();
router.get("/me", (0, checkAuth_1.default)(...Object.values(user_interface_1.UserRole)), user_controller_1.UserController.getProfile);
//ai routhe ta add korlam 7:27pm
router.patch("/profile/:id", (0, checkAuth_1.default)(...Object.values(user_interface_1.UserRole)), user_controller_1.UserController.updateUser);
router.get("/all-user", (0, checkAuth_1.default)(user_interface_1.UserRole.ADMIN), user_controller_1.UserController.getAllUsers);
router.patch("/block/:id", (0, validateRequest_1.validateRequestParams)(user_validate_zod_1.userIdParamSchema), (0, checkAuth_1.default)(user_interface_1.UserRole.ADMIN), user_controller_1.UserController.blockUnblockUser);
router.patch('/unblock/:id', (0, checkAuth_1.default)(user_interface_1.UserRole.ADMIN), user_controller_1.UserController.blockUnblockUser);
router.patch("/update/:id", (0, validateRequest_1.validateRequest)(user_validate_zod_1.updateUserSchemaZod), (0, checkAuth_1.default)(...Object.values(user_interface_1.UserRole)), user_controller_1.UserController.updateUser);
//emergency contact
/**
 * @route   PATCH /api/user/emergency-contacts
 * @desc    Update user's emergency contacts
 * @access  Private
 */
router.patch('/emergency-contacts', (0, validateRequest_1.validateRequest)(user_validate_zod_1.emergencyContactValidation.updateEmergencyContacts), (0, checkAuth_1.default)(...Object.values(user_interface_1.UserRole)), user_controller_1.UserController.updateEmergencyContacts);
/**
 * @route   GET /api/user/emergency-contacts
 * @desc    Get user's emergency contacts
 * @access  Private
 */
router.get('/emergency-contacts', (0, validateRequest_1.validateRequest)(user_validate_zod_1.emergencyContactValidation.getEmergencyContacts), (0, checkAuth_1.default)(...Object.values(user_interface_1.UserRole)), user_controller_1.UserController.getEmergencyContacts);
/**
 * @route   POST /api/user/emergency-contacts
 * @desc    Add a single emergency contact
 * @access  Private
 */
router.post('/emergency-contacts', (0, validateRequest_1.validateRequest)(user_validate_zod_1.emergencyContactValidation.addEmergencyContact), (0, checkAuth_1.default)(...Object.values(user_interface_1.UserRole)), user_controller_1.UserController.addEmergencyContact);
/**
 * @route   DELETE /api/user/emergency-contacts/:contactIndex
 * @desc    Remove an emergency contact by index
 * @access  Private
 */
router.delete('/emergency-contacts/:contactIndex', (0, validateRequest_1.validateRequest)(user_validate_zod_1.emergencyContactValidation.removeEmergencyContact), (0, checkAuth_1.default)(...Object.values(user_interface_1.UserRole)), user_controller_1.UserController.removeEmergencyContact);
exports.UserRoutes = router;
