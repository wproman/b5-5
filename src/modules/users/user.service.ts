import bcrypt from "bcryptjs";
import { JwtPayload } from "jsonwebtoken";
import AppError from "../../errorHelper/AppError";
import { DriverModel } from "../driver/driver.model";
import { IUser, UserRole } from "./user.interface";
import { User } from "./user.models";



const updateUserService = async (
  userId: string,
  payload: Partial<IUser>,
  decodedToken: JwtPayload
) => {
  const isUserExist = await User.findById(userId);
  if (!isUserExist) {
    throw new AppError("User not found", 404);
  }

  if (
    
    decodedToken.role !== UserRole.ADMIN
  ) {
    throw new AppError("You are not authorized to update role", 403);
  }

  if (payload.isDeleted || payload.isVerified || payload.isActive) {
    throw new AppError("You are not authorized to update this field", 403);
  }

  if (payload.password) {
    const hashedPassword = bcrypt.hashSync(payload.password as string, 10);
    payload.password = hashedPassword;
  }
  const updatedUser = await User.findByIdAndUpdate(userId, payload, {
    new: true,
    runValidators: true,
  });
  return updatedUser;
};

const getAllUsersService = async (): Promise<IUser[]> => {
  const users = await User.find();
  if (!users) {
    throw new Error("No users found");
  }
  return users;
};



const toggleUserBlockStatus = async (
  userId: string,
  admin: JwtPayload,
  shouldBlock: boolean
) => {
  // Verify admin privileges
  if (admin.role !== UserRole.ADMIN) {
    throw new AppError('Unauthorized: Admin access required', 403);
  }

  // Prevent self-blocking
  if (admin.userId === userId) {
    throw new AppError('Admins cannot block themselves', 400);
  }

  const user = await User.findById(userId);
  if (!user) {
    throw new AppError('User not found', 404);
  }

  // Prevent blocking other admins
  if (user.role === UserRole.ADMIN) {
    throw new AppError('Cannot block other admin users', 403);
  }

  // Update block status
  user.isBlocked = shouldBlock;
  await user.save();

  // If blocking a driver, set offline
  if (shouldBlock && user.role === UserRole.DRIVER) {
    await DriverModel.findOneAndUpdate(
      { userId },
      { onlineStatus: false },
      { new: true }
    );
  }

  return user;
};
 


export const UserService = {

  getAllUsersService,
  updateUserService,
  toggleUserBlockStatus
};
