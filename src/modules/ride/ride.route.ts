import { Router } from "express";
import checAuth from "../../middleware/checkAuth";
// import { UserController } from "./user.controller";

import { UserRole } from "../users/user.interface";
import { RideController } from "./ride.controller";
// import { updateUserSchemaZod } from "./user.validate.zod";


const router = Router();


router.post(  "/request",  checAuth(UserRole.RIDER), RideController.requestRide);
router.patch(  "/:id/accept",  checAuth(UserRole.DRIVER), RideController.acceptRide);
router.patch(  "/:id/status",  checAuth(UserRole.DRIVER), RideController.changeRideStatus);
router.patch(  "/:id/cancel",  checAuth(UserRole.RIDER, UserRole.DRIVER), RideController.cancelRide);
router.get('/me', checAuth(UserRole.RIDER), RideController.getRidesByRiderId);
router.get('/', checAuth(UserRole.ADMIN), RideController.adminToSeeAllRides);

router.post('/:id/rate', checAuth(UserRole.RIDER), RideController.rateRide);




export const RiderRoutes = router;
