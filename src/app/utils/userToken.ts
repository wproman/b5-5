import { JwtPayload } from "jsonwebtoken";
import { envVars } from "../config";
import AppError from "../errorHelper/AppError";
import { IsActive, IUser } from "../modules/users/user.interface";
import { User } from "../modules/users/user.models";
import { JwtHelper } from "./jwt";

const createUserToken = async (user: Partial<IUser>) => {
    const JwtPayload = {
    email: user.email,
    role: user.role,
    id: user.id,
  };

  const accessToken = JwtHelper.generateToken(
    JwtPayload,
   envVars.JWT_ACCESS_SECRET as string,
    envVars.JWT_ACCESS_EXPIRES
  );

  const refreshToken = JwtHelper.generateToken(
    JwtPayload,
envVars.JWT_REFRESH_SECRET as string,
    envVars.JWT_REFRESH_EXPIRES
  ); 

 return {
    accessToken,
    refreshToken,
  };
}

const creatNewAccessTokenWithRefreshToken = async (refreshToken: string) => {
  const verifiedRefreshToken = JwtHelper.verifyToken(
    refreshToken,
   envVars.JWT_REFRESH_SECRET as string
  ) as JwtPayload



  const isUserExist = await User.findOne({ email: verifiedRefreshToken.email });
  if (!isUserExist) {
    throw new AppError("User not found", 404);
  }
  if (isUserExist.isActive === IsActive.BLOCKED) {
    throw new AppError("User is blocked", 401);
  }
  if (isUserExist.isActive === IsActive.DELETED) {
    throw new AppError("User is deleted", 401);
  }
  if(isUserExist.isActive === IsActive.INACTIVE) {
    throw new AppError("User is inactive", 401);
  }
  if (isUserExist.isVerified === false) {
    throw new AppError("User is not verified", 401);
  }

  const payload = { email: isUserExist.email,    role: isUserExist.role,    id: isUserExist._id, };
  const accessToken = JwtHelper.generateToken(    payload,   envVars.JWT_ACCESS_SECRET,   envVars.JWT_ACCESS_EXPIRES  );

  
  return {
    accessToken,
  };

}
export const UserToken = {
  createUserToken,
  creatNewAccessTokenWithRefreshToken,
};

