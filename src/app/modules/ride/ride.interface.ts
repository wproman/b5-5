import { Schema } from "mongoose";

interface ILocation {
  address: string;
  coordinates: [number, number]; // [longitude, latitude]
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
}

export interface IRide {
  _id: string;
 rider: Schema.Types.ObjectId;
  driver?: Schema.Types.ObjectId;// Optional until accepted
  pickupLocation: ILocation;
  destination: ILocation;
  status: RideStatus;
  fare: number;
  distance: number; // in kilometers
  requestedAt: Date;
  acceptedAt?: Date;
  pickedUpAt?: Date;
  completedAt?: Date;
  cancelledAt?: Date;
  cancelledBy?: 'rider' | 'driver' | 'system';
  statusHistory: IStatusHistoryItem[];
  riderRating?: number;
  driverRating?: number;
  feedback?: string;
   paymentStatus: 'pending' | 'paid' | 'refunded';
}

