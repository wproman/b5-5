import { Router } from "express";
import checkAuth from "../../middleware/checkAuth";


import { UserRole } from "../users/user.interface";
import { DriverController } from "./driver.conroller";



const router = Router();

router.get("/incoming", checkAuth(UserRole.DRIVER), DriverController.getIncomingRides);
router.get('/status', checkAuth(UserRole.DRIVER), DriverController.getDriverStatus)
router.patch(  "/availability",  checkAuth(UserRole.DRIVER), DriverController.changeOnlineStatus);

router.get('/earnings', checkAuth(UserRole.DRIVER), DriverController.getEarningsHistory);
router.patch('/approved/:id', checkAuth(UserRole.ADMIN), DriverController.approveOrSuspendDriver);
router.patch("/:id/accept", checkAuth(UserRole.DRIVER), DriverController.acceptRide);






export const DriverRoutes = router;
