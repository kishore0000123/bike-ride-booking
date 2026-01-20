const Ride = require("../models/Ride");
const { getIO } = require("../socket");
const { sendOTPEmail, sendRideStatusEmail } = require("../services/emailService");

exports.bookRide = async (req, res) => {
  try {
    const ride = await Ride.create({
      userId: req.user._id,
      customerName: req.body.customerName,
      customerPhone: req.body.customerPhone,
      customerEmail: req.body.customerEmail,
      pickup: req.body.pickup,
      drop: req.body.drop
    });

    const populatedRide = await Ride.findById(ride._id)
      .populate("userId", "name email");

    // Send OTP email
    await sendOTPEmail(
      req.body.customerEmail,
      req.body.customerName,
      ride.otp,
      {
        rideId: ride._id.toString().slice(-6),
        pickup: req.body.pickup.address,
        drop: req.body.drop.address
      }
    );

    getIO().emit("newRide", populatedRide);
    res.json(populatedRide);
  } catch (error) {
    console.error("Error booking ride:", error);
    res.status(500).json({ message: "Failed to book ride", error: error.message });
  }
};

exports.getMyRides = async (req, res) => {
  const rides = await Ride.find({ userId: req.user._id })
    .populate("riderId", "name email")
    .sort({ createdAt: -1 });
  res.json(rides);
};

exports.getRideById = async (req, res) => {
  const ride = await Ride.findById(req.params.id)
    .populate("userId", "name email")
    .populate("riderId", "name email");

  if (!ride) return res.status(404).json({ msg: "Ride not found" });
  res.json(ride);
};

exports.cancelRide = async (req, res) => {
  const ride = await Ride.findByIdAndUpdate(
    req.params.id,
    { status: "cancelled" },
    { new: true }
  );

  // Send cancellation email
  if (ride.customerEmail) {
    await sendRideStatusEmail(
      ride.customerEmail,
      ride.customerName,
      "cancelled",
      { rideId: ride._id.toString().slice(-6) }
    );
  }

  getIO().emit("rideUpdate", ride);
  res.json(ride);
};

exports.acceptRide = async (req, res) => {
  const ride = await Ride.findByIdAndUpdate(
    req.params.id,
    { riderId: req.user._id, status: "accepted" },
    { new: true }
  )
  .populate("riderId", "name email");

  // Send acceptance email
  if (ride.customerEmail) {
    await sendRideStatusEmail(
      ride.customerEmail,
      ride.customerName,
      "accepted",
      { rideId: ride._id.toString().slice(-6) }
    );
  }

  getIO().emit("rideUpdate", ride);
  res.json(ride);
};

exports.startRide = async (req, res) => {
  const ride = await Ride.findByIdAndUpdate(
    req.params.id,
    { status: "ongoing" },
    { new: true }
  )
  .populate("riderId", "name email")
  .populate("userId", "name email");

  // Send ride started email
  if (ride.customerEmail) {
    await sendRideStatusEmail(
      ride.customerEmail,
      ride.customerName,
      "ongoing",
      { rideId: ride._id.toString().slice(-6) }
    );
  }

  getIO().emit("rideUpdate", ride);
  res.json(ride);
};

exports.completeRide = async (req, res) => {
  const ride = await Ride.findByIdAndUpdate(
    req.params.id,
    { status: "completed" },
    { new: true }
  );

  // Send completion email
  if (ride.customerEmail) {
    await sendRideStatusEmail(
      ride.customerEmail,
      ride.customerName,
      "completed",
      { rideId: ride._id.toString().slice(-6) }
    );
  }

  getIO().emit("rideUpdate", ride);
  res.json(ride);
};

exports.getPendingRides = async (_, res) => {
  const rides = await Ride.find({ 
    status: { $in: ["pending", "accepted", "ongoing", "cancelled"] }
  })
    .populate("userId", "name email")
    .sort({ createdAt: -1 });
  res.json(rides);
};
