const express = require("express");
const http = require("http");
const cors = require("cors");
const connectDB = require("./config/db");
const { initSocket } = require("./socket");

require("dotenv").config();

const app = express();
const server = http.createServer(app);

app.use(cors());
app.use(express.json());

connectDB();

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/ride", require("./routes/rideRoutes"));

// 🔥 initialize socket.io
initSocket(server);

server.listen(5000, () => console.log("Server running on 5000"));
