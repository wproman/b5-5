import { JwtPayload } from "jsonwebtoken";
import AppError from "../../errorHelper/AppError";
import { DriverModel } from "../driver/driver.model";
import { UserRole } from "../users/user.interface";
import { User } from "../users/user.models";
import { IRide } from "./ride.interface";
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
  decodedToken: JwtPayload
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
  if (ride.status !== "requested") {
    throw new AppError("This ride is not available for acceptance.", 400);
  }

  // 8. Accept the ride
ride.driverId = driverUser._id;
ride.status = "accepted";
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
  decodedToken: JwtPayload
) => {
   
    if (decodedToken.role !== "driver") {
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
  }
// 6. Validate next status transition
  // const validStatus = [
  //   status.ACCEPTED,
  //   status.PICKED_UP,
  //   status.IN_TRANSIT,
  //   RideStatus.COMPLETED,
  // ];
  return ride

};


export const RideService = {
    requestRide,
    acceptRide,
    changeRideStatus
    };