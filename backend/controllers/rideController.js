const Ride = require("../models/Ride");
const Rider = require("../models/Rider");
const { getIO } = require("../socket");
const { sendOTPEmail, sendRideStatusEmail } = require("../services/emailService");
const { calculateFare } = require("../utils/fareCalculator");
const { autoAssignRider } = require("../utils/riderAssignment");

exports.bookRide = async (req, res) => {
  try {
    console.log("Booking request body:", req.body);
    
    // Validate coordinates
    if (!req.body.pickup?.lat || !req.body.pickup?.lng || !req.body.drop?.lat || !req.body.drop?.lng) {
      return res.status(400).json({ message: "Invalid pickup or drop location coordinates" });
    }

    // Calculate fare
    const fareDetails = await calculateFare(
      req.body.pickup.lat,
      req.body.pickup.lng,
      req.body.drop.lat,
      req.body.drop.lng
    );

    console.log("Fare calculated:", fareDetails);

    const ride = await Ride.create({
      userId: req.user._id,
      customerName: req.body.customerName,
      customerPhone: req.body.customerPhone,
      customerEmail: req.body.customerEmail,
      pickup: req.body.pickup,
      drop: req.body.drop,
      distance: fareDetails.distance,
      fare: {
        baseFare: fareDetails.baseFare,
        distanceFare: fareDetails.distanceFare,
        peakCharge: fareDetails.peakCharge,
        totalFare: fareDetails.totalFare
      }
    });

    const populatedRide = await Ride.findById(ride._id)
      .populate("userId", "name email");

    // Send OTP email
    try {
      await sendOTPEmail(
        req.body.customerEmail,
        req.body.customerName,
        ride.otp,
        {
          rideId: ride._id.toString().slice(-6),
          pickup: req.body.pickup.address,
          drop: req.body.drop.address,
          fare: fareDetails.totalFare
        }
      );
    } catch (emailError) {
      console.error("Email send error:", emailError);
      // Continue even if email fails
    }

    // Auto-assign nearest rider
    const assignment = await autoAssignRider(ride);
    if (assignment.success) {
      const updatedRide = await Ride.findById(ride._id)
        .populate("userId", "name email")
        .populate("riderId", "name email");
      getIO().emit("newRide", updatedRide);
      getIO().emit("rideUpdate", updatedRide);
      res.json({ ...updatedRide.toObject(), autoAssigned: true, assignmentMessage: assignment.message });
    } else {
      getIO().emit("newRide", populatedRide);
      res.json({ ...populatedRide.toObject(), autoAssigned: false, assignmentMessage: assignment.message });
    }
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
  ).populate("riderId", "name email");

  // Update rider earnings
  if (ride.riderId && ride.fare && ride.fare.totalFare) {
    await Rider.findOneAndUpdate(
      { userId: ride.riderId._id },
      {
        $inc: {
          completedRides: 1,
          "earnings.today": ride.fare.totalFare,
          "earnings.thisWeek": ride.fare.totalFare,
          "earnings.thisMonth": ride.fare.totalFare,
          "earnings.total": ride.fare.totalFare
        }
      }
    );
  }

  // Send completion email
  if (ride.customerEmail) {
    await sendRideStatusEmail(
      ride.customerEmail,
      ride.customerName,
      "completed",
      { rideId: ride._id.toString().slice(-6), fare: ride.fare.totalFare }
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
    .populate("riderId", "name email")
    .sort({ createdAt: -1 });
  res.json(rides);
};

// Rate a ride
exports.rateRide = async (req, res) => {
  try {
    const { rating, review, ratingType } = req.body; // ratingType: 'user' or 'rider'
    const ride = await Ride.findById(req.params.id);

    if (!ride) {
      return res.status(404).json({ message: "Ride not found" });
    }

    if (ride.status !== "completed") {
      return res.status(400).json({ message: "Can only rate completed rides" });
    }

    if (ratingType === "user") {
      ride.rating.userRating = rating;
      ride.rating.userReview = review;
    } else {
      ride.rating.riderRating = rating;
      ride.rating.riderReview = review;

      // Update rider's average rating
      if (ride.riderId) {
        const riderDoc = await Rider.findOne({ userId: ride.riderId });
        if (riderDoc) {
          const newCount = riderDoc.rating.count + 1;
          const newAverage = ((riderDoc.rating.average * riderDoc.rating.count) + rating) / newCount;
          riderDoc.rating.average = Math.round(newAverage * 10) / 10;
          riderDoc.rating.count = newCount;
          await riderDoc.save();
        }
      }
    }

    await ride.save();
    res.json({ message: "Rating submitted successfully", ride });
  } catch (error) {
    console.error("Rating error:", error);
    res.status(500).json({ message: "Failed to submit rating", error: error.message });
  }
};

// Admin: Get all rides
exports.getAllRides = async (req, res) => {
  try {
    const rides = await Ride.find()
      .populate("userId", "name email")
      .populate("riderId", "name email")
      .sort({ createdAt: -1 });
    res.json(rides);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch rides", error: error.message });
  }
};

// Admin: Get statistics
exports.getAdminStats = async (req, res) => {
  try {
    const User = require("../models/User");
    
    const totalRides = await Ride.countDocuments();
    const completedRides = await Ride.countDocuments({ status: "completed" });
    const ongoingRides = await Ride.countDocuments({ status: "ongoing" });
    const pendingRides = await Ride.countDocuments({ status: "pending" });
    const cancelledRides = await Ride.countDocuments({ status: "cancelled" });
    
    const totalUsers = await User.countDocuments({ role: "user" });
    const totalRiders = await Rider.countDocuments();
    const onlineRiders = await Rider.countDocuments({ isOnline: true });
    
    const totalRevenue = await Ride.aggregate([
      { $match: { status: "completed" } },
      { $group: { _id: null, total: { $sum: "$fare.totalFare" } } }
    ]);

    const todayRevenue = await Ride.aggregate([
      { 
        $match: { 
          status: "completed",
          createdAt: { $gte: new Date(new Date().setHours(0,0,0,0)) }
        } 
      },
      { $group: { _id: null, total: { $sum: "$fare.totalFare" } } }
    ]);

    res.json({
      rides: { total: totalRides, completed: completedRides, ongoing: ongoingRides, pending: pendingRides, cancelled: cancelledRides },
      users: { total: totalUsers },
      riders: { total: totalRiders, online: onlineRiders },
      revenue: { 
        total: totalRevenue[0]?.total || 0,
        today: todayRevenue[0]?.total || 0
      }
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch stats", error: error.message });
  }
};

// Update rider location (real-time tracking)
exports.updateRiderLocation = async (req, res) => {
  try {
    const { lat, lng } = req.body;
    const rideId = req.params.id;

    const ride = await Ride.findByIdAndUpdate(
      rideId,
      {
        riderLocation: {
          lat,
          lng,
          lastUpdated: new Date()
        }
      },
      { new: true }
    ).populate("userId", "name email").populate("riderId", "name email");

    // Also update rider's general location
    await Rider.findOneAndUpdate(
      { userId: req.user._id },
      {
        location: {
          lat,
          lng,
          lastUpdated: new Date()
        }
      }
    );

    getIO().emit("riderLocationUpdate", { rideId, location: { lat, lng } });
    res.json(ride);
  } catch (error) {
    res.status(500).json({ message: "Failed to update location", error: error.message });
  }
};
