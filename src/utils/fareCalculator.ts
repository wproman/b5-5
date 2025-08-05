export const calculateFare = (
  distanceKm: number,
  durationMin: number,
  surgeMultiplier = 1
) => {
  const BASE_FARE = 50; // BDT
  const PER_KM_RATE = 25; // BDT per km
  const PER_MIN_RATE = 2; // BDT per minute

  const fare =
    (BASE_FARE + distanceKm * PER_KM_RATE + durationMin * PER_MIN_RATE) *
    surgeMultiplier;

  return Math.max(fare, BASE_FARE); // ensure not below base
};