const express = require("express");
const http = require("http");
const cors = require("cors");
const connectDB = require("./config/db");
const { initSocket } = require("./socket");

require("dotenv").config();

const app = express();
const server = http.createServer(app);

// CORS configuration
const corsOptions = {
  origin: process.env.FRONTEND_URL || "http://localhost:3000",
  credentials: true
};

app.use(cors(corsOptions));
app.use(express.json());

connectDB();

// Health check endpoint
app.get("/", (req, res) => {
  res.json({ message: "Bike Ride Booking API Server", status: "running" });
});

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/ride", require("./routes/rideRoutes"));

// 🔥 initialize socket.io
initSocket(server);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
