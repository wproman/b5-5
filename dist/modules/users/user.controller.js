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
exports.UserController = exports.removeEmergencyContact = exports.addEmergencyContact = exports.getEmergencyContacts = exports.updateEmergencyContacts = void 0;
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const user_service_1 = require("./user.service");
// Get All Users Controller
const getAllUsers = (0, catchAsync_1.default)((req, res, _next) => __awaiter(void 0, void 0, void 0, function* () {
    const filter = req.query;
    const users = yield user_service_1.UserService.getAllUsersService(filter);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: 200,
        message: "Users retrieved successfully",
        data: users,
    });
}));
const updateUser = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.params.id; // From auth middleware
    const { name, phone, address, picture } = req.body;
    const decodedToken = req.user;
    const updateData = {};
    if (name)
        updateData.name = name;
    if (phone)
        updateData.phone = phone;
    if (address)
        updateData.address = address;
    if (picture)
        updateData.picture = picture;
    const updatedUser = yield user_service_1.UserService.updateUserService(userId, updateData, decodedToken);
    res.status(200).json({
        success: true,
        message: 'Profile updated successfully',
        data: updatedUser
    });
}));
const blockUnblockUser = (0, catchAsync_1.default)((req, res, _next) => __awaiter(void 0, void 0, void 0, function* () {
    // Get admin from auth middleware
    const admin = req.user;
    const action = req.path.includes("/block/") ? true : false;
    const userId = req.params.id;
    // Call service
    const result = yield user_service_1.UserService.toggleUserBlockStatus(userId, admin, action);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: 200,
        message: `User ${action ? "blocked" : "unblocked"} successfully`,
        data: result,
    });
}));
const getProfile = (0, catchAsync_1.default)((req, res, _next) => __awaiter(void 0, void 0, void 0, function* () {
    const verifiedToken = req.user;
    const userId = verifiedToken.id;
    const user = yield user_service_1.UserService.getProfileService(userId);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: 200,
        message: "User profile retrieved successfully",
        data: user,
    });
}));
//Emergency contract Controller
exports.updateEmergencyContacts = (0, catchAsync_1.default)((req, res, _next) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.params.userId; // From auth middleware
    const { emergencyContacts } = req.body;
    const decodedToken = req.user;
    const updatedUser = yield user_service_1.UserService.updateEmergencyContactsService(userId, { emergencyContacts }, decodedToken);
    res.status(200).json({
        success: true,
        message: 'Emergency contacts updated successfully',
        data: updatedUser
    });
}));
exports.getEmergencyContacts = (0, catchAsync_1.default)((req, res, _next) => __awaiter(void 0, void 0, void 0, function* () {
    const verifiedToken = req.user;
    const userId = verifiedToken.id;
    const contacts = yield user_service_1.UserService.getEmergencyContactsService(userId, verifiedToken);
    res.status(200).json({
        success: true,
        message: 'Emergency contacts retrieved successfully',
        data: contacts
    });
}));
exports.addEmergencyContact = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.params.userId; // From auth middleware
    const { name, number, type, relationship, isPrimary } = req.body;
    const decodedToken = req.user;
    const contactData = {
        name,
        number,
        type,
        relationship,
        isPrimary
    };
    const updatedUser = yield user_service_1.UserService.addEmergencyContactService(userId, contactData, decodedToken);
    res.status(200).json({
        success: true,
        message: 'Emergency contact added successfully',
        data: updatedUser
    });
}));
exports.removeEmergencyContact = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.params.userId; // From auth middleware
    const { contactIndex } = req.params;
    const decodedToken = req.user;
    const index = parseInt(contactIndex);
    const updatedUser = yield user_service_1.UserService.removeEmergencyContactService(userId, index, decodedToken);
    res.status(200).json({
        success: true,
        message: 'Emergency contact removed successfully',
        data: updatedUser
    });
}));
// Export controller
exports.UserController = {
    getProfile,
    getAllUsers,
    updateUser,
    blockUnblockUser,
    removeEmergencyContact: exports.removeEmergencyContact,
    addEmergencyContact: exports.addEmergencyContact,
    getEmergencyContacts: exports.getEmergencyContacts,
    updateEmergencyContacts: exports.updateEmergencyContacts
};
