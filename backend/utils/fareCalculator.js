const PricingConfig = require("../models/PricingConfig");

// Haversine formula to calculate distance between two points
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth's radius in kilometers
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  
  return Math.round(distance * 100) / 100; // Round to 2 decimal places
}

function toRad(degrees) {
  return degrees * (Math.PI / 180);
}

// Check if current time is peak hour
function isPeakHour(peakHours) {
  if (!peakHours || peakHours.length === 0) return { isPeak: false, multiplier: 1 };
  
  const now = new Date();
  const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
  
  for (const peak of peakHours) {
    if (currentTime >= peak.start && currentTime <= peak.end) {
      return { isPeak: true, multiplier: peak.multiplier || 1.5 };
    }
  }
  
  return { isPeak: false, multiplier: 1 };
}

// Calculate fare based on distance and pricing config
async function calculateFare(pickupLat, pickupLng, dropLat, dropLng) {
  try {
    // Get pricing config (or use defaults)
    let config = await PricingConfig.findOne({ isActive: true });
    
    if (!config) {
      // Create default config if none exists
      config = await PricingConfig.create({
        baseFare: 20,
        perKmRate: 10,
        peakHours: [
          { start: "08:00", end: "10:00", multiplier: 1.5 },
          { start: "17:00", end: "20:00", multiplier: 1.5 }
        ],
        isActive: true
      });
    }
    
    // Calculate distance
    const distance = calculateDistance(pickupLat, pickupLng, dropLat, dropLng);
    
    // Calculate base fare + distance fare
    const baseFare = config.baseFare;
    const distanceFare = distance * config.perKmRate;
    
    // Check peak hours
    const { isPeak, multiplier } = isPeakHour(config.peakHours);
    const peakCharge = isPeak ? (baseFare + distanceFare) * (multiplier - 1) : 0;
    
    // Calculate total
    const totalFare = Math.round(baseFare + distanceFare + peakCharge);
    
    return {
      distance,
      baseFare,
      distanceFare: Math.round(distanceFare),
      peakCharge: Math.round(peakCharge),
      totalFare,
      isPeakHour: isPeak
    };
  } catch (error) {
    console.error("Fare calculation error:", error);
    // Return default values on error
    return {
      distance: 0,
      baseFare: 20,
      distanceFare: 0,
      peakCharge: 0,
      totalFare: 20,
      isPeakHour: false
    };
  }
}

module.exports = {
  calculateDistance,
  calculateFare,
  isPeakHour
};
