import { model, Schema } from "mongoose";
import { IRide, RideStatus } from "./ride.interface";

export const rideSchema = new Schema<IRide>({
  rider: { type: Schema.Types.ObjectId, ref: "User", required: true },
  driver: { type: Schema.Types.ObjectId, ref: "User" },
  pickupLocation: { type: String, required: true },
  destination: { type: String, required: true },
  status: { type: String, enum: Object.values(RideStatus), default: RideStatus.REQUESTED },
  fare: { type: Number, default: 0 },
 
}, { timestamps: true });

export const Ride = model<IRide>("Ride", rideSchema);