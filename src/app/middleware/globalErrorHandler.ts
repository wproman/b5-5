import { NextFunction, Request, Response } from "express";
import { envVars } from "../config";
import AppError from "../errorHelper/AppError";

export const globalErrorHandler = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  err: any,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction
) => {
  let statusCode = 500;
  let message = err.message || "Something went wrong";

  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message || "Something went wrong";
  } else if (err instanceof Error) {
    statusCode = 500;
    message = err.message || "Something went wrong";
  }

  res.status(statusCode).json({
    success: false,
    message,
    err,
    stack: envVars?.node_env === "development" ? err?.stack : null,
  });
};
