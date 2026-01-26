
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
  getRiderRides,
  getRideById,
  rateRide,
  getAllRides,
  getAdminStats,
  updateRiderLocation
} = require("../controllers/rideController");

/* ===================== USER ROUTES ===================== */

// Book a ride
router.post("/book", protect, bookRide);

// Get logged-in user's rides (User Dashboard)
router.get("/my-rides", protect, getMyRides);

// Cancel a ride (only owner)
router.post("/cancel/:id", protect, cancelRide);

// Rate a ride
router.post("/rate/:id", protect, rateRide);


/* ===================== RIDER ROUTES ===================== */

// Get all pending rides (MUST be before /:id route)
router.get("/pending", protect, getPendingRides);

// Get rider's assigned rides
router.get("/rider-rides", protect, getRiderRides);

// Accept a ride
router.post("/accept/:id", protect, acceptRide);

// Start a ride (move to ongoing)
router.post("/start/:id", protect, startRide);

// Complete a ride
router.post("/complete/:id", protect, completeRide);

// Update rider location during ride
router.post("/update-location/:id", protect, updateRiderLocation);


/* ===================== ADMIN ROUTES ===================== */

// Get all rides (admin)
router.get("/admin/all-rides", protect, getAllRides);

// Get admin statistics
router.get("/admin/stats", protect, getAdminStats);


/* ===================== SHARED ROUTES ===================== */

// Get ride details page (MUST be at the end to avoid catching specific routes)
router.get("/:id", protect, getRideById);

module.exports = router;
