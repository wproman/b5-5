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
exports.UserService = exports.removeEmergencyContactService = exports.addEmergencyContactService = exports.getEmergencyContactsService = exports.updateEmergencyContactsService = void 0;
const AppError_1 = __importDefault(require("../../errorHelper/AppError"));
const driver_model_1 = require("../driver/driver.model");
const user_interface_1 = require("./user.interface");
const user_models_1 = require("./user.models");
const updateUserService = (userId, payload, decodedToken) => __awaiter(void 0, void 0, void 0, function* () {
    // Check if user exists
    const isUserExist = yield user_models_1.User.findById(userId);
    if (!isUserExist) {
        throw new AppError_1.default("User not found", 404);
    }
    // Authorization: User can only update their own profile, admin can update any
    if (decodedToken.id !== userId && decodedToken.role !== user_interface_1.UserRole.ADMIN) {
        throw new AppError_1.default("You are not authorized to update this profile", 403);
    }
    // Regular users can only update specific fields
    if (decodedToken.role !== user_interface_1.UserRole.ADMIN) {
        const allowedFields = ['name', 'phone', 'address', 'picture'];
        const forbiddenFields = Object.keys(payload).filter(field => !allowedFields.includes(field));
        if (forbiddenFields.length > 0) {
            throw new AppError_1.default(`You are not authorized to update: ${forbiddenFields.join(', ')}`, 403);
        }
    }
    // Handle password separately (should use changePassword endpoint)
    if (payload.password) {
        throw new AppError_1.default("Please use the change password endpoint to update password", 400);
    }
    // Update user
    const updatedUser = yield user_models_1.User.findByIdAndUpdate(userId, payload, {
        new: true,
        runValidators: true,
    }).select('-password'); // Exclude password from response
    return updatedUser;
});
const getAllUsersService = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const searchTerm = query.searchTerm || "";
    delete query.searchTerm;
    const toSeachableFields = ["name", "email", "phone"];
    const searchConditions = toSeachableFields.map((field) => ({
        [field]: { $regex: searchTerm, $options: "i" },
    }));
    const users = yield user_models_1.User.aggregate([
        // Match users based on search
        {
            $match: Object.assign({ $or: searchConditions }, query)
        },
        // Lookup driver data
        {
            $lookup: {
                from: "drivers", // MongoDB collection name (usually pluralized)
                localField: "_id",
                foreignField: "userId",
                as: "driver"
            }
        },
        // Convert driver array to object (since it's one-to-one)
        {
            $addFields: {
                driver: { $arrayElemAt: ["$driver", 0] }
            }
        }
    ]);
    return users;
});
const toggleUserBlockStatus = (userId, admin, shouldBlock) => __awaiter(void 0, void 0, void 0, function* () {
    // Verify admin privileges
    if (admin.role !== user_interface_1.UserRole.ADMIN) {
        throw new AppError_1.default('Unauthorized: Admin access required', 403);
    }
    // Prevent self-blocking
    if (admin.userId === userId) {
        throw new AppError_1.default('Admins cannot block themselves', 400);
    }
    const user = yield user_models_1.User.findById(userId);
    if (!user) {
        throw new AppError_1.default('User not found', 404);
    }
    // Prevent blocking other admins
    if (user.role === user_interface_1.UserRole.ADMIN) {
        throw new AppError_1.default('Cannot block other admin users', 403);
    }
    // Update block status
    user.isBlocked = shouldBlock;
    yield user.save();
    // If blocking a driver, set offline
    if (shouldBlock && user.role === user_interface_1.UserRole.DRIVER) {
        yield driver_model_1.DriverModel.findOneAndUpdate({ userId }, { onlineStatus: false }, { new: true });
    }
    return user;
});
const getProfileService = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_models_1.User.findById(userId);
    if (!user) {
        throw new AppError_1.default("User not found", 404);
    }
    return user;
});
// Emergency Contact Services
const updateEmergencyContactsService = (userId, payload, decodedToken) => __awaiter(void 0, void 0, void 0, function* () {
    // Check if user exists
    const isUserExist = yield user_models_1.User.findById(userId);
    if (!isUserExist) {
        throw new AppError_1.default("User not found", 404);
    }
    // Authorization: User can only update their own emergency contacts, admin can update any
    if (decodedToken.id !== userId && decodedToken.role !== 'admin') {
        throw new AppError_1.default("You are not authorized to update these emergency contacts", 403);
    }
    // Update user's emergency contacts
    const updatedUser = yield user_models_1.User.findByIdAndUpdate(userId, {
        $set: {
            emergencyContacts: payload.emergencyContacts,
            updatedAt: new Date()
        }
    }, { new: true, runValidators: true }).select('-password'); // Exclude password from response
    if (!updatedUser) {
        throw new AppError_1.default("Failed to update emergency contacts", 500);
    }
    return updatedUser;
});
exports.updateEmergencyContactsService = updateEmergencyContactsService;
const getEmergencyContactsService = (userId, decodedToken) => __awaiter(void 0, void 0, void 0, function* () {
    // Check if user exists
    const isUserExist = yield user_models_1.User.findById(userId);
    if (!isUserExist) {
        throw new AppError_1.default("User not found", 404);
    }
    // Authorization: User can only view their own emergency contacts, admin can view any
    if (decodedToken.id !== userId && decodedToken.role !== 'admin') {
        throw new AppError_1.default("You are not authorized to view these emergency contacts", 403);
    }
    const user = yield user_models_1.User.findById(userId).select('emergencyContacts');
    return (user === null || user === void 0 ? void 0 : user.emergencyContacts) || [];
});
exports.getEmergencyContactsService = getEmergencyContactsService;
const addEmergencyContactService = (userId, payload, decodedToken) => __awaiter(void 0, void 0, void 0, function* () {
    // Check if user exists
    const isUserExist = yield user_models_1.User.findById(userId);
    if (!isUserExist) {
        throw new AppError_1.default("User not found", 404);
    }
    // Authorization: User can only add to their own emergency contacts, admin can add to any
    if (decodedToken.id !== userId && decodedToken.role !== 'admin') {
        throw new AppError_1.default("You are not authorized to add emergency contacts", 403);
    }
    // Check if user already has maximum number of contacts
    const currentContacts = isUserExist.emergencyContacts || [];
    if (currentContacts.length >= 10) {
        throw new AppError_1.default("Cannot have more than 10 emergency contacts", 400);
    }
    // Check for duplicate phone number
    const duplicateContact = currentContacts.find(contact => contact.number === payload.number);
    if (duplicateContact) {
        throw new AppError_1.default("Emergency contact with this phone number already exists", 400);
    }
    const updatedUser = yield user_models_1.User.findByIdAndUpdate(userId, {
        $push: { emergencyContacts: payload },
        $set: { updatedAt: new Date() }
    }, { new: true, runValidators: true }).select('-password');
    if (!updatedUser) {
        throw new AppError_1.default("Failed to add emergency contact", 500);
    }
    return updatedUser;
});
exports.addEmergencyContactService = addEmergencyContactService;
const removeEmergencyContactService = (userId, contactIndex, decodedToken) => __awaiter(void 0, void 0, void 0, function* () {
    // Check if user exists
    const user = yield user_models_1.User.findById(userId);
    if (!user) {
        throw new AppError_1.default("User not found", 404);
    }
    // Authorization: User can only remove their own emergency contacts, admin can remove from any
    if (decodedToken.id !== userId && decodedToken.role !== 'admin') {
        throw new AppError_1.default("You are not authorized to remove emergency contacts", 403);
    }
    // Check if contact index is valid
    if (!user.emergencyContacts || contactIndex >= user.emergencyContacts.length) {
        throw new AppError_1.default("Emergency contact not found", 404);
    }
    // Remove the contact at specified index
    user.emergencyContacts.splice(contactIndex, 1);
    const updatedUser = yield user.save();
    return updatedUser;
});
exports.removeEmergencyContactService = removeEmergencyContactService;
exports.UserService = {
    getProfileService,
    getAllUsersService,
    updateUserService,
    toggleUserBlockStatus,
    updateEmergencyContactsService: exports.updateEmergencyContactsService,
    getEmergencyContactsService: exports.getEmergencyContactsService,
    addEmergencyContactService: exports.addEmergencyContactService,
    removeEmergencyContactService: exports.removeEmergencyContactService
};
