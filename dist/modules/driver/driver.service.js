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
exports.DriverService = void 0;
const mongoose_1 = require("mongoose");
const AppError_1 = __importDefault(require("../../errorHelper/AppError"));
const ride_interface_1 = require("../ride/ride.interface");
const ride_model_1 = require("../ride/ride.model");
const user_interface_1 = require("../users/user.interface");
const user_models_1 = require("../users/user.models");
const driver_helper_1 = require("./driver.helper");
const driver_model_1 = require("./driver.model");
const getDriverStatus = (payload, decodedToken) => __awaiter(void 0, void 0, void 0, function* () {
    // 1. Find driver
    const isDriverExist = yield driver_model_1.DriverModel.findOne({ userId: decodedToken.id });
    if (!isDriverExist) {
        throw new AppError_1.default("Driver not found", 404);
    }
    // Return only the required status fields
    return {
        onlineStatus: isDriverExist.onlineStatus,
        approvalStatus: isDriverExist.approvalStatus,
    };
});
// services/rideService.ts
const getIncomingRides = (decodedToken) => __awaiter(void 0, void 0, void 0, function* () {
    // 1. Ensure role is DRIVER
    if (decodedToken.role !== user_interface_1.UserRole.DRIVER) {
        throw new AppError_1.default("Only drivers can view incoming rides", 403);
    }
    // 2. Find the driver user
    const driverUser = yield user_models_1.User.findOne({ email: decodedToken.email });
    if (!driverUser) {
        throw new AppError_1.default("Driver user not found", 404);
    }
    // 3. Get the driver's additional info from DriverModel
    const driverProfile = yield driver_model_1.DriverModel.findOne({ userId: driverUser._id });
    if (!driverProfile) {
        throw new AppError_1.default("Driver profile not found", 404);
    }
    // 4. Check if driver is approved and online
    if (driverProfile.approvalStatus !== "approved" || !driverProfile.onlineStatus) {
        throw new AppError_1.default("Driver not approved or not online", 403);
    }
    // 5. Get incoming ride requests (rides that are requested and not assigned to any driver)
    const incomingRides = yield ride_model_1.Ride.find({
        rideStatus: "requested",
        driverId: { $exists: false }, // No driver assigned yet
        // Optional: Add location-based filtering if you have coordinates
        // You can add geospatial queries here based on driver's currentLocation
    })
        .populate('riderId', 'name phone rating') // Populate rider info
        .select('pickupLocation destination fare distance requestedAt estimatedDuration')
        .sort({ requestedAt: -1 }); // Most recent first
    // 6. Format the response
    const formattedRides = incomingRides.map(ride => ({
        _id: ride._id,
        riderId: {
            _id: ride.riderId._id,
            // name: ride.riderId.name,
            // phone: ride.riderId.phone,
            // rating: ride.riderId.rating || 4.5 // Default rating if not available
        },
        pickupLocation: ride.pickupLocation,
        destination: ride.destination,
        fare: ride.fare,
        // distance: ride.distance,
        requestedAt: ride.requestedAt,
        // estimatedDuration: ride.estimatedDuration || 15 // Default duration if not available
    }));
    return formattedRides;
});
const acceptRide = (reqId, decodedToken) => __awaiter(void 0, void 0, void 0, function* () {
    // 1. Ensure role is DRIVER
    if (decodedToken.role !== user_interface_1.UserRole.DRIVER) {
        throw new AppError_1.default("Only drivers can accept rides", 403);
    }
    // 2. Find the driver user
    const driverUser = yield user_models_1.User.findOne({ email: decodedToken.email });
    if (!driverUser) {
        throw new AppError_1.default("Driver user not found", 404);
    }
    // 3. Get the driver's additional info from DriverModel
    const driverProfile = yield driver_model_1.DriverModel.findOne({ userId: driverUser._id });
    if (!driverProfile) {
        throw new AppError_1.default("Driver profile not found", 404);
    }
    // 4. Check if driver is approved and online
    if (driverProfile.approvalStatus !== "approved" || !driverProfile.onlineStatus) {
        throw new AppError_1.default("Driver not approved or not online.", 403);
    }
    // 5. Check if the driver has any active ride
    const activeRide = yield ride_model_1.Ride.findOne({
        driverId: driverUser._id,
        status: { $in: ["accepted", "picked_up", "in_transit"] },
    });
    if (activeRide) {
        throw new AppError_1.default("You already have an active ride.", 400);
    }
    // 6. Find the ride by ID
    const ride = yield ride_model_1.Ride.findById(reqId);
    if (!ride) {
        throw new AppError_1.default("Ride not found", 404);
    }
    // 7. Make sure the ride is still available for acceptance
    if (ride.rideStatus !== "requested") {
        throw new AppError_1.default("This ride is not available for acceptance.", 400);
    }
    // 8. Accept the ride
    ride.driverId = driverUser._id;
    ride.rideStatus = ride_interface_1.RideStatus.ACCEPTED;
    ride.acceptedAt = new Date(); // ✅ Now works because acceptedAt is directly in schema
    ride.statusHistory.push({
        status: "accepted",
        timestamp: new Date(),
        changedBy: "driver",
    });
    yield ride.save();
    return ride;
});
// In your rideService.ts
// const rejectRide = async (
//   rideId: string,
//   decodedToken: JwtPayload,
//   reason?: string
// ) => {
//   const ride = await Ride.findById(rideId);
//   if (!ride) throw new AppError("Ride not found", 404);
//   // Authorization - Only drivers can reject rides
//   if (decodedToken.role !== UserRole.DRIVER) {
//     throw new AppError('Only drivers can reject ride requests', 403);
//   }
//   // Business Rules - Can only reject rides that are requested (not accepted yet)
//   if (ride.rideStatus !== RideStatus.REQUESTED) {
//     throw new AppError(`Cannot reject ride in ${ride.rideStatus} state`, 400);
//   }
//   // Update Ride
//   ride.rideStatus = RideStatus.REJECTED;
//   ride.rejectedAt = new Date();
//   ride.rejectedBy = decodedToken.id; // Store driver ID who rejected
//   ride.rejectionReason = reason;
//   ride.statusHistory.push({
//     status: 'rejected',
//     changedBy: decodedToken.role,
//     timestamp: new Date(),
//     reason: reason
//   });
//   await ride.save();
//   return ride;
// };
const changeOnlineStatus = (payload, decodedToken) => __awaiter(void 0, void 0, void 0, function* () {
    // 1. Find driver
    const isDriverExist = yield driver_model_1.DriverModel.findOne({ userId: decodedToken.id });
    if (!isDriverExist) {
        throw new AppError_1.default("Driver not found", 404);
    }
    // 2. Check if driver is approved
    if (isDriverExist.approvalStatus !== 'approved') {
        throw new AppError_1.default('Your driver account is not approved', 403);
    }
    // 3. Update status
    if (typeof payload.onlineStatus === 'boolean') {
        isDriverExist.onlineStatus = payload.onlineStatus;
    }
    // 4. If going offline, check for active rides
    if (payload.onlineStatus === false) {
        const activeRide = yield (0, driver_helper_1.checkActiveRides)(isDriverExist._id.toString());
        if (activeRide) {
            throw new AppError_1.default('Cannot go offline while having an active ride', 400);
        }
    }
    yield isDriverExist.save();
    return isDriverExist;
});
const getEarningsHistory = (payload, decodedToken) => __awaiter(void 0, void 0, void 0, function* () {
    const driverId = decodedToken.id;
    const rides = yield ride_model_1.Ride.find({
        driverId: driverId,
        rideStatus: 'completed',
    }).select('fare createdAt');
    // const rides = await Ride.find({  driverId: driverId })
    return rides.map(ride => ({
        amount: ride.fare,
        date: ride.createdAt,
    }));
});
const updateDriverStatus = (decodedToken, driverId, approvalStatus) => __awaiter(void 0, void 0, void 0, function* () {
    // Validate driver ID format
    if (!mongoose_1.Types.ObjectId.isValid(driverId)) {
        throw new AppError_1.default('Invalid driver ID', 400);
    }
    // Check driver existence
    const driver = yield driver_model_1.DriverModel.findOne({
        userId: new mongoose_1.Types.ObjectId(driverId),
    });
    if (!driver) {
        throw new AppError_1.default('Driver not found', 404);
    }
    // Authorization - only admin can change status
    if (decodedToken.role !== 'admin') {
        throw new AppError_1.default('Unauthorized to perform this action', 403);
    }
    // Update status
    driver.approvalStatus = approvalStatus;
    driver.updatedAt = new Date();
    return yield driver.save();
});
exports.DriverService = {
    changeOnlineStatus,
    getEarningsHistory,
    updateDriverStatus,
    getDriverStatus,
    getIncomingRides,
    acceptRide,
    // rejectRide
};
