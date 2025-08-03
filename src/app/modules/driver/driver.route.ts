import { Router } from "express";
import checkAuth from "../../middleware/checkAuth";


import { UserRole } from "../users/user.interface";
import { DriverController } from "./driver.conroller";



const router = Router();



router.patch(  "/status",  checkAuth(UserRole.DRIVER), DriverController.changeOnlineStatus);

router.get('/earnings', checkAuth(UserRole.DRIVER), DriverController.getEarningsHistory);
router.patch('/approved/:id', checkAuth(UserRole.ADMIN), DriverController.approveOrSuspendDriver);





export const DriverRoutes = router;
