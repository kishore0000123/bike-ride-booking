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
  otp: { type: String, default: () => Math.floor(1000 + Math.random() * 9000).toString() },
  status: {
    type: String,
    enum: ["pending", "accepted", "ongoing", "completed", "cancelled"],
    default: "pending"
  }
}, { timestamps: true });

module.exports = mongoose.model("Ride", rideSchema);
