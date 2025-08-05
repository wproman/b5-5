import { NextFunction, Request, Response } from "express";

import { JwtPayload } from "jsonwebtoken";
import { envVars } from "../config";
import AppError from "../errorHelper/AppError";
import { IsActive, UserRole } from "../modules/users/user.interface";
import { User } from "../modules/users/user.models";
import { JwtHelper } from "../utils/jwt";

const checkAuth =  (...authRoles: UserRole[]) => {
  return  async (req: Request, res: Response, next: NextFunction) => {
    const accessToken = req.cookies.accessToken || req.headers.authorization?.split(" ")[1];
    if (!accessToken) {
      res.status(401).json({ message: "Unauthorized" });
      return next();
    }
  


    const verifyToken = JwtHelper.verifyToken(
      accessToken,
      envVars.JWT_ACCESS_SECRET as string
      // process.env.JWT_ACCESS_SECRET as string --- IGNORE ---               
    ) as JwtPayload;
   
      const isUserExist = await User.findOne({ email: verifyToken.email });
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
  // if (isUserExist.isVerified === false) {
  //   throw new AppError("User is not verified", 401);
  // }
    if (!verifyToken) {
      res.status(401).json({ message: "Invalid token" });
      return next();
    }
    req.user = verifyToken;
    if (authRoles.length > 0 && !authRoles.includes(verifyToken.role)) {
      throw new AppError(`Unauthorized access ${verifyToken}`, 403);
    }
    next();
  };
};





export default checkAuth;
