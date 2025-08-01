import mongoose from "mongoose";

// Ride Schema
const RideSchema = new mongoose.Schema({
  riderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  driverId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  pickupLocation: {
    address: String,
    coordinates: { type: [Number], required: true }
  },
  destinationLocation: {
    address: String,
    coordinates: { type: [Number], required: true }
  },
  status: {
    type: String,
    enum: ['requested', 'accepted', 'picked_up', 'in_transit', 'completed', 'cancelled'],
    default: 'requested'
  },
  fare: { type: Number },
  requestedAt: { type: Date, default: Date.now },
  acceptedAt: Date,
  pickedUpAt: Date,
  completedAt: Date,
  cancelledAt: Date,
  cancellationReason: String,
  paymentStatus: { type: String, enum: ['pending', 'paid', 'refunded'], default: 'pending' }
});

export const RideModel = mongoose.model('Ride', RideSchema); 