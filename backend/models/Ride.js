const mongoose = require("mongoose");

const rideSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  riderId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  customerName: { type: String, required: true },
  customerPhone: { type: String, required: true },
  customerEmail: { type: String, required: true },
  pickup: {
    address: String,
    lat: Number,
    lng: Number
  },
  drop: {
    address: String,
    lat: Number,
    lng: Number
  },
  distance: { type: Number, default: 0 }, // in kilometers
  fare: {
    baseFare: { type: Number, default: 20 },
    distanceFare: { type: Number, default: 0 },
    peakCharge: { type: Number, default: 0 },
    totalFare: { type: Number, default: 20 }
  },
  riderLocation: {
    lat: Number,
    lng: Number,
    lastUpdated: Date
  },
  rating: {
    userRating: { type: Number, min: 0, max: 5 },
    riderRating: { type: Number, min: 0, max: 5 },
    userReview: String,
    riderReview: String
  },
  otp: { type: String, default: () => Math.floor(1000 + Math.random() * 9000).toString() },
  otpVerified: { type: Boolean, default: false },
  status: {
    type: String,
    enum: ["pending", "accepted", "ongoing", "completed", "cancelled"],
    default: "pending"
  }
}, { timestamps: true });

module.exports = mongoose.model("Ride", rideSchema);
