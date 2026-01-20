const mongoose = require("mongoose");

const pricingConfigSchema = new mongoose.Schema({
  baseFare: { type: Number, default: 20 },
  perKmRate: { type: Number, default: 10 },
  peakHours: [{
    start: String, // e.g., "08:00"
    end: String,   // e.g., "10:00"
    multiplier: { type: Number, default: 1.5 }
  }],
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model("PricingConfig", pricingConfigSchema);
