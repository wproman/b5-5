"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DriverRoutes = void 0;
const express_1 = require("express");
const checkAuth_1 = __importDefault(require("../../middleware/checkAuth"));
const user_interface_1 = require("../users/user.interface");
const driver_conroller_1 = require("./driver.conroller");
const router = (0, express_1.Router)();
router.get("/incoming", (0, checkAuth_1.default)(user_interface_1.UserRole.DRIVER), driver_conroller_1.DriverController.getIncomingRides);
router.get('/status', (0, checkAuth_1.default)(user_interface_1.UserRole.DRIVER), driver_conroller_1.DriverController.getDriverStatus);
router.patch("/availability", (0, checkAuth_1.default)(user_interface_1.UserRole.DRIVER), driver_conroller_1.DriverController.changeOnlineStatus);
router.get('/earnings', (0, checkAuth_1.default)(user_interface_1.UserRole.DRIVER), driver_conroller_1.DriverController.getEarningsHistory);
router.patch('/approved/:id', (0, checkAuth_1.default)(user_interface_1.UserRole.ADMIN), driver_conroller_1.DriverController.approveOrSuspendDriver);
router.patch("/:id/accept", (0, checkAuth_1.default)(user_interface_1.UserRole.DRIVER), driver_conroller_1.DriverController.acceptRide);
exports.DriverRoutes = router;
