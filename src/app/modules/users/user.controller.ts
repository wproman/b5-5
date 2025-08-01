/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";


import { JwtPayload } from "jsonwebtoken";
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

// Export controller
export const UserController = {
  
  getAllUsers,
  updateUser,
};
