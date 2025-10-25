"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Ride = void 0;
const mongoose_1 = require("mongoose");
const ride_interface_1 = require("./ride.interface");
// In your ride model file (e.g., ride.model.ts)
const rideSchema = new mongoose_1.Schema({
    riderId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    driverId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User'
    },
    pickupLocation: {
        address: { type: String },
        coordinates: { type: [Number] } // [longitude, latitude]
    },
    destination: {
        address: { type: String },
        coordinates: { type: [Number] }
    },
    rideStatus: {
        type: String,
        enum: Object.values(ride_interface_1.RideStatus),
        default: ride_interface_1.RideStatus.REQUESTED
    },
    fare: { type: Number },
    distance: { type: Number },
    requestedAt: { type: Date, default: Date.now },
    acceptedAt: { type: Date },
    pickedUpAt: { type: Date },
    completedAt: { type: Date },
    cancelledAt: { type: Date },
    cancelledBy: { type: String, enum: ['rider', 'driver', 'system'] },
    // ADD THESE REJECTION FIELDS
    rejectedAt: { type: Date },
    rejectedBy: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User' },
    rejectionReason: { type: String },
    statusHistory: [{
            status: { type: String, enum: Object.values(ride_interface_1.RideStatus) },
            timestamp: { type: Date, default: Date.now },
            changedBy: { type: String, enum: ['rider', 'driver', 'system'] },
            reason: { type: String }
        }],
    riderRating: {
        rating: { type: Number, min: 1, max: 5 },
        feedback: { type: String }
    },
    driverRating: {
        rating: { type: Number, min: 1, max: 5 },
        feedback: { type: String }
    },
    paymentStatus: {
        type: String,
        enum: ['pending', 'paid', 'refunded'],
        default: 'pending'
    }
}, {
    timestamps: true
});
exports.Ride = (0, mongoose_1.model)("Ride", rideSchema);
