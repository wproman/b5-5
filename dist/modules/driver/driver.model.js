"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DriverModel = void 0;
const mongoose_1 = require("mongoose");
const DriverSchema = new mongoose_1.Schema({
    userId: {
        type: mongoose_1.Types.ObjectId,
        ref: "User",
        required: true,
        unique: true, // Prevent multiple driver entries for the same user
    },
    licenseNumber: { type: String, required: true },
    vehicleInfo: {
        model: { type: String, required: true },
        plate: { type: String, required: true },
        color: { type: String },
    },
    approvalStatus: {
        type: String,
        enum: ["pending", "approved", "rejected"],
        default: "pending",
    },
    onlineStatus: { type: Boolean, default: false },
    currentLocation: {
        type: { type: String, enum: ["Point"], default: "Point" },
        coordinates: {
            type: [Number],
            default: [0, 0],
            validate: {
                validator: (val) => val.length === 2,
                message: "Coordinates must be [longitude, latitude]",
            },
        },
    },
    earnings: { type: Number, default: 0 },
    rating: { type: Number, default: 0 },
}, {
    timestamps: true,
});
DriverSchema.index({ currentLocation: "2dsphere" });
exports.DriverModel = (0, mongoose_1.model)("Driver", DriverSchema);
