/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";



import { JwtPayload } from "jsonwebtoken";

import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { UserService } from "./user.service";



// Get All Users Controller
const getAllUsers = catchAsync(
  async (req: Request, res: Response, _next: NextFunction) => {
    const users = await UserService.getAllUsersService();

    sendResponse(res, {
      success: true,
      statusCode: 200,
      message: "Users retrieved successfully",
      data: users,
    });
  }
);

const updateUser = catchAsync(
  async (req: Request, res: Response, _next: NextFunction) => {
    const userId = req.params.id;
   
    const verifiedToken = req.user
    const payload = req.body;
    const users = await UserService.updateUserService(
      userId,
      payload,
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


const blockUnblockUser    = catchAsync(
   
  async (req: Request, res: Response, _next: NextFunction) => {
     // 2. Get admin from auth middleware
    const admin = req.user as JwtPayload;
    const action = req.path.includes('/block/') ? true : false;
    const userId = req.params.id;
    // 4. Call service
    const result = await UserService.toggleUserBlockStatus(
      userId,
      admin,
      action
    );

 sendResponse(res, {
      success: true,
      statusCode: 200,
      message: `User ${action ? 'blocked' : 'unblocked'} successfully`,
      data: result,
    });

  }
);

// Export controller
export const UserController = {
  
  getAllUsers,
  updateUser,
  blockUnblockUser
};
