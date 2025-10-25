"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RiderRoutes = void 0;
const express_1 = require("express");
const checkAuth_1 = __importDefault(require("../../middleware/checkAuth"));
const user_interface_1 = require("../users/user.interface");
const ride_controller_1 = require("./ride.controller");
const router = (0, express_1.Router)();
// ==================== POST ROUTES ====================
router.post("/request", (0, checkAuth_1.default)(user_interface_1.UserRole.RIDER), ride_controller_1.RideController.requestRide);
router.post("/estimate", (0, checkAuth_1.default)(user_interface_1.UserRole.RIDER), ride_controller_1.RideController.estimateFare);
// ==================== SPECIFIC GET ROUTES (FIRST) ====================
router.get("/all-rides", (0, checkAuth_1.default)(user_interface_1.UserRole.ADMIN), ride_controller_1.RideController.adminToSeeAllRides);
router.get('/my-rides/history', (0, checkAuth_1.default)(user_interface_1.UserRole.RIDER, user_interface_1.UserRole.DRIVER), ride_controller_1.RideController.getMyRideHistory);
router.get('/my-rides/current', (0, checkAuth_1.default)(user_interface_1.UserRole.RIDER, user_interface_1.UserRole.DRIVER), ride_controller_1.RideController.getMyCurrentRide);
// ==================== PARAMETER ROUTES (LAST) ====================
router.get('/:rideId', (0, checkAuth_1.default)(user_interface_1.UserRole.RIDER, user_interface_1.UserRole.DRIVER, user_interface_1.UserRole.ADMIN), ride_controller_1.RideController.getRideDetails);
router.get('/:userId', (0, checkAuth_1.default)(user_interface_1.UserRole.RIDER), ride_controller_1.RideController.getRidesByRiderId);
// ==================== PATCH ROUTES ====================
router.patch("/:id/status", (0, checkAuth_1.default)(user_interface_1.UserRole.DRIVER), ride_controller_1.RideController.changeRideStatus);
router.patch("/:id/cancel", (0, checkAuth_1.default)(user_interface_1.UserRole.RIDER), ride_controller_1.RideController.cancelRide);
// In your rideRoutes.ts
router.patch("/:id/reject", (0, checkAuth_1.default)(user_interface_1.UserRole.DRIVER), ride_controller_1.RideController.rejectRide);
// ==================== OTHER ROUTES ====================
router.post('/:id/rate', (0, checkAuth_1.default)(user_interface_1.UserRole.RIDER), ride_controller_1.RideController.rateRide);
exports.RiderRoutes = router;
