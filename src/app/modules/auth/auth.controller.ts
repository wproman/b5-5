/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import { JwtPayload } from "jsonwebtoken";
import { envVars } from "../../config";
import AppError from "../../errorHelper/AppError";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { CookieHelper } from "../../utils/setCookie";
import { UserToken } from "../../utils/userToken";
import { AuthService } from "./auth.service";

// Create User Controller
const createUser = catchAsync(
  async (req: Request, res: Response, _next: NextFunction) => {
    const userData = req.body;

    const newUser = await AuthService.createUserService(userData);

    sendResponse(res, {
      success: true,
      statusCode: 201,
      message: "User created successfully",
      data: newUser,
    });
  }
);
const credentialsLogin = catchAsync(
  async (req: Request, res: Response, _next: NextFunction) => {
    const logingInfo = await AuthService.credentialslogin(req.body);

    CookieHelper.setAuthCookie(res, logingInfo);
  
    sendResponse(res, {
      success: true,
      statusCode: 200,
      message: "User logged in successfully",
      data: logingInfo,
    });
  }
);

const getNewAccessToken = catchAsync(
  async (req: Request, res: Response, _next: NextFunction) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      throw new AppError("Unauthorized", 401);
      
    }
    const tokenInfo = await AuthService.getNewAccessToken(refreshToken as string);
     CookieHelper.setAuthCookie(res, tokenInfo);
    sendResponse(res, {
      success: true,
      statusCode: 200,
      message: "User logged in successfully",
      data: tokenInfo,
    });
  }
);

const logout = catchAsync( async (req: Request, res: Response, _next: NextFunction) => {
   
   res.clearCookie("accessToken", {
    httpOnly: true,
     secure: false,
     sameSite: "lax",
   });

     res.clearCookie("refreshToken", {
    httpOnly: true,
     secure: false,
     sameSite: "lax",
   });

    sendResponse(res, {
      success: true,
      statusCode: 200,
      message: "User logged in successfully",
      data: null,
    });
  }
);

const resetPassword = catchAsync( async (req: Request, res: Response, _next: NextFunction) => {
   
      
   const newPassword = req.body.newPassword;
   const oldPassword =req.body.oldPassword
   const decodateToken = req.user

 await AuthService.resetPassword(oldPassword, newPassword, decodateToken as JwtPayload);

    sendResponse(res, {
      success: true,
      statusCode: 200,
      message: "User password changed  successfully",
      data: null,
    });
  }
);

const googleCallbackController = catchAsync(async(req: Request, res: Response, _next: NextFunction)=>{
  let redirectTo = req.query.state ?  req.query.state as string :""

  if(redirectTo.startsWith("/")){
    redirectTo = redirectTo.slice(1)
  }

  const user = req.user;

  if(!user) {
    throw new AppError( "User not found", 402)
  }
  const tokenInfo =  await UserToken.createUserToken (user)

  CookieHelper.setAuthCookie (res, tokenInfo)
  res.redirect(`${envVars.FRONTEND_URL}/${redirectTo}`)

})

export const AuthController = {
  createUser,
  credentialsLogin,
  getNewAccessToken,
  logout,
  resetPassword,
  googleCallbackController
};
