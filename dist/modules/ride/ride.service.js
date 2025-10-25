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
exports.RideService = void 0;
const AppError_1 = __importDefault(require("../../errorHelper/AppError"));
const fareCalculator_1 = require("../../utils/fareCalculator");
const driver_model_1 = require("../driver/driver.model");
const user_interface_1 = require("../users/user.interface");
const user_models_1 = require("../users/user.models");
const ride_interface_1 = require("./ride.interface");
const ride_model_1 = require("./ride.model");
const requestRide = (payload, decodedToken) => __awaiter(void 0, void 0, void 0, function* () {
    const isRiderExist = yield user_models_1.User.findOne({ email: decodedToken.email });
    if (!isRiderExist)
        throw new AppError_1.default("Rider not found", 404);
    if (decodedToken.role !== user_interface_1.UserRole.RIDER)
        throw new AppError_1.default("Only riders can request rides", 403);
    const { pickupLocation, destination, fare, distance } = payload;
    if (!(pickupLocation === null || pickupLocation === void 0 ? void 0 : pickupLocation.address) || !(destination === null || destination === void 0 ? void 0 : destination.address))
        throw new AppError_1.default("Pickup and destination are required", 400);
    if (!fare || !distance)
        throw new AppError_1.default("Fare, distance and duration are required", 400);
    const userId = isRiderExist._id;
    const ongoingRide = yield ride_model_1.Ride.findOne({
        riderId: userId,
        rideStatus: { $nin: [ride_interface_1.RideStatus.COMPLETED, ride_interface_1.RideStatus.CANCELLED] },
    });
    if (ongoingRide)
        throw new AppError_1.default("You already have an ongoing ride", 400);
    const newRide = yield ride_model_1.Ride.create({
        riderId: userId,
        pickupLocation: { address: pickupLocation.address },
        destination: { address: destination.address },
        fare,
        distance,
        rideStatus: ride_interface_1.RideStatus.REQUESTED,
        requestedAt: new Date(),
        paymentStatus: "pending",
    });
    return newRide;
});
const estimateFare = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { pickup, destination } = payload;
    if (!(pickup === null || pickup === void 0 ? void 0 : pickup.address) || !(destination === null || destination === void 0 ? void 0 : destination.address)) {
        throw new AppError_1.default("Pickup and destination addresses are required", 400);
    }
    // Mock distance and duration calculation
    const { distance, duration } = (0, fareCalculator_1.calculateMockDistanceAndDuration)(pickup.address, destination.address);
    // Calculate fare using actual formula
    const fare = (0, fareCalculator_1.calculateFare)(distance, duration);
    return {
        distance,
        duration,
        fare: Math.round(fare),
        breakdown: {
            baseFare: 50,
            distance,
            duration,
            perKmRate: 25,
            perMinRate: 2,
            total: Math.round(fare)
        }
    };
});
const changeRideStatus = (reqId, decodedToken, Ridestatus) => __awaiter(void 0, void 0, void 0, function* () {
    if (decodedToken.role !== user_interface_1.UserRole.DRIVER) {
        throw new AppError_1.default("Only drivers can update ride status", 403);
    }
    // 2. Find the driver user
    const driverUser = yield user_models_1.User.findOne({ email: decodedToken.email });
    if (!driverUser) {
        throw new AppError_1.default("Driver user not found", 404);
    }
    // 3. Ensure driver profile exists
    const driverProfile = yield driver_model_1.DriverModel.findOne({ userId: driverUser._id });
    if (!driverProfile || driverProfile.approvalStatus !== "approved" || !driverProfile.onlineStatus) {
        throw new AppError_1.default("Driver not authorized or not online", 403);
    }
    // 4. Find the ride
    const ride = yield ride_model_1.Ride.findById(reqId);
    if (!ride) {
        throw new AppError_1.default("Ride not found", 404);
    }
    // 5. Ensure the ride belongs to the driver
    if (!ride.driverId || !ride.driverId.equals(driverUser._id)) {
        throw new AppError_1.default("This ride does not belong to you", 403);
    }
    ;
    // 6. Prevent duplicate completion
    if (ride.rideStatus === ride_interface_1.RideStatus.COMPLETED) {
        throw new AppError_1.default("This ride is already completed", 400);
    }
    // 6. Validate next status transition
    const validStatus = [
        ride_interface_1.RideStatus.ACCEPTED,
        ride_interface_1.RideStatus.PICKED_UP,
        ride_interface_1.RideStatus.IN_TRANSIT,
        ride_interface_1.RideStatus.COMPLETED,
        // RideStatus.CANCELLED
    ];
    if (!validStatus.includes(Ridestatus)) {
        throw new AppError_1.default("Invalid ride status update", 400);
    }
    ride.rideStatus = Ridestatus;
    // Optional: update timestamps
    if (Ridestatus === ride_interface_1.RideStatus.PICKED_UP)
        ride.pickedUpAt = new Date();
    if (Ridestatus === ride_interface_1.RideStatus.IN_TRANSIT)
        ride.rideStatus = ride_interface_1.RideStatus.IN_TRANSIT;
    if (Ridestatus === ride_interface_1.RideStatus.COMPLETED) {
        // Ensure fare is set
        if (!ride.fare || ride.fare === 0) {
            throw new AppError_1.default("Fare not calculated for this ride", 400);
        }
        // Update driver earnings atomically
        yield driver_model_1.DriverModel.findOneAndUpdate({ userId: ride.driverId }, {
            $inc: { "driverInfo.earnings": ride.fare },
            $set: { "driverInfo.currentRide": null },
        });
        ride.completedAt = new Date();
        ride.paymentStatus = 'paid'; // ✅ Add this line to mark payment
    }
    // Update status history
    ride.statusHistory.push({
        rideStatus: Ridestatus,
        timestamp: new Date(),
        changedBy: "driver",
    });
    yield ride.save();
    return ride;
});
const cancelRide = (rideId, decodedToken, reason) => __awaiter(void 0, void 0, void 0, function* () {
    const ride = yield ride_model_1.Ride.findById(rideId);
    if (!ride)
        throw new AppError_1.default("Ride not found", 404);
    // Authorization
    if (decodedToken.role === user_interface_1.UserRole.RIDER && !ride.riderId.equals(decodedToken.id)) {
        throw new AppError_1.default('You can only cancel your own rides', 403);
    }
    if (decodedToken.role === user_interface_1.UserRole.DRIVER && (!ride.driverId || !ride.driverId.equals(decodedToken.userId))) {
        throw new AppError_1.default('You can only cancel rides you’ve accepted', 403);
    }
    // Business Rules
    const allowedCancellationStates = {
        [user_interface_1.UserRole.RIDER]: [ride_interface_1.RideStatus.REQUESTED, ride_interface_1.RideStatus.ACCEPTED], // Riders can cancel before pickup
        [user_interface_1.UserRole.DRIVER]: [ride_interface_1.RideStatus.ACCEPTED, ride_interface_1.RideStatus.PICKED_UP, ride_interface_1.RideStatus.IN_TRANSIT] // Drivers can cancel after acceptance
    };
    // Type guard for role validation
    function isCancellationRole(role) {
        return role === user_interface_1.UserRole.RIDER || role === user_interface_1.UserRole.DRIVER;
    }
    if (!isCancellationRole(decodedToken.role)) {
        throw new AppError_1.default('Invalid user role for cancellation', 403);
    }
    if (!allowedCancellationStates[decodedToken.role].includes(ride.rideStatus)) {
        throw new AppError_1.default(`Cannot cancel ride in ${ride.rideStatus} state`, 400);
    }
    // Update Ride
    ride.rideStatus = ride_interface_1.RideStatus.CANCELLED;
    ride.cancelledAt = new Date();
    ride.cancelledBy = decodedToken.role; // 'rider' or 'driver'
    ride.rejectionReason = reason;
    ride.statusHistory.push({
        status: 'cancelled',
        changedBy: decodedToken.role,
        timestamp: new Date()
    });
    yield ride.save();
    // // Penalize frequent cancellations (optional)
    // if (decodedToken.role === 'driver') {
    //   await penalizeDriver(userId);
    // }
    return ride;
});
// In your rideService.ts
const rejectRide = (rideId, decodedToken, reason) => __awaiter(void 0, void 0, void 0, function* () {
    const ride = yield ride_model_1.Ride.findById(rideId);
    if (!ride)
        throw new AppError_1.default("Ride not found", 404);
    if (decodedToken.role !== user_interface_1.UserRole.DRIVER) {
        throw new AppError_1.default('Only drivers can reject ride requests', 403);
    }
    if (ride.rideStatus !== ride_interface_1.RideStatus.REQUESTED) {
        throw new AppError_1.default(`Cannot reject ride in ${ride.rideStatus} state`, 400);
    }
    // Use findByIdAndUpdate to avoid validation issues
    const updatedRide = yield ride_model_1.Ride.findByIdAndUpdate(rideId, {
        $set: {
            rideStatus: ride_interface_1.RideStatus.REJECTED,
            rejectedAt: new Date(),
            rejectedBy: decodedToken.id,
            cancellationReason: reason
        },
        $push: {
            statusHistory: {
                status: 'rejected',
                changedBy: decodedToken.role,
                timestamp: new Date(),
                reason: reason || 'No reason provided'
            }
        }
    }, { new: true, runValidators: false } // ✅ Disable validators
    );
    return updatedRide;
});
const getRideDetails = (rideId, decodedToken) => __awaiter(void 0, void 0, void 0, function* () {
    // Find the ride and populate rider and driver details
    var _a;
    const ride = yield ride_model_1.Ride.findById(rideId)
        .populate('riderId', 'name email phone')
        .populate('driverId', 'name email phone');
    if (!ride) {
        throw new AppError_1.default("Ride not found", 404);
    }
    // Check if the user is authorized to view this ride
    const isRider = decodedToken.role === user_interface_1.UserRole.RIDER && ride.riderId._id.toString() === decodedToken.id;
    const isDriver = decodedToken.role === user_interface_1.UserRole.DRIVER && ((_a = ride.driverId) === null || _a === void 0 ? void 0 : _a._id.toString()) === decodedToken.id;
    const isAdmin = decodedToken.role === user_interface_1.UserRole.ADMIN;
    if (!isRider && !isDriver && !isAdmin) {
        throw new AppError_1.default("Access denied", 403);
    }
    return ride;
});
const getRidesByRiderId = (decodedToken) => __awaiter(void 0, void 0, void 0, function* () {
    const riderId = decodedToken.id;
    const rides = yield ride_model_1.Ride.find({ riderId }).sort({ createdAt: -1 });
    return rides.map(ride => ({
        rideId: ride._id,
        pickupLocation: ride.pickupLocation,
        destination: ride.destination,
        rideStatus: ride.rideStatus,
        fare: ride.fare,
        paymentStatus: ride.paymentStatus,
        requestedAt: ride.requestedAt,
        acceptedAt: ride.acceptedAt,
        pickedUpAt: ride.pickedUpAt,
        completedAt: ride.completedAt,
        statusHistory: ride.statusHistory,
    }));
});
const adminToSeeAllRides = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const { page = 1, limit = 2, sortBy = 'createdAt', sortOrder = 'desc', status, } = query;
    const filter = {};
    if (status)
        filter.status = status;
    const sortOptions = {
        [sortBy]: sortOrder === 'asc' ? 1 : -1,
    };
    const skip = (Number(page) - 1) * Number(limit);
    const rides = yield ride_model_1.Ride.find(filter)
        .populate('riderId driverId')
        .sort(sortOptions)
        .skip(skip)
        .limit(Number(limit));
    const total = yield ride_model_1.Ride.countDocuments(filter);
    return {
        meta: {
            page: Number(page),
            limit: Number(limit),
            total,
        },
        data: rides,
    };
});
const submitRating = (rideId, 
// user: IUser,
decodedToken, ratingInput) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { rating, feedback } = ratingInput;
    // Validate rating
    if (!rating || rating < 1 || rating > 5) {
        throw new AppError_1.default("Rating must be between 1 and 5", 400);
    }
    // Find the ride
    const ride = yield ride_model_1.Ride.findById(rideId);
    if (!ride) {
        throw new AppError_1.default("Ride not found", 404);
    }
    // Ensure ride is completed
    if (ride.rideStatus !== "completed") {
        throw new AppError_1.default("You can only rate a completed ride", 400);
    }
    const isRider = decodedToken.role === "rider" && ride.riderId.toString() === decodedToken.id;
    const isDriver = decodedToken.role === "driver" && ((_a = ride.driverId) === null || _a === void 0 ? void 0 : _a.toString()) === decodedToken.id;
    if (!isRider && !isDriver) {
        throw new AppError_1.default("You are not authorized to rate this ride", 403);
    }
    // Update ride document
    if (isRider) {
        ride.driverRating = { rating, feedback };
    }
    else if (isDriver) {
        ride.riderRating = { rating, feedback };
    }
    yield ride.save();
    return ride;
});
const getMyRideHistory = (decodedToken) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = decodedToken.id;
    const userRole = decodedToken.role;
    // Find rides based on user role
    const query = userRole === user_interface_1.UserRole.RIDER
        ? { riderId: userId }
        : { driverId: userId };
    const rides = yield ride_model_1.Ride.find(query)
        .sort({ createdAt: -1 }) // Latest first
        .select('_id pickupLocation destination rideStatus fare paymentStatus requestedAt acceptedAt pickedUpAt completedAt statusHistory');
    return rides.map(ride => ({
        rideId: ride._id,
        pickupLocation: ride.pickupLocation,
        destination: ride.destination,
        rideStatus: ride.rideStatus,
        fare: ride.fare,
        paymentStatus: ride.paymentStatus,
        requestedAt: ride.requestedAt,
        acceptedAt: ride.acceptedAt,
        pickedUpAt: ride.pickedUpAt,
        completedAt: ride.completedAt,
        statusHistory: ride.statusHistory,
    }));
});
const getMyCurrentRide = (decodedToken) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = decodedToken.id;
    const userRole = decodedToken.role;
    // Find active rides (not completed or cancelled)
    const query = userRole === user_interface_1.UserRole.RIDER
        ? { riderId: userId, rideStatus: { $nin: ['completed', 'cancelled'] } }
        : { driverId: userId, rideStatus: { $nin: ['completed', 'cancelled'] } };
    const currentRide = yield ride_model_1.Ride.findOne(query)
        .sort({ createdAt: -1 }) // Get the latest active ride
        .populate('riderId', 'name phone rating') // Populate rider details
        .populate('driverId', 'name phone rating vehicle') // Populate driver details with vehicle
        .select('_id pickupLocation destination rideStatus fare paymentStatus requestedAt acceptedAt pickedUpAt driverId riderId');
    return currentRide ? Object.assign({ rideId: currentRide._id, pickupLocation: currentRide.pickupLocation, destination: currentRide.destination, rideStatus: currentRide.rideStatus, fare: currentRide.fare, paymentStatus: currentRide.paymentStatus, requestedAt: currentRide.requestedAt, acceptedAt: currentRide.acceptedAt, pickedUpAt: currentRide.pickedUpAt }, (userRole === user_interface_1.UserRole.RIDER ? {
        driverId: currentRide.driverId // This will be populated driver object
    } : {
        riderId: currentRide.riderId // This will be populated rider object
    })) : null;
});
exports.RideService = {
    requestRide,
    changeRideStatus,
    cancelRide,
    getRidesByRiderId,
    submitRating,
    adminToSeeAllRides,
    estimateFare,
    getRideDetails,
    getMyRideHistory,
    getMyCurrentRide,
    rejectRide
};
