import { Ride } from "../ride/ride.model";

// Helper function
export const checkActiveRides = async (driverId: string) => {
  return await Ride.findOne({
    driverId,
    status: { $in: ['accepted', 'picked_up', 'in_transit'] }
  });
};