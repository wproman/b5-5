import mongoose from "mongoose";

// Driver Schema (extends User)
const DriverSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  licenseNumber: { type: String, required: true },
  vehicleInfo: {
    model: String,
    plate: String,
    color: String
  },
  approvalStatus: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  onlineStatus: { type: Boolean, default: false },
  currentLocation: {
    type: { type: String, default: 'Point' },
    coordinates: { type: [Number], default: [0, 0] }
  },
  rating: { type: Number, default: 0 }
});

export const DriverModel = mongoose.model('Driver', DriverSchema);