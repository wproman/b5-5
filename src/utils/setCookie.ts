import { Response } from "express";

export interface AuthTokens {
  accessToken?: string;
  refreshToken?: string;
}

const setAuthCookie = (res: Response, tokenInfo: AuthTokens) => {
 if(tokenInfo.accessToken) {
 res.cookie("accessToken", tokenInfo.accessToken,{
      httpOnly: true,
      secure: true,
      sameSite:"none"
    })
 }
 if(tokenInfo.refreshToken) {
  res.cookie("refreshToken", tokenInfo.refreshToken,{
      httpOnly: true,
      secure: true,
      sameSite:"none"
    })
 }
};
export const CookieHelper = {
  setAuthCookie,
};