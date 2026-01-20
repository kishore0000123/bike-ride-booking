const User = require("../models/User");
const Rider = require("../models/Rider");
const { calculateDistance } = require("./fareCalculator");

// Find nearest available rider
async function findNearestRider(pickupLat, pickupLng) {
  try {
    // Find all online riders
    const onlineRiders = await Rider.find({ isOnline: true });
    
    if (onlineRiders.length === 0) {
      return null;
    }
    
    // Calculate distance to each rider
    const ridersWithDistance = onlineRiders.map(rider => {
      const distance = rider.location && rider.location.lat && rider.location.lng
        ? calculateDistance(pickupLat, pickupLng, rider.location.lat, rider.location.lng)
        : 999; // Very far if no location
      
      return {
        riderId: rider.userId,
        riderDoc: rider,
        distance,
        rating: rider.rating.average
      };
    });
    
    // Sort by distance first, then by rating
    ridersWithDistance.sort((a, b) => {
      if (a.distance !== b.distance) {
        return a.distance - b.distance; // Closest first
      }
      return b.rating - a.rating; // Higher rating first
    });
    
    // Return the nearest rider
    return ridersWithDistance[0];
  } catch (error) {
    console.error("Rider assignment error:", error);
    return null;
  }
}

// Auto-assign rider to a ride
async function autoAssignRider(ride) {
  try {
    const nearestRider = await findNearestRider(ride.pickup.lat, ride.pickup.lng);
    
    if (!nearestRider) {
      return { success: false, message: "No riders available" };
    }
    
    // Update ride with assigned rider
    ride.riderId = nearestRider.riderId;
    ride.status = "accepted";
    await ride.save();
    
    return {
      success: true,
      riderId: nearestRider.riderId,
      distance: nearestRider.distance,
      message: `Rider assigned (${nearestRider.distance.toFixed(2)} km away)`
    };
  } catch (error) {
    console.error("Auto-assignment error:", error);
    return { success: false, message: "Assignment failed" };
  }
}

module.exports = {
  findNearestRider,
  autoAssignRider
};
