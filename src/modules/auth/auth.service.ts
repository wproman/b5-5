import bcrypt from "bcryptjs";
import { JwtPayload } from "jsonwebtoken";

import AppError from "../../errorHelper/AppError";
import { UserToken } from "../../utils/userToken";
import { DriverModel } from "../driver/driver.model";
import { IUser } from "../users/user.interface";
import { User } from "../users/user.models";
import { IRegisterRequest } from "./auth.interface";


const createUserService = async (payload: IRegisterRequest): Promise<IRegisterRequest> => {

 const { role, ...userData } = payload;

  // Common validation
  if (!['rider', 'driver'].includes(role)) {
    
    throw new AppError("Invalid role", 400);
  }

  const hashedPassword = bcrypt.hashSync(userData.password as string, 10);

  // Create user
  const user = await User.create({ ...userData, role, password: hashedPassword });


  if (role === 'driver') {
    if (!payload.licenseNumber || !payload.vehicleInfo) {
      await User.deleteOne({ _id: user._id }); // Rollback
    
      throw new AppError("Missing driver information", 400);
      
    }
    
    await DriverModel.create({
      userId: user._id,
      licenseNumber: payload.licenseNumber,
      vehicleInfo: payload.vehicleInfo,
      approvalStatus: 'pending' 
    });
  }

 return user as IRegisterRequest;

};

export const credentialslogin = async (payload: Partial<IUser>) => {
  const { email, password } = payload;

  if (!email || !password) {
    throw new AppError("Email and password are required", 400);
  }

  const isUserExist = await User.findOne({ email });
  if (!isUserExist) {
    throw new AppError("User not found", 404);
  }

  // 🚫 Blocked or deleted check
  if (isUserExist.isBlocked) {
    throw new AppError("Your account has been blocked. Please contact support.", 403);
  }

  if (isUserExist.isDeleted) {
    throw new AppError("This account has been deleted.", 403);
  }

  const isPasswordValid = await bcrypt.compare(
    password,
    isUserExist.password as string
  );

  if (!isPasswordValid) {
    throw new AppError("Invalid credentials", 401);
  }

  const userTokens = await UserToken.createUserToken(isUserExist);

  // remove password before returning user object
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password: _, ...userWithoutPassword } = isUserExist.toObject();

  return {
    accessToken: userTokens.accessToken,
    refreshToken: userTokens.refreshToken,
    user: userWithoutPassword,
  };
};

const getNewAccessToken = async (refreshToken: string) => {
  const newAccessToken = (await UserToken.creatNewAccessTokenWithRefreshToken(
    refreshToken
  )).accessToken;
  return {
    accessToken: newAccessToken,
  };
};
const resetPassword = async (
  oldPassword: string,
  newPassword: string,
  decodedToken: JwtPayload
): Promise<boolean> => {
  
  const user = await User.findById(decodedToken.id);


  if (!user) {
    throw new AppError("User not found", 404);
  }

  const isOldPasswordMatch = await bcrypt.compare(oldPassword, user.password as string);
  if (!isOldPasswordMatch) {
    throw new AppError("Old password doesn't match", 403);
  }

  user.password = await bcrypt.hash(newPassword, 10);
  await user.save();  

  return true;
};
export const AuthService = {
  createUserService,
  credentialslogin,
  getNewAccessToken,
  resetPassword
};
