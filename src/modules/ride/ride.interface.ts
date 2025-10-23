import { Types } from "mongoose";

interface ILocation {
  address: string;
  // lat: number;
  // lng: number;// [longitude, latitude]
}

interface IStatusHistoryItem {
  status: RideStatus;
  timestamp: Date;
  changedBy: 'rider' | 'driver' | 'system';
}

export enum RideStatus {
  REQUESTED = "requested",
  ACCEPTED = "accepted",
  PICKED_UP = "picked_up",
  IN_TRANSIT = "in_transit",
  COMPLETED = "completed",
  CANCELLED = "cancelled",
  REJECTED = "rejected"
}
export interface IRatingInput {
  rating: number;
  feedback?: string;
}
export interface IRide {
  _id: string;
  riderId: Types.ObjectId;
  driverId?: Types.ObjectId; // Optional until accepted
  pickupLocation: ILocation;
  destination: ILocation;
  rideStatus: RideStatus;
  fare: number;
  distance: number;
  requestedAt: Date;
  acceptedAt?: Date;
  pickedUpAt?: Date;
  completedAt?: Date;
  cancelledAt?: Date;
  cancelledBy?: 'rider' | 'driver' | 'system';
  
  // ADD THESE REJECTION FIELDS
  rejectedAt?: Date;
  rejectedBy?: Types.ObjectId; // Store driver ID who rejected
  rejectionReason?: string;
  
  statusHistory: IStatusHistoryItem[];
  riderRating?: IRatingInput;
  driverRating?: IRatingInput;
  paymentStatus: 'pending' | 'paid' | 'refunded';
}
export interface IRideQuery {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  status?: string;
}