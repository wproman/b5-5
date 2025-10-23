import { JwtPayload } from "jsonwebtoken";
import { Types } from "mongoose";
import AppError from "../../errorHelper/AppError";
import { RideStatus } from "../ride/ride.interface";
import { Ride } from "../ride/ride.model";
import { UserRole } from "../users/user.interface";
import { User } from "../users/user.models";
import { checkActiveRides } from "./driver.helper";
import { IDriver } from "./driver.interface";
import { DriverModel } from "./driver.model";


const getDriverStatus = async (
  payload: Partial<IDriver>,
  decodedToken: JwtPayload
) => {
  // 1. Find driver
  const isDriverExist = await DriverModel.findOne({ userId: decodedToken.id });
  
  if (!isDriverExist) {
    throw new AppError("Driver not found", 404);
  }

  // Return only the required status fields
  return {
    onlineStatus: isDriverExist.onlineStatus,
    approvalStatus: isDriverExist.approvalStatus,
  };
};
// services/rideService.ts
const getIncomingRides = async (
  decodedToken: JwtPayload
) => {
  // 1. Ensure role is DRIVER
  if (decodedToken.role !== UserRole.DRIVER) {
    throw new AppError("Only drivers can view incoming rides", 403);
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
    throw new AppError("Driver not approved or not online", 403);
  }

  // 5. Get incoming ride requests (rides that are requested and not assigned to any driver)
  const incomingRides = await Ride.find({
    rideStatus: "requested",
    driverId: { $exists: false }, // No driver assigned yet
    // Optional: Add location-based filtering if you have coordinates
    // You can add geospatial queries here based on driver's currentLocation
  })
    .populate('riderId', 'name phone rating') // Populate rider info
    .select('pickupLocation destination fare distance requestedAt estimatedDuration')
    .sort({ requestedAt: -1 }); // Most recent first

  // 6. Format the response
  const formattedRides = incomingRides.map(ride => ({
    _id: ride._id,
    riderId: {
      _id: ride.riderId._id,
      // name: ride.riderId.name,
      // phone: ride.riderId.phone,
      // rating: ride.riderId.rating || 4.5 // Default rating if not available
    },
    pickupLocation: ride.pickupLocation,
    destination: ride.destination,
    fare: ride.fare,
    // distance: ride.distance,
    requestedAt: ride.requestedAt,
    // estimatedDuration: ride.estimatedDuration || 15 // Default duration if not available
  }));

  return formattedRides;
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

// In your rideService.ts
// const rejectRide = async (
//   rideId: string,
//   decodedToken: JwtPayload,
//   reason?: string
// ) => {
//   const ride = await Ride.findById(rideId);
//   if (!ride) throw new AppError("Ride not found", 404);

//   // Authorization - Only drivers can reject rides
//   if (decodedToken.role !== UserRole.DRIVER) {
//     throw new AppError('Only drivers can reject ride requests', 403);
//   }

//   // Business Rules - Can only reject rides that are requested (not accepted yet)
//   if (ride.rideStatus !== RideStatus.REQUESTED) {
//     throw new AppError(`Cannot reject ride in ${ride.rideStatus} state`, 400);
//   }

//   // Update Ride
//   ride.rideStatus = RideStatus.REJECTED;
//   ride.rejectedAt = new Date();
//   ride.rejectedBy = decodedToken.id; // Store driver ID who rejected
//   ride.rejectionReason = reason;
//   ride.statusHistory.push({
//     status: 'rejected',
//     changedBy: decodedToken.role,
//     timestamp: new Date(),
//     reason: reason
//   });

//   await ride.save();

//   return ride;
// };

const changeOnlineStatus = async (
  payload: Partial<IDriver>,
  decodedToken: JwtPayload
) => {
 

  // 1. Find driver
  const isDriverExist = await DriverModel.findOne({ userId: decodedToken.id });
  
  
  if (!isDriverExist) {
    
    throw new AppError("Driver not found", 404);
  }

  // 2. Check if driver is approved
 
  if (isDriverExist.approvalStatus !== 'approved') {
    throw new AppError('Your driver account is not approved', 403);
  }

  // 3. Update status
  if (typeof payload.onlineStatus === 'boolean') {
    
    isDriverExist.onlineStatus = payload.onlineStatus;
  }

  // 4. If going offline, check for active rides
  if (payload.onlineStatus === false) {
   
    const activeRide = await checkActiveRides(isDriverExist._id.toString());
    if (activeRide) {
      throw new AppError('Cannot go offline while having an active ride', 400);
    }
  }

  await isDriverExist.save();
 
  
  return isDriverExist;
};
const getEarningsHistory  = async (
  
  payload: Partial<IDriver>,
  decodedToken: JwtPayload
) => {

  const driverId = decodedToken.id;
 
   const rides = await Ride.find({
   driverId: driverId,
    rideStatus: 'completed',
  }).select('fare createdAt');

// const rides = await Ride.find({  driverId: driverId })
    
  return rides.map(ride => ({
    amount: ride.fare,
    date: ride.createdAt,
  }));


  
};

  
const updateDriverStatus  = async (
  decodedToken: JwtPayload,
  
  driverId: string
  , approvalStatus: 'approved' | 'pending' | 'rejected' ,
) => {

 // Validate driver ID format
    if (!Types.ObjectId.isValid(driverId)) {
      throw new AppError('Invalid driver ID', 400);
    }
 // Check driver existence
    const driver = await DriverModel.findOne({
  userId: new Types.ObjectId(driverId),
});
    if (!driver) {
      throw new AppError('Driver not found', 404);
    }
     // Authorization - only admin can change status
    if (decodedToken.role !== 'admin') {
      throw new AppError('Unauthorized to perform this action', 403);
    }

    // Update status
    driver.approvalStatus = approvalStatus;
    driver.updatedAt = new Date();
   
      return await driver.save();

   
    
};
 


export const DriverService = {
  changeOnlineStatus,
  getEarningsHistory,
  updateDriverStatus,
  getDriverStatus,
  getIncomingRides,
  acceptRide,
  // rejectRide
    };
  