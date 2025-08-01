import bcrypt from "bcryptjs";
import { JwtPayload } from "jsonwebtoken";
import AppError from "../../errorHelper/AppError";
import { UserToken } from "../../utils/userToken";
import { DriverModel } from "../driver/driver.model";
import { IUser } from "../users/user.interface";
import { User } from "../users/user.models";
import { IRegisterRequest } from "./auth.interface";


const createUserService = async (payload: IRegisterRequest): Promise<IRegisterRequest> => {
//   const { email, password, ...rest } = payload;
//   const existingUser = await User.findOne({ email });
//   if (existingUser) {
//     throw new AppError("User already exists", 400);
//   }
//   const hashedPassword = bcrypt.hashSync(password as string, 10);

//   const authProvider: IAuthProvider = {
//     provider: "credentials",
//     providerId: email as string,
//   };

//   const user = await User.create({
//     email,
//     password: hashedPassword,
//     auths: [authProvider],
//     ...rest,
//   });
//   return user;

 const { role, ...userData } = payload;

  // Common validation
  if (!['rider', 'driver'].includes(role)) {
    
    throw new AppError("Invalid role", 400);
  }

  const hashedPassword = bcrypt.hashSync(userData.password as string, 10);

  // Create user
  const user = await User.create({ ...userData, role, password: hashedPassword });

  // If driver, create driver profile
  if (role === 'driver') {
    if (!payload.licenseNumber || !payload.vehicleInfo) {
      await User.deleteOne({ _id: user._id }); // Rollback
    
      throw new AppError("Missing driver information", 400);
      
    }
    
    await DriverModel.create({
      userId: user._id,
      licenseNumber: payload.licenseNumber,
      vehicleInfo: payload.vehicleInfo,
      approvalStatus: 'pending' // Requires admin approval
    });
  }

 return user as IRegisterRequest;

};



const credentialslogin = async (payload: Partial<IUser>) => {
  const { email, password } = payload;

  // Here you would typically validate the credentials against a database
  // For demonstration purposes, we will assume the credentials are valid
  if (!email || !password) {
    throw new AppError("Email and password are required", 400);
  }
  const isUserExist = await User.findOne({ email });
  if (!isUserExist) {
    throw new AppError("User not found", 404);
  }

  const isPasswordValid = await bcrypt.compare(
    password,
    isUserExist.password as string
  );

  if (!isPasswordValid) {
    throw new AppError("Invalid credentials", 401);
  }

  const userTokens = await UserToken.createUserToken(isUserExist);    
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
