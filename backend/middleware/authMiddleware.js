const jwt = require("jsonwebtoken");
const User = require("../models/User");

/**
 * Protect routes - verify JWT token
 */
exports.protect = async (req, res, next) => {
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({ message: "Not authorized, no token" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = await User.findById(decoded.id).select("-password");

    next();
  } catch (error) {
    console.error("AUTH ERROR:", error.message);
    return res.status(401).json({ message: "Not authorized, token failed" });
  }
};

/**
 * Admin only middleware - restrict to admin users
 */
exports.adminOnly = async (req, res, next) => {
  try {
    if (req.user && req.user.role === "admin") {
      next();
    } else {
      return res.status(403).json({ 
        message: "Access denied. Admin privileges required." 
      });
    }
  } catch (error) {
    console.error("ADMIN AUTH ERROR:", error.message);
    return res.status(403).json({ message: "Access denied" });
  }
};

/**
 * Rider only middleware - restrict to riders
 */
exports.riderOnly = async (req, res, next) => {
  try {
    if (req.user && req.user.role === "rider") {
      next();
    } else {
      return res.status(403).json({ 
        message: "Access denied. Rider privileges required." 
      });
    }
  } catch (error) {
    console.error("RIDER AUTH ERROR:", error.message);
    return res.status(403).json({ message: "Access denied" });
  }
};

/**
 * User only middleware - restrict to regular users
 */
exports.userOnly = async (req, res, next) => {
  try {
    if (req.user && req.user.role === "user") {
      next();
    } else {
      return res.status(403).json({ 
        message: "Access denied. User privileges required." 
      });
    }
  } catch (error) {
    console.error("USER AUTH ERROR:", error.message);
    return res.status(403).json({ message: "Access denied" });
  }
};
