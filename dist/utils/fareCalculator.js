"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateMockDistanceAndDuration = exports.calculateFare = void 0;
// Helper functions
const calculateFare = (distanceKm, durationMin, surgeMultiplier = 1) => {
    const BASE_FARE = 50;
    const PER_KM_RATE = 25;
    const PER_MIN_RATE = 2;
    const fare = (BASE_FARE + distanceKm * PER_KM_RATE + durationMin * PER_MIN_RATE) * surgeMultiplier;
    return Math.max(fare, BASE_FARE);
};
exports.calculateFare = calculateFare;
const calculateMockDistanceAndDuration = (pickupAddress, destinationAddress) => {
    const hashString = (str) => {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
        return Math.abs(hash);
    };
    const addressHash = hashString(pickupAddress + destinationAddress);
    const distance = 2 + (addressHash % 23);
    const roundedDistance = Math.round(distance * 10) / 10;
    const duration = Math.round(5 + (distance * 2));
    return { distance: roundedDistance, duration };
};
exports.calculateMockDistanceAndDuration = calculateMockDistanceAndDuration;
