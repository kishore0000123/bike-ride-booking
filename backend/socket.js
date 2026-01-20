const { Server } = require("socket.io");

let io;

const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: "*",
    },
  });

  io.on("connection", (socket) => {
    console.log("Client connected:", socket.id);

    // Join a specific ride room for real-time updates
    socket.on("joinRide", (rideId) => {
      socket.join(`ride-${rideId}`);
      console.log(`Socket ${socket.id} joined ride-${rideId}`);
    });

    // Leave ride room
    socket.on("leaveRide", (rideId) => {
      socket.leave(`ride-${rideId}`);
      console.log(`Socket ${socket.id} left ride-${rideId}`);
    });

    // Rider sends location update
    socket.on("updateRiderLocation", (data) => {
      const { rideId, location } = data;
      console.log(`📍 Rider location update for ride ${rideId}:`, location);
      
      // Broadcast to all clients in this ride room
      io.to(`ride-${rideId}`).emit("riderLocationUpdate", {
        rideId,
        location,
        timestamp: new Date()
      });
    });

    socket.on("disconnect", () => {
      console.log("Client disconnected:", socket.id);
    });
  });
};

const getIO = () => {
  if (!io) {
    throw new Error("Socket.io not initialized");
  }
  return io;
};

module.exports = { initSocket, getIO };
