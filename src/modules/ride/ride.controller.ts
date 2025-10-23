/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import { JwtPayload } from "jsonwebtoken";

import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { RideService } from "./ride.service";


const requestRide = catchAsync(async (req: Request, res: Response, _next: NextFunction) => {
  const verifiedToken = req.user;
  const payload = req.body;
  
  const rides = await RideService.requestRide(payload, verifiedToken as JwtPayload);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Ride requested successfully",
    data: rides,
  });
});

const estimateFare = catchAsync(async (req: Request, res: Response, _next: NextFunction) => {
  const payload = req.body;
  
  const fareEstimation = await RideService.estimateFare(payload);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Fare estimated successfully",
    data: fareEstimation,
  });
});
// controllers/rideController.ts



const changeRideStatus  = catchAsync(
   
  async (req: Request, res: Response, _next: NextFunction) => {
            const verifiedToken = req.user
       
        const { status } = req.body;

        
        const reqId = req.params.id;
        const users = await RideService.changeRideStatus(
          reqId,
          
          verifiedToken as JwtPayload,
          status,
        );

    sendResponse(res, {
      success: true,
      statusCode: 200,
      message: `Ride status changed to ${status} successfully`,
      data: users,
    });
  }
);

const cancelRide  = catchAsync(
   
  async (req: Request, res: Response, _next: NextFunction) => {
            const verifiedToken = req.user
       
        const { reason } = req.body;

    
        const rideId = req.params.id;
        const ride = await RideService.cancelRide(
          rideId,
          
          verifiedToken as JwtPayload,
      
          reason,
        );

    sendResponse(res, {
      success: true,
      statusCode: 200,
      message: "Ride cancelled successfully",
      data: ride,
    });
  }
);
// In your rideController.ts
const rejectRide = catchAsync(
  async (req: Request, res: Response, _next: NextFunction) => {
    const verifiedToken = req.user;
    const { reason } = req.body;
    const rideId = req.params.id;

    const ride = await RideService.rejectRide(
      rideId,
      verifiedToken as JwtPayload,
      reason,
    );

    sendResponse(res, {
      success: true,
      statusCode: 200,
      message: "Ride request rejected successfully",
      data: ride,
    });
  }
);



const getRideDetails = catchAsync(async (req: Request, res: Response, _next: NextFunction) => {
  const { rideId } = req.params;

 
  const verifiedToken = req.user;
   
  const ride = await RideService.getRideDetails(rideId, verifiedToken as JwtPayload);
 
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Ride details fetched successfully",
    data: ride,
  });
});
const getRidesByRiderId  = catchAsync(
   
  
  async (req: Request, res: Response, _next: NextFunction) => {
            
     const verifiedToken = req.user     
       
        const ride = await RideService.getRidesByRiderId(
          verifiedToken as JwtPayload, 
        );

    sendResponse(res, {
      success: true,
      statusCode: 200,
      message: "Ride history fetched successfully",
      data: ride,
    });
  }
);

const adminToSeeAllRides  = catchAsync(
   
  async (req: Request, res: Response, _next: NextFunction) => {
            
        
     const query = req.query;

    const result = await RideService.adminToSeeAllRides(query);
      

    sendResponse(res, {
      success: true,
      statusCode: 200,
      message: "All rides fetched successfully",
      meta: result.meta,
      data: result.data,
    });
  }
);

const rateRide   = catchAsync(
   
  async (req: Request, res: Response, _next: NextFunction) => {
    
        const rideId = req.params.id;
    const validateRequest = req.user;
    const { rating, feedback } = req.body;

    const result = await RideService.submitRating(rideId, validateRequest as JwtPayload, { rating, feedback });

   

 sendResponse(res, {
      success: true,
      statusCode: 200,
      message: "Rating submitted successfully",
      data: result,
    });

  }
);


const getMyRideHistory = catchAsync(async (req: Request, res: Response, _next: NextFunction) => {
  const verifiedToken = req.user;
  const rides = await RideService.getMyRideHistory(verifiedToken as JwtPayload);
  
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Ride history fetched successfully",
    data: rides,
  });
});

const getMyCurrentRide = catchAsync(async (req: Request, res: Response, _next: NextFunction) => {
  const verifiedToken = req.user;
  const currentRide = await RideService.getMyCurrentRide(verifiedToken as JwtPayload);
  
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Current ride fetched successfully",
    data: currentRide,
  });
});




export const RideController = {
    requestRide ,
   
changeRideStatus,
cancelRide,
getRidesByRiderId,
rateRide,
adminToSeeAllRides,
estimateFare,
getRideDetails,
getMyRideHistory,
getMyCurrentRide,
rejectRide

    };