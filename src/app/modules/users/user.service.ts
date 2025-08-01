import bcrypt from "bcryptjs";
import { JwtPayload } from "jsonwebtoken";
import AppError from "../../errorHelper/AppError";
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
export const UserService = {

  getAllUsersService,
  updateUserService,
};
