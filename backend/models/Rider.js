const mongoose = require("mongoose");

const RiderSchema = new mongoose.Schema({
  name: String,
  bikeNumber: String,
  isOnline: Boolean,
  lat: Number,
  lng: Number
});

module.exports = mongoose.model("Rider", RiderSchema);
