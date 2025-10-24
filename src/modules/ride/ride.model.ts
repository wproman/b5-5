import { model, Schema } from "mongoose";
import { RideStatus } from "./ride.interface";
// In your ride model file (e.g., ride.model.ts)
const rideSchema = new Schema({
  riderId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  driverId: {
    type: Schema.Types.ObjectId,
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
    enum: Object.values(RideStatus),
    default: RideStatus.REQUESTED
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
  rejectedBy: { type: Schema.Types.ObjectId, ref: 'User' },
  rejectionReason: { type: String },
  
  statusHistory: [{
    status: { type: String, enum: Object.values(RideStatus) },
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
export const Ride = model("Ride", rideSchema);
