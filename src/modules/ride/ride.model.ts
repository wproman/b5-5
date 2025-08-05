import { model, Schema } from "mongoose";
import { RideStatus } from "./ride.interface";
const rideSchema = new Schema(
  {
    riderId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  driverId: { type: Schema.Types.ObjectId, ref: "User" },

    pickupLocation: {
      address: String,
      coordinates: {
        type: [Number], // [lng, lat]
        required: true,
      },
    },
    destination: {
      address: String,
      coordinates: {
        type: [Number],
        required: true,
      },
    },

    rideStatus: {
      type: String,
      enum: Object.values(RideStatus),
      default: RideStatus.REQUESTED,
    },

    requestedAt: Date,
    acceptedAt: Date,
    pickedUpAt: Date,
    completedAt: Date,
    cancelledAt: Date,
    cancelledBy: {
      type: String,
      enum: ["rider", "driver", "system"],
    },
    cancellationReason: String,

  

    statusHistory: [
      {
        status: {
          type: String,
          enum: ["requested", "accepted", "picked_up", "in_transit", "completed", "cancelled"],
        },
        timestamp: Date,
        changedBy: {
          type: String,
          enum: ["rider", "driver", "system"],
        },
      },
    ],
    fare: { type: Number, default: 0 },
  paymentStatus: {
      type: String,
      enum: ["pending", "paid", "refunded"],
      default: "pending",
    },
    driverRating: {
  rating: { type: Number, min: 1, max: 5 },
  feedback: { type: String },
},
riderRating: {
  rating: { type: Number, min: 1, max: 5 },
  feedback: { type: String },
},
  },
  {
    timestamps: true, // Mongoose auto-created: createdAt & updatedAt
  }
);

export const Ride = model("Ride", rideSchema);
