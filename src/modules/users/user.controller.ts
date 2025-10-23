/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import { JwtPayload } from "jsonwebtoken";

import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { IUser } from "./user.interface";
import { UserService } from "./user.service";

// Get All Users Controller
const getAllUsers = catchAsync(
  async (req: Request, res: Response, _next: NextFunction) => {
    const filter = req.query;

    const users = await UserService.getAllUsersService(
      filter as Record<string, string | string[]>
    );

    sendResponse(res, {
      success: true,
      statusCode: 200,
      message: "Users retrieved successfully",
      data: users,
    });
  }
);

const updateUser = catchAsync(async (req: Request, res: Response) => {
  const userId = req.params.id; // From auth middleware
  const { name, phone, address, picture } = req.body;
  const decodedToken = req.user as JwtPayload
    
  const updateData: Partial<IUser> = {};
  if (name) updateData.name = name;
  if (phone) updateData.phone = phone;
  if (address) updateData.address = address;
  if (picture) updateData.picture = picture;

  const updatedUser = await UserService.updateUserService(userId, updateData, decodedToken);

  res.status(200).json({
    success: true,
    message: 'Profile updated successfully',
    data: updatedUser
  });
});

const blockUnblockUser = catchAsync(
  async (req: Request, res: Response, _next: NextFunction) => {
    // Get admin from auth middleware
    const admin = req.user as JwtPayload;
    const action = req.path.includes("/block/") ? true : false;
    const userId = req.params.id;

    // Call service
    const result = await UserService.toggleUserBlockStatus(userId, admin, action);

    sendResponse(res, {
      success: true,
      statusCode: 200,
      message: `User ${action ? "blocked" : "unblocked"} successfully`,
      data: result,
    });
  }
);

const getProfile = catchAsync(
  async (req: Request, res: Response, _next: NextFunction) => {
    const verifiedToken = req.user as JwtPayload;
    const userId = verifiedToken.id;
  
    const user = await UserService.getProfileService(userId);

    sendResponse(res, {
      success: true,
      statusCode: 200,
      message: "User profile retrieved successfully",
      data: user,
    });
  }
);

// Export controller
export const UserController = {
  getProfile,
  getAllUsers,
  updateUser,
  blockUnblockUser,
};
