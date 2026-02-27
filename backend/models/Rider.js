const mongoose = require("mongoose");

const RiderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  name: String,
  bikeNumber: String,
  isOnline: { type: Boolean, default: false },
  location: {
    lat: Number,
    lng: Number,
    lastUpdated: Date
  },
  rating: {
    average: { type: Number, default: 5, min: 0, max: 5 },
    count: { type: Number, default: 0 }
  },
  earnings: {
    today: { type: Number, default: 0 },
    thisWeek: { type: Number, default: 0 },
    thisMonth: { type: Number, default: 0 },
    total: { type: Number, default: 0 }
  },
  completedRides: { type: Number, default: 0 }
}, { timestamps: true });

// Indexes for performance
RiderSchema.index({ userId: 1 });
RiderSchema.index({ isOnline: 1 });

module.exports = mongoose.model("Rider", RiderSchema);
