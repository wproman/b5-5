import { JwtPayload } from "jsonwebtoken";

import AppError from "../../errorHelper/AppError";
import { calculateFare } from "../../utils/fareCalculator";
import { DriverModel } from "../driver/driver.model";
import { UserRole } from "../users/user.interface";
import { User } from "../users/user.models";
import { IRatingInput, IRide, IRideQuery, RideStatus } from "./ride.interface";
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
    const ongoingRide = await Ride.findOne({ rider: userId, status: { $nin: [RideStatus.COMPLETED, RideStatus.CANCELLED] } });
    if (ongoingRide) {
      
        throw new AppError("you already have an ongoing ride", 400);
    }

 // 5. (Mock) distance/duration 
  const distanceKm = 7; 
  const durationMin = 18; 
  const fare = calculateFare(distanceKm, durationMin);


   const newRide = await Ride.create({
  riderId: userId,
  pickupLocation,
  destination,
    fare,
  status: RideStatus.REQUESTED,
  requestedAt: new Date(),
  paymentStatus: 'pending',
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

// 6. Prevent duplicate completion
  if (ride.rideStatus === RideStatus.COMPLETED) {
    throw new AppError("This ride is already completed", 400);
  }

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
if (Ridestatus === RideStatus.COMPLETED) {
  // Ensure fare is set
    if (!ride.fare || ride.fare === 0) {
      throw new AppError("Fare not calculated for this ride", 400);
    }
      // Update driver earnings atomically
    await DriverModel.findOneAndUpdate(
      { userId: ride.driverId },
      {
        $inc: { "driverInfo.earnings": ride.fare },
        $set: { "driverInfo.currentRide": null },
      }
    );

  ride.completedAt = new Date();
  ride.paymentStatus = 'paid'; // ✅ Add this line to mark payment
}
 
  // Update status history
  ride.statusHistory.push({
    rideStatus: Ridestatus,
    timestamp: new Date(),
    changedBy: "driver",
  });

  await ride.save();
  return ride;

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


const getRidesByRiderId = async (decodedToken: JwtPayload) => {
  const riderId = decodedToken.id;

  const rides = await Ride.find({ riderId }).sort({ createdAt: -1 });

  return rides.map(ride => ({
    rideId: ride._id,
    pickupLocation: ride.pickupLocation,
    destination: ride.destination,
    rideStatus: ride.rideStatus,
    fare: ride.fare,
    paymentStatus: ride.paymentStatus,
    requestedAt: ride.requestedAt,
    acceptedAt: ride.acceptedAt,
    pickedUpAt: ride.pickedUpAt,
    completedAt: ride.completedAt,
    statusHistory: ride.statusHistory,
  }));
};

const adminToSeeAllRides = async (query: IRideQuery) => {

const {
    page = 1,
    limit = 2,
    sortBy = 'createdAt',
    sortOrder = 'desc',
    status,
  } = query;

  const filter: Record<string, unknown> = {};
  if (status) filter.status = status;

  const sortOptions: Record<string, 1 | -1> = {
    [sortBy]: sortOrder === 'asc' ? 1 : -1,
  };

  const skip = (Number(page) - 1) * Number(limit);

  const rides = await Ride.find(filter)
    .populate('riderId driverId')
    .sort(sortOptions)
    .skip(skip)
    .limit(Number(limit));

  const total = await Ride.countDocuments(filter);

  return {
    meta: {
      page: Number(page),
      limit: Number(limit),
      total,
    },
    data: rides,
  };
};

const submitRating = async (
  rideId: string,
    // user: IUser,
  decodedToken: JwtPayload,
    ratingInput: IRatingInput
)  => {

 const { rating, feedback } = ratingInput;

   // Validate rating
    if (!rating || rating < 1 || rating > 5) {
      throw new AppError("Rating must be between 1 and 5", 400);
         }
          // Find the ride
    const ride = await Ride.findById(rideId);
    if (!ride) {
      throw new AppError("Ride not found", 404);
    }
       // Ensure ride is completed
    if (ride.rideStatus !== "completed") {
      throw new AppError("You can only rate a completed ride", 400);
    }

    const isRider = decodedToken.role === "rider" && ride.riderId.toString() === decodedToken.id;
    const isDriver = decodedToken.role === "driver" && ride.driverId?.toString() === decodedToken.id;

  if (!isRider && !isDriver) {
      throw new AppError("You are not authorized to rate this ride", 403);
    }

  // Update ride document
    if (isRider) {
      ride.driverRating = { rating, feedback };
    } else if (isDriver) {
      ride.riderRating = { rating, feedback };
    }
  
    await ride.save();

    return ride;

}
export const RideService = {
    requestRide,
    acceptRide,
    changeRideStatus,
    cancelRide,
    getRidesByRiderId,
    submitRating,
    adminToSeeAllRides
    };
  