import { Schema, Types, model } from "mongoose";

const DriverSchema = new Schema({
  userId: {
    type: Types.ObjectId,
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
        validator: (val: number[]) => val.length === 2,
        message: "Coordinates must be [longitude, latitude]",
      },
    },
  },
  earnings: { type: Number, default: 0 },
  rating: { type: Number, default: 0 },
},
  {
    timestamps: true,
  }
);

DriverSchema.index({ currentLocation: "2dsphere" });

export const DriverModel = model("Driver", DriverSchema);
