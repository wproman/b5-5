 
 
import { NextFunction, Request, Response, Router } from "express";
import passport from "passport";
import checkAuth from "../../middleware/checkAuth";
import { validateRequest } from "../../middleware/validateRequest";
import { UserRole } from "../users/user.interface";
import { userSchemaZod } from "../users/user.validate.zod";
import { AuthController } from "./auth.controller";

const router = Router();
router.post(  "/register",  validateRequest(userSchemaZod),AuthController.createUser);
router.post("/login", AuthController.credentialsLogin);
router.post( "/refresh-token", AuthController.getNewAccessToken);
router.post("/logout", AuthController.logout);
router.patch ("/reset-password", checkAuth(...Object.values(UserRole)), AuthController.resetPassword);
router.get("/google", (req:Request,res:Response, next:NextFunction)=>{
    passport.authenticate("google", {scope:["profile", "email"]})(req,res,next)
})
router.get("/google/callback",passport.authenticate("google", {failureRedirect:"/login"}),AuthController.googleCallbackController)


export const AuthRoutes = router;
