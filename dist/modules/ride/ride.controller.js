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
exports.RideController = void 0;
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const ride_service_1 = require("./ride.service");
const requestRide = (0, catchAsync_1.default)((req, res, _next) => __awaiter(void 0, void 0, void 0, function* () {
    const verifiedToken = req.user;
    const payload = req.body;
    const rides = yield ride_service_1.RideService.requestRide(payload, verifiedToken);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: 200,
        message: "Ride requested successfully",
        data: rides,
    });
}));
const estimateFare = (0, catchAsync_1.default)((req, res, _next) => __awaiter(void 0, void 0, void 0, function* () {
    const payload = req.body;
    const fareEstimation = yield ride_service_1.RideService.estimateFare(payload);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: 200,
        message: "Fare estimated successfully",
        data: fareEstimation,
    });
}));
// controllers/rideController.ts
const changeRideStatus = (0, catchAsync_1.default)((req, res, _next) => __awaiter(void 0, void 0, void 0, function* () {
    const verifiedToken = req.user;
    const { status } = req.body;
    const reqId = req.params.id;
    const users = yield ride_service_1.RideService.changeRideStatus(reqId, verifiedToken, status);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: 200,
        message: `Ride status changed to ${status} successfully`,
        data: users,
    });
}));
const cancelRide = (0, catchAsync_1.default)((req, res, _next) => __awaiter(void 0, void 0, void 0, function* () {
    const verifiedToken = req.user;
    const { reason } = req.body || {};
    const rideId = req.params.id;
    // Fix 2: Validate rideId
    const ride = yield ride_service_1.RideService.cancelRide(rideId, verifiedToken, reason);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: 200,
        message: "Ride cancelled successfully",
        data: ride,
    });
}));
// In your rideController.ts
const rejectRide = (0, catchAsync_1.default)((req, res, _next) => __awaiter(void 0, void 0, void 0, function* () {
    const verifiedToken = req.user;
    const { reason } = req.body || {};
    const rideId = req.params.id;
    const ride = yield ride_service_1.RideService.rejectRide(rideId, verifiedToken, reason);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: 200,
        message: "Ride request rejected successfully",
        data: ride,
    });
}));
const getRideDetails = (0, catchAsync_1.default)((req, res, _next) => __awaiter(void 0, void 0, void 0, function* () {
    const { rideId } = req.params;
    const verifiedToken = req.user;
    const ride = yield ride_service_1.RideService.getRideDetails(rideId, verifiedToken);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: 200,
        message: "Ride details fetched successfully",
        data: ride,
    });
}));
const getRidesByRiderId = (0, catchAsync_1.default)((req, res, _next) => __awaiter(void 0, void 0, void 0, function* () {
    const verifiedToken = req.user;
    const ride = yield ride_service_1.RideService.getRidesByRiderId(verifiedToken);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: 200,
        message: "Ride history fetched successfully",
        data: ride,
    });
}));
const adminToSeeAllRides = (0, catchAsync_1.default)((req, res, _next) => __awaiter(void 0, void 0, void 0, function* () {
    const query = req.query;
    const result = yield ride_service_1.RideService.adminToSeeAllRides(query);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: 200,
        message: "All rides fetched successfully",
        meta: result.meta,
        data: result.data,
    });
}));
const rateRide = (0, catchAsync_1.default)((req, res, _next) => __awaiter(void 0, void 0, void 0, function* () {
    const rideId = req.params.id;
    const validateRequest = req.user;
    const { rating, feedback } = req.body;
    const result = yield ride_service_1.RideService.submitRating(rideId, validateRequest, { rating, feedback });
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: 200,
        message: "Rating submitted successfully",
        data: result,
    });
}));
const getMyRideHistory = (0, catchAsync_1.default)((req, res, _next) => __awaiter(void 0, void 0, void 0, function* () {
    const verifiedToken = req.user;
    const rides = yield ride_service_1.RideService.getMyRideHistory(verifiedToken);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: 200,
        message: "Ride history fetched successfully",
        data: rides,
    });
}));
const getMyCurrentRide = (0, catchAsync_1.default)((req, res, _next) => __awaiter(void 0, void 0, void 0, function* () {
    const verifiedToken = req.user;
    const currentRide = yield ride_service_1.RideService.getMyCurrentRide(verifiedToken);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: 200,
        message: "Current ride fetched successfully",
        data: currentRide,
    });
}));
exports.RideController = {
    requestRide,
    changeRideStatus,
    cancelRide,
    getRidesByRiderId,
    rateRide,
    adminToSeeAllRides,
    estimateFare,
    getRideDetails,
    getMyRideHistory,
    getMyCurrentRide,
    rejectRide
};
