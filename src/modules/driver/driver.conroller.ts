/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import { JwtPayload } from "jsonwebtoken";

import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { DriverService } from "./driver.service";

// Add this to your driverController.ts
export const getDriverStatus = catchAsync(async (req: Request, res: Response) => {
  const verifiedToken = req.user
       
        const payload = req.body;
 const status = await DriverService.getDriverStatus(
   
          payload,
          verifiedToken as JwtPayload
        );
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Driver status fetched successfully",
    data: status
  });
});

// controllers/rideController.ts
const getIncomingRides = catchAsync(
  async (req: Request, res: Response, _next: NextFunction) => {
    const verifiedToken = req.user;
    
    const result = await DriverService.getIncomingRides(
      verifiedToken as JwtPayload
    );

    sendResponse(res, {
      success: true,
      statusCode: 200,
      message: "Incoming rides fetched successfully",
      data: result,
    });
  }
);

const acceptRide  = catchAsync(
   
  async (req: Request, res: Response, _next: NextFunction) => {
    
       
        const verifiedToken = req.user
       
       
        const reqId = req.params.id;
        const result = await DriverService.acceptRide(
          reqId,
          
          verifiedToken as JwtPayload
        );

    sendResponse(res, {
      success: true,
      statusCode: 200,
      message: "Diver accept request successfully",
      data: result,
    });
  }
);



const changeOnlineStatus  = catchAsync(
   
  async (req: Request, res: Response, _next: NextFunction) => {
    
       
        const verifiedToken = req.user
       
        const payload = req.body;
   
        const availability = await DriverService.changeOnlineStatus(
   
          payload,
          verifiedToken as JwtPayload
        );

    sendResponse(res, {
      success: true,
      statusCode: 200,
      message: "Online status changed successfully",
      data: availability,
    });
  }
);

const getEarningsHistory  = catchAsync(
   
  async (req: Request, res: Response, _next: NextFunction) => {
    
       
        const verifiedToken = req.user
       
        const payload = req.body;
   
        const earnings  = await DriverService.getEarningsHistory(
   
          payload,
          verifiedToken as JwtPayload
        );

    sendResponse(res, {
      success: true,
      statusCode: 200,
      message: "Earnings history fetched successfully",
      data: earnings ,
    });
  }
);

const approveOrSuspendDriver  = catchAsync(
   
  async (req: Request, res: Response, _next: NextFunction) => {
    
        const driverId = req.params.id;
        const verifiedToken = req.user
       const { approvalStatus } = req.body;

         if (!['approved', 'pending',   ].includes(approvalStatus)) {
      return sendResponse(res, {
        success: false,
        statusCode: 400,
        message: "Invalid status. Must be 'approved' or 'suspended'",
        data: null,
      });
    }
            const updatedDriver = await DriverService.updateDriverStatus(
      verifiedToken as JwtPayload,
      driverId,
      approvalStatus
    );
   sendResponse(res, {
      success: true,
      statusCode: 200,
      message:`Driver status updated to ${approvalStatus}`,
      data: updatedDriver ,
    });
  }
);

export const DriverController = {
 changeOnlineStatus,
 getEarningsHistory,
 approveOrSuspendDriver,
 getDriverStatus,
 getIncomingRides,
 acceptRide,
//  rejectRide

    };