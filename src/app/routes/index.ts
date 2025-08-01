import { Router } from "express";
import { AuthRoutes } from "../modules/auth/auth.route";

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


];
moduleRoutes.forEach((route) => {
  router.use(route.path, route.route);
});
