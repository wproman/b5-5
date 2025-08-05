import { Router } from "express";
import { AuthRoutes } from "../modules/auth/auth.route";

import { DriverRoutes } from "../modules/driver/driver.route";
import { RiderRoutes } from "../modules/ride/ride.route";
import { UserRoutes } from "../modules/users/user.route";

export const router = Router();

const moduleRoutes = [
  {
    path: "/user",
    route: UserRoutes,
  },
  {
    path: "/auth",
    route: AuthRoutes,
  },
   {
    path: "/rides",
    route: RiderRoutes,
  },
   {
    path: "/driver",
    route: DriverRoutes,
  },



];
moduleRoutes.forEach((route) => {
  router.use(route.path, route.route);
});
