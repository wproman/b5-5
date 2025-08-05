import jwt, { JwtPayload, SignOptions } from "jsonwebtoken";

const generateToken = (
  payload: JwtPayload,
  secret: string,
  expiresIn?: string | number
): string => {
  return jwt.sign(payload, secret, { expiresIn } as SignOptions);
};

const verifyToken = (token: string, secret: string): string | JwtPayload => {
  return jwt.verify(token, secret);
};

export const JwtHelper = {
  generateToken,
  verifyToken,
};
