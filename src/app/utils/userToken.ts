import { JwtPayload } from "jsonwebtoken";
import AppError from "../errorHelper/AppError";
import { IsActive, IUser } from "../modules/users/user.interface";
import { User } from "../modules/users/user.models";
import { JwtHelper } from "./jwt";

const createUserToken = async (user: Partial<IUser>) => {
    const JwtPayload = {
    email: user.email,
    role: user.role,
    id: user._id,
  };
  const accessToken = JwtHelper.generateToken(
    JwtPayload,
    process.env.JWT_SECRET as string,
    process.env.JWT_EXPIRATION
  );

  const refreshToken = JwtHelper.generateToken(
    JwtPayload,
    process.env.JWT_REFRESH_SECRET as string,
    process.env.JWT_REFRESH_EXPIRATION
  ); 

 return {
    accessToken,
    refreshToken,
  };
}

const creatNewAccessTokenWithRefreshToken = async (refreshToken: string) => {
  const verifiedRefreshToken = JwtHelper.verifyToken(
    refreshToken,
    process.env.JWT_REFRESH_SECRET as string
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
  const accessToken = JwtHelper.generateToken(    payload,    process.env.JWT_SECRET as string,    process.env.JWT_EXPIRATION  );

  
  return {
    accessToken,
  };

}
export const UserToken = {
  createUserToken,
  creatNewAccessTokenWithRefreshToken,
};

