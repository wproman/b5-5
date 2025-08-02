import { JwtPayload } from "jsonwebtoken";
import AppError from "../../errorHelper/AppError";
import { DriverModel } from "../driver/driver.model";
import { UserRole } from "../users/user.interface";
import { User } from "../users/user.models";
import { IRide, RideStatus } from "./ride.interface";
import { Ride } from "./ride.model";



const requestRide  = async (
  
  payload: Partial<IRide>,
  decodedToken: JwtPayload
) => {
 
   const isRiderExist = await User.findOne({ email: decodedToken.email });

  if (!isRiderExist) {
    throw new AppError("Rider not found", 404);
  }

  if (
    
    decodedToken.role !== UserRole.RIDER
  ) {
    throw new AppError("Only riders can request rides", 403);
  }

 const { pickupLocation, destination } = payload;

    if (!pickupLocation || !destination) {
      
      throw new AppError("Pickup and destination are required", 400);
    }
 
    const userId = isRiderExist._id;
 
    // Optional: check if rider has an ongoing ride
    const ongoingRide = await Ride.findOne({ rider: userId, status: { $nin: ["completed", "cancelled"] } });
    if (ongoingRide) {
      
        throw new AppError("ou already have an ongoing ride", 400);
    }

   const newRide = await Ride.create({
  riderId: userId,
  pickupLocation,
  destination,
  status: "requested",
  requestedAt: new Date(),
});

    return newRide;
};



const acceptRide = async (
  reqId: string,
  decodedToken: JwtPayload,

) => {
  // 1. Ensure role is DRIVER
  if (decodedToken.role !== UserRole.DRIVER) {
    throw new AppError("Only drivers can accept rides", 403);
  }

 
  // 2. Find the driver user
  const driverUser = await User.findOne({ email: decodedToken.email });
  if (!driverUser) {
    throw new AppError("Driver user not found", 404);
  }

  // 3. Get the driver's additional info from DriverModel
  const driverProfile = await DriverModel.findOne({ userId: driverUser._id });
  if (!driverProfile) {
    throw new AppError("Driver profile not found", 404);
  }

  // 4. Check if driver is approved and online
  if (driverProfile.approvalStatus !== "approved" || !driverProfile.onlineStatus) {
    throw new AppError("Driver not approved or not online.", 403);
  }

  // 5. Check if the driver has any active ride
  const activeRide = await Ride.findOne({
    driverId: driverUser._id,
    status: { $in: ["accepted", "picked_up", "in_transit"] },
  });
  if (activeRide) {
    throw new AppError("You already have an active ride.", 400);
  }

  // 6. Find the ride by ID
  const ride = await Ride.findById(reqId);
  if (!ride) {
    throw new AppError("Ride not found", 404);
  }
 

  // 7. Make sure the ride is still available for acceptance
  if (ride.rideStatus !== "requested") {
    throw new AppError("This ride is not available for acceptance.", 400);
  }

  // 8. Accept the ride
ride.driverId = driverUser._id;
ride.rideStatus = RideStatus.ACCEPTED;
ride.acceptedAt = new Date(); // ✅ Now works because acceptedAt is directly in schema

ride.statusHistory.push({
  status: "accepted",
  timestamp: new Date(),
  changedBy: "driver",
});

  await ride.save();

  return ride;
};

