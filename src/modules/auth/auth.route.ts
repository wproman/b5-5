 
import { Router } from "express";
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


export const AuthRoutes = router;
