import { JwtPayload } from "jsonwebtoken";
import { Types } from "mongoose";
import AppError from "../../errorHelper/AppError";
import { Ride } from "../ride/ride.model";
import { checkActiveRides } from "./driver.helper";
import { IDriver } from "./driver.interface";
import { DriverModel } from "./driver.model";



// const changeOnlineStatus  = async (
  
//   payload: Partial<IDriver>,
//   decodedToken: JwtPayload
// ) => {
//  // 1. Find driver by ID (not userId)
//    const isDriverExist = await DriverModel.findOne({ userId: decodedToken.id });
    
   
//   if (!isDriverExist) {
//     throw new AppError("Driver not found", 404);
//   }

//  // 2. Check if driver is approved
//   if (isDriverExist.approvalStatus !== 'approved') {
//     throw new AppError('Your driver account is not approved', 403);
//   }
//  // 3. Update status and location
//  if (typeof payload.onlineStatus === 'boolean') {
//   isDriverExist.onlineStatus = payload.onlineStatus;
// }
//   if (payload.currentLocation) {
//     isDriverExist.currentLocation = {
//       type: 'Point',
//       coordinates: payload.currentLocation.coordinates,
      
//     };
//   }

//    // 4. If going offline, check for active rides
//   if (!payload.onlineStatus) {
//     const activeRide = await checkActiveRides(isDriverExist._id.toString());
//     if (activeRide) {
//       throw new AppError(
//         'Cannot go offline while having an active ride', 
//         400
//       );
//     }
//   }

//  await isDriverExist.save();
//   return isDriverExist;
// };
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
  getDriverStatus
    };
  