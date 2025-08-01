import { Router } from "express";
import checAuth from "../../middleware/checkAuth";
// import { UserController } from "./user.controller";

import { UserRole } from "../users/user.interface";
import { RideController } from "./ride.controller";
// import { updateUserSchemaZod } from "./user.validate.zod";


const router = Router();


router.post(  "/request",  checAuth(UserRole.RIDER), RideController.requestRide);
router.patch(  "/:id/accept",  checAuth(UserRole.DRIVER), RideController.acceptRide);
// router.patch(  "/cancel/:id", validateRequest(updateUserSchemaZod),  checAuth(...Object.values(UserRole)), UserController.updateUser);
// router.get(  "/history", checAuth(UserRole.ADMIN, UserRole.DRIVER, UserRole.RIDER), UserController.getUserById);

export const RiderRoutes = router;
