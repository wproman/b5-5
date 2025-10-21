import { Router } from "express";
import checAuth from "../../middleware/checkAuth";
// import { UserController } from "./user.controller";

import { UserRole } from "../users/user.interface";
import { RideController } from "./ride.controller";
// import { updateUserSchemaZod } from "./user.validate.zod";


const router = Router();


router.post(  "/request",  checAuth(UserRole.RIDER), RideController.requestRide);
router.post(  "/estimate",  checAuth(UserRole.RIDER), RideController.estimateFare);

// Get ride history for current user (both rider and driver)
router.get('/my-rides/history', checAuth(UserRole.RIDER, UserRole.DRIVER), RideController.getMyRideHistory);

// Get current/latest active ride for current user
router.get('/my-rides/current', checAuth(UserRole.RIDER, UserRole.DRIVER), RideController.getMyCurrentRide);


// Single ride details by ID
router.get('/:rideId', checAuth(UserRole.RIDER, UserRole.DRIVER, UserRole.ADMIN), RideController.getRideDetails);


router.get('/:userId', checAuth(UserRole.RIDER), RideController.getRidesByRiderId);



router.patch(  "/:id/accept",  checAuth(UserRole.DRIVER), RideController.acceptRide);
router.patch(  "/:id/status",  checAuth(UserRole.DRIVER), RideController.changeRideStatus);
router.patch(  "/:id/cancel",  checAuth(UserRole.RIDER, UserRole.DRIVER), RideController.cancelRide);

router.get('/all-rides', checAuth(UserRole.ADMIN), RideController.adminToSeeAllRides);

router.post('/:id/rate', checAuth(UserRole.RIDER), RideController.rateRide);




export const RiderRoutes = router;
