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
       
       
        const reqId = req.params.id;
        const users = await RideService.changeRideStatus(
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




export const RideController = {
    requestRide ,
    acceptRide,
changeRideStatus
    };