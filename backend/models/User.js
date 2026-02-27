const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: [true, "Name is required"],
    trim: true,
    minlength: [2, "Name must be at least 2 characters"],
    maxlength: [50, "Name cannot exceed 50 characters"]
  },
  email: { 
    type: String, 
    required: [true, "Email is required"],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, "Please provide a valid email"]
  },
  password: { 
    type: String, 
    required: [true, "Password is required"],
    minlength: [6, "Password must be at least 6 characters"]
  },
  role: { 
    type: String, 
    enum: {
      values: ["user", "rider", "admin"],
      message: "Role must be either user, rider, or admin"
    },
    default: "user" 
  }
}, {
  timestamps: true
});

// Index for faster queries
userSchema.index({ email: 1 });

module.exports = mongoose.model("User", userSchema);
