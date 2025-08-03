import { NextFunction, Request, Response } from "express";
import { JwtPayload } from "jsonwebtoken";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { RideService } from "./ride.service";


const requestRide  = catchAsync(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async (req: Request, res: Response, _next: NextFunction) => {
    
       
        const verifiedToken = req.user
       
        const payload = req.body;
   
        const rides = await RideService.requestRide(
   
          payload,
          verifiedToken as JwtPayload
        );

    sendResponse(res, {
      success: true,
      statusCode: 200,
      message: "Users retrieved successfully",
      data: rides,
    });
  }
);

const acceptRide  = catchAsync(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async (req: Request, res: Response, _next: NextFunction) => {
    
       
        const verifiedToken = req.user
       
       
        const reqId = req.params.id;
        const users = await RideService.acceptRide(
          reqId,
          
          verifiedToken as JwtPayload
        );

    sendResponse(res, {
      success: true,
      statusCode: 200,
      message: "Users retrieved successfully",
      data: users,
    });
  }
);

const changeRideStatus  = catchAsync(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
      message: "Users retrieved successfully",
      data: users,
    });
  }
);

const cancelRide  = catchAsync(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
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

const getRidesByRiderId  = catchAsync(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
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

const rateRide   = catchAsync(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
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






export const RideController = {
    requestRide ,
    acceptRide,
changeRideStatus,
cancelRide,
getRidesByRiderId,
rateRide
    };