const changeRideStatus = async (
  reqId: string,
  decodedToken: JwtPayload,
  Ridestatus: RideStatus
) => {
   
    if (decodedToken.role !== UserRole.DRIVER) {
    throw new AppError("Only drivers can update ride status", 403);
  }


  // 2. Find the driver user
  const driverUser = await User.findOne({ email: decodedToken.email });
  if (!driverUser) {
    throw new AppError("Driver user not found", 404);
  }
  
   // 3. Ensure driver profile exists
  const driverProfile = await DriverModel.findOne({ userId: driverUser._id });
  if (!driverProfile || driverProfile.approvalStatus !== "approved" || !driverProfile.onlineStatus) {
    throw new AppError("Driver not authorized or not online", 403);
  }
  
    // 4. Find the ride
  const ride = await Ride.findById(reqId);
  if (!ride) {
    throw new AppError("Ride not found", 404);
  }

  // 5. Ensure the ride belongs to the driver
  if (!ride.driverId || !ride.driverId.equals(driverUser._id)) {
    throw new AppError("This ride does not belong to you", 403);
};

  // 6. Validate next status transition
  const validStatus = [
    RideStatus.ACCEPTED,
    RideStatus.PICKED_UP,
    RideStatus.IN_TRANSIT,
    RideStatus.COMPLETED,
    // RideStatus.CANCELLED
  ];

  if (!validStatus.includes(Ridestatus)) {
    throw new AppError("Invalid ride status update", 400);
  }

 ride.rideStatus = Ridestatus;

  // Optional: update timestamps
  if (Ridestatus === RideStatus.PICKED_UP) ride.pickedUpAt = new Date();
  if (Ridestatus === RideStatus.IN_TRANSIT) ride.rideStatus = RideStatus.IN_TRANSIT;
  if (Ridestatus === RideStatus.COMPLETED) ride.completedAt = new Date();
  // if (Ridestatus === RideStatus.CANCELLED) {
  //   ride.cancelledAt = new Date();
  //   ride.cancelledBy = "driver"; // or "system" based on your logic
  // }

  // Update status history
  ride.statusHistory.push({
    rideStatus: Ridestatus,
    timestamp: new Date(),
    changedBy: "driver",
  });

  await ride.save();

}


const cancelRide = async (
  rideId: string,
  decodedToken: JwtPayload,
 
  reason?: string
) => {
   
   const ride = await Ride.findById(rideId);
  if (!ride)  throw new AppError("Ride not found", 404);

  // Authorization
  if (decodedToken.role === UserRole.RIDER && !ride.riderId.equals(decodedToken.id)) {
    throw new AppError ('You can only cancel your own rides', 403);
  }
  if (decodedToken.role === UserRole.DRIVER && (!ride.driverId || !ride.driverId.equals(decodedToken.userId))) {
    throw new AppError ('You can only cancel rides you’ve accepted', 403);
  }

  // Business Rules
  const allowedCancellationStates: Record<UserRole.RIDER | UserRole.DRIVER, RideStatus[]> = {
    [UserRole.RIDER]: [RideStatus.REQUESTED, RideStatus.ACCEPTED],  // Riders can cancel before pickup
    [UserRole.DRIVER]: [RideStatus.ACCEPTED, RideStatus.PICKED_UP, RideStatus.IN_TRANSIT]  // Drivers can cancel after acceptance
  };

 // Type guard for role validation
function isCancellationRole(role: string): role is UserRole.RIDER | UserRole.DRIVER {
  return role === UserRole.RIDER || role === UserRole.DRIVER;
}

if (!isCancellationRole(decodedToken.role)) {
  throw new AppError('Invalid user role for cancellation', 403);
}

if (!allowedCancellationStates[decodedToken.role].includes(ride.rideStatus)) {
  throw new AppError(`Cannot cancel ride in ${ride.rideStatus} state`, 400);
}

  // Update Ride
  ride.rideStatus = RideStatus.CANCELLED;
  ride.cancelledAt = new Date();
  ride.cancelledBy = decodedToken.role; // 'rider' or 'driver'
  ride.cancellationReason = reason;
  ride.statusHistory.push({
    status: 'cancelled',
    changedBy: decodedToken.role,
    timestamp: new Date()
  });

  await ride.save();

  // // Penalize frequent cancellations (optional)
  // if (decodedToken.role === 'driver') {
  //   await penalizeDriver(userId);
  // }

  return ride;

}
export const RideService = {
    requestRide,
    acceptRide,
    changeRideStatus,
    cancelRide
    };
  