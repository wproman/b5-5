"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RideStatus = void 0;
var RideStatus;
(function (RideStatus) {
    RideStatus["REQUESTED"] = "requested";
    RideStatus["ACCEPTED"] = "accepted";
    RideStatus["PICKED_UP"] = "picked_up";
    RideStatus["IN_TRANSIT"] = "in_transit";
    RideStatus["COMPLETED"] = "completed";
    RideStatus["CANCELLED"] = "cancelled";
    RideStatus["REJECTED"] = "rejected";
})(RideStatus || (exports.RideStatus = RideStatus = {}));
