
const router = require("express").Router();
const { protect } = require("../middleware/authMiddleware");
const {
  bookRide,
  acceptRide,
  startRide,
  completeRide,
  cancelRide,
  getPendingRides,
  getMyRides,
  getRideById
} = require("../controllers/rideController");

/* ===================== USER ROUTES ===================== */

// Book a ride
router.post("/book", protect, bookRide);

// Get logged-in user's rides (User Dashboard)
router.get("/my-rides", protect, getMyRides);

// Cancel a ride (only owner)
router.post("/cancel/:id", protect, cancelRide);

// Get ride details page
router.get("/:id", protect, getRideById);


/* ===================== RIDER ROUTES ===================== */

// Get all pending rides
router.get("/pending", protect, getPendingRides);

// Accept a ride
router.post("/accept/:id", protect, acceptRide);

// Start a ride (move to ongoing)
router.post("/start/:id", protect, startRide);

// Complete a ride
router.post("/complete/:id", protect, completeRide);

module.exports = router;
