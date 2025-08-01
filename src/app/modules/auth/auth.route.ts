 
import { NextFunction, Request, Response, Router } from "express";
import passport from "passport";
import checAuth from "../../middleware/checkAuth";
import { validateRequest } from "../../middleware/validateRequest";
import { UserRole } from "../users/user.interface";
import { userSchemaZod } from "../users/user.validate.zod";
import { AuthController } from "./auth.controller";

const router = Router();
router.post(  "/register",  validateRequest(userSchemaZod),AuthController.createUser);
router.post("/login", AuthController.credentialsLogin);
router.post( "/refresh-token", AuthController.getNewAccessToken);
router.post("/logout", AuthController.logout);
router.post ("/reset-password", checAuth(...Object.values(UserRole)), AuthController.resetPassword);
router.get("/google", (req: Request, res: Response, _next: NextFunction)=>{
    const redirect = req.query.redirect || "/"
    passport.authenticate("google", {scope: ["profile", "email"], state: redirect as string})(req,res,_next)
})
router.get("/google/callback", passport.authenticate("google", {failureRedirect: "/login"}), AuthController.googleCallbackController)

export const AuthRoutes = router;
