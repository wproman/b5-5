import { NextFunction, Request, Response } from "express";
import { AnyZodObject } from "zod";

export const validateRequest = (zodSchema: AnyZodObject) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      req.body = await zodSchema.parseAsync(req.body);

      next();
    } catch (error) {
      next(error);
    }
  };
};

export const validateRequestParams = (zodSchema: AnyZodObject) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      req.params = await zodSchema.parseAsync(req.params);

      next();
    } catch (error) {
      next(error);
    }
  };
};
