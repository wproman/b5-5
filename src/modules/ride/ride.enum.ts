// export enum RideStatus {
//   REQUESTED = "requested",
//   ACCEPTED = "accepted",
//   PICKED_UP = "picked_up",
//   IN_TRANSIT = "in_transit",
//   COMPLETED = "completed",
//   CANCELLED = "cancelled",
// }

// export enum PaymentStatus {
//   PENDING = "pending",
//   PAID = "paid",
//   REFUNDED = "refunded",
// }

// export enum CancelledBy {
//   RIDER = "rider",
//   DRIVER = "driver",
//   SYSTEM = "system",
// }

// export enum StatusChangedBy {
//   RIDER = "rider",
//   DRIVER = "driver",
//   SYSTEM = "system",
// }
// import { Types } from "mongoose";
// import { CancelledBy, PaymentStatus, RideStatus, StatusChangedBy } from "./ride.enum";
//  // adjust path as needed

// export interface IRide {
//   _id?: Types.ObjectId;

//   riderId: Types.ObjectId;
//   driverId?: Types.ObjectId;

//   pickupLocation: {
//     address: string;
//     coordinates: [number, number];
//   };

//   destination: {
//     address: string;
//     coordinates: [number, number];
//   };

//   status: RideStatus;

//   fare: number;
//   distance: number;

//   requestedAt?: Date;
//   acceptedAt?: Date;
//   pickedUpAt?: Date;
//   completedAt?: Date;
//   cancelledAt?: Date;
//   cancelledBy?: CancelledBy;
//   cancellationReason?: string;

//   paymentStatus: PaymentStatus;

//   statusHistory: {
//     status: RideStatus;
//     timestamp?: Date;
//     changedBy: StatusChangedBy;
//   }[];

//   riderRating?: number;
//   driverRating?: number;
//   feedback?: string;
// }
