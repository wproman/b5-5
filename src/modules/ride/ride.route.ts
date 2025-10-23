import { Router } from "express";
import checkAuth from "../../middleware/checkAuth";
import { UserRole } from "../users/user.interface";
import { RideController } from "./ride.controller";

const router = Router();

// ==================== POST ROUTES ====================
router.post("/request", checkAuth(UserRole.RIDER), RideController.requestRide);
router.post("/estimate", checkAuth(UserRole.RIDER), RideController.estimateFare);

// ==================== SPECIFIC GET ROUTES (FIRST) ====================

router.get("/all-rides", checkAuth(UserRole.ADMIN), RideController.adminToSeeAllRides);
router.get('/my-rides/history', checkAuth(UserRole.RIDER, UserRole.DRIVER), RideController.getMyRideHistory);
router.get('/my-rides/current', checkAuth(UserRole.RIDER, UserRole.DRIVER), RideController.getMyCurrentRide);

// ==================== PARAMETER ROUTES (LAST) ====================
router.get('/:rideId', checkAuth(UserRole.RIDER, UserRole.DRIVER, UserRole.ADMIN), RideController.getRideDetails);
router.get('/:userId', checkAuth(UserRole.RIDER), RideController.getRidesByRiderId);

// ==================== PATCH ROUTES ====================

router.patch("/:id/status", checkAuth(UserRole.DRIVER), RideController.changeRideStatus);
router.patch("/:id/cancel", checkAuth(UserRole.RIDER), RideController.cancelRide);
// In your rideRoutes.ts
router.patch("/:id/reject", checkAuth(UserRole.DRIVER), RideController.rejectRide);

// ==================== OTHER ROUTES ====================
router.post('/:id/rate', checkAuth(UserRole.RIDER), RideController.rateRide);

export const RiderRoutes = router;