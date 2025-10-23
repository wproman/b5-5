/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from "express";

type AsyncHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<void>;

// Catch async errors wrapper
const catchAsync = (fn: AsyncHandler) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch((error: any) => {
      // Check if headers have already been sent
      if (res.headersSent) {
        console.error('Headers already sent, skipping error handler');
        return;
      }
      
      console.error("Error in AsyncHandler:", error);
      next(error);
    });
  };
};



export default catchAsync;
