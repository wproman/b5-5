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
exports.DriverController = exports.getDriverStatus = void 0;
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const driver_service_1 = require("./driver.service");
// Add this to your driverController.ts
exports.getDriverStatus = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const verifiedToken = req.user;
    const payload = req.body;
    const status = yield driver_service_1.DriverService.getDriverStatus(payload, verifiedToken);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: 200,
        message: "Driver status fetched successfully",
        data: status
    });
}));
// controllers/rideController.ts
const getIncomingRides = (0, catchAsync_1.default)((req, res, _next) => __awaiter(void 0, void 0, void 0, function* () {
    const verifiedToken = req.user;
    const result = yield driver_service_1.DriverService.getIncomingRides(verifiedToken);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: 200,
        message: "Incoming rides fetched successfully",
        data: result,
    });
}));
const acceptRide = (0, catchAsync_1.default)((req, res, _next) => __awaiter(void 0, void 0, void 0, function* () {
    const verifiedToken = req.user;
    const reqId = req.params.id;
    const result = yield driver_service_1.DriverService.acceptRide(reqId, verifiedToken);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: 200,
        message: "Diver accept request successfully",
        data: result,
    });
}));
const changeOnlineStatus = (0, catchAsync_1.default)((req, res, _next) => __awaiter(void 0, void 0, void 0, function* () {
    const verifiedToken = req.user;
    const payload = req.body;
    const availability = yield driver_service_1.DriverService.changeOnlineStatus(payload, verifiedToken);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: 200,
        message: "Online status changed successfully",
        data: availability,
    });
}));
const getEarningsHistory = (0, catchAsync_1.default)((req, res, _next) => __awaiter(void 0, void 0, void 0, function* () {
    const verifiedToken = req.user;
    const payload = req.body;
    const earnings = yield driver_service_1.DriverService.getEarningsHistory(payload, verifiedToken);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: 200,
        message: "Earnings history fetched successfully",
        data: earnings,
    });
}));
const approveOrSuspendDriver = (0, catchAsync_1.default)((req, res, _next) => __awaiter(void 0, void 0, void 0, function* () {
    const driverId = req.params.id;
    const verifiedToken = req.user;
    const { approvalStatus } = req.body;
    if (!['approved', 'pending',].includes(approvalStatus)) {
        return (0, sendResponse_1.default)(res, {
            success: false,
            statusCode: 400,
            message: "Invalid status. Must be 'approved' or 'suspended'",
            data: null,
        });
    }
    const updatedDriver = yield driver_service_1.DriverService.updateDriverStatus(verifiedToken, driverId, approvalStatus);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: 200,
        message: `Driver status updated to ${approvalStatus}`,
        data: updatedDriver,
    });
}));
exports.DriverController = {
    changeOnlineStatus,
    getEarningsHistory,
    approveOrSuspendDriver,
    getDriverStatus: exports.getDriverStatus,
    getIncomingRides,
    acceptRide,
    //  rejectRide
};
