import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../services/api";
import { socket } from "../../services/socket";
import StatusBadge from "../../components/StatusBadge";

export default function RiderDashboard() {
  const [rides, setRides] = useState([]);
  const [pendingRides, setPendingRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("accepted");
  const navigate = useNavigate();

  useEffect(() => {
    fetchRides();
    fetchPendingRides();

    // Listen for new ride assignments
    socket.on("rideUpdate", (updatedRide) => {
      fetchRides(); // Refresh the list
      fetchPendingRides();
    });

    socket.on("newRide", (newRide) => {
      fetchPendingRides(); // Refresh pending rides
    });

    return () => {
      socket.off("rideUpdate");
      socket.off("newRide");
    };
  }, []);

  const fetchRides = async () => {
    try {
      const res = await API.get("/ride/rider-rides");
      setRides(res.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching rides:", err);
      setLoading(false);
    }
  };

  const fetchPendingRides = async () => {
    try {
      const res = await API.get("/ride/pending");
      setPendingRides(res.data);
    } catch (err) {
      console.error("Error fetching pending rides:", err);
    }
  };

  const handleAcceptRide = async (rideId) => {
    try {
      await API.post(`/ride/accept/${rideId}`);
      fetchRides();
      fetchPendingRides();
      alert("Ride accepted successfully!");
    } catch (err) {
      console.error("Error accepting ride:", err);
      alert("Failed to accept ride");
    }
  };

  const handleStartRide = async (rideId) => {
    try {
      await API.post(`/ride/start/${rideId}`);
      
      // Start sending location updates
      if (navigator.geolocation) {
        console.log("🌍 Starting location tracking for ride:", rideId);
        const watchId = navigator.geolocation.watchPosition(
          (position) => {
            const location = {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            };
            console.log("📍 Sending location update:", location);
            API.post(`/ride/update-location/${rideId}`, location)
              .then(() => console.log("✅ Location updated successfully"))
              .catch(err => console.error("❌ Location update failed:", err));
          },
          (error) => {
            console.error("Location error:", error);
            alert("Location access denied. Please enable location services.");
          },
          { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
        );
        localStorage.setItem(`watchId-${rideId}`, watchId);
      } else {
        alert("Geolocation is not supported by your browser");
      }

      fetchRides();
      alert("Ride started! Your location is now being tracked.");
    } catch (err) {
      console.error("Error starting ride:", err);
      alert("Failed to start ride");
    }
  };

  const handleCompleteRide = async (rideId) => {
    try {
      const watchId = localStorage.getItem(`watchId-${rideId}`);
      if (watchId) {
        navigator.geolocation.clearWatch(Number(watchId));
        localStorage.removeItem(`watchId-${rideId}`);
      }

      await API.post(`/ride/complete/${rideId}`);
      fetchRides();
      alert("Ride completed successfully!");
    } catch (err) {
      console.error("Error completing ride:", err);
      alert("Failed to complete ride");
    }
  };

  const filteredRides = rides.filter((ride) => {
    if (activeFilter === "all") return true;
    return ride.status === activeFilter;
  });

  const stats = {
    accepted: rides.filter((r) => r.status === "accepted").length,
    ongoing: rides.filter((r) => r.status === "ongoing").length,
    completed: rides.filter((r) => r.status === "completed").length,
  };

  if (loading) {
    return <div style={{ padding: 40, color: "white" }}>Loading...</div>;
  }

  return (
    <div style={{ padding: "30px", background: "#0f0f23", minHeight: "100vh", color: "white" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <h1 style={{ fontSize: 32, fontWeight: "bold", marginBottom: 30, display: "flex", alignItems: "center", gap: 10 }}>
          🏍️ Rider Dashboard
        </h1>

        {/* Pending Rides Section */}
        {pendingRides.length > 0 && (
          <div style={{ marginBottom: 30 }}>
            <h2 style={{ fontSize: 24, fontWeight: "bold", marginBottom: 20, color: "#f59e0b" }}>
              🔔 Available Rides ({pendingRides.length})
            </h2>
            <div style={{ display: "grid", gap: 15 }}>
              {pendingRides.map((ride) => (
                <div
                  key={ride._id}
                  style={{
                    background: "linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)",
                    padding: 20,
                    borderRadius: 12,
                    border: "2px solid #f59e0b",
                    color: "#1a1a2e",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 15 }}>
                    <div>
                      <h3 style={{ fontSize: 18, fontWeight: "bold", marginBottom: 5 }}>
                        Ride #{ride._id.slice(-6).toUpperCase()}
                      </h3>
                      <div style={{ fontSize: 14, color: "#92400e", fontWeight: "600" }}>PENDING - Available to Accept</div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontSize: 24, fontWeight: "bold", color: "#92400e" }}>₹{ride.fare?.totalFare || 0}</div>
                      <div style={{ fontSize: 12, opacity: 0.8 }}>{ride.distance?.toFixed(2) || 0} km</div>
                    </div>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 15, marginBottom: 15 }}>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: "500", marginBottom: 8 }}>
                        <span style={{ opacity: 0.7 }}>Customer Name:</span> {ride.customerName}
                      </div>
                      <div style={{ fontSize: 14, fontWeight: "500" }}>
                        <span style={{ opacity: 0.7 }}>Phone No:</span> {ride.customerPhone}
                      </div>
                    </div>
                    <div>
                      <div style={{ fontSize: 12, opacity: 0.7, marginBottom: 5 }}>Booked</div>
                      <div style={{ fontSize: 14 }}>{new Date(ride.createdAt).toLocaleString()}</div>
                    </div>
                  </div>

                  <div style={{ marginBottom: 15 }}>
                    <div style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 10 }}>
                      <span style={{ fontSize: 18 }}>📍</span>
                      <div>
                        <div style={{ fontSize: 12, opacity: 0.7 }}>Pickup</div>
                        <div style={{ fontSize: 14 }}>{ride.pickup?.address || ride.pickup?.name}</div>
                      </div>
                    </div>
                    <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                      <span style={{ fontSize: 18 }}>🏁</span>
                      <div>
                        <div style={{ fontSize: 12, opacity: 0.7 }}>Drop</div>
                        <div style={{ fontSize: 14 }}>{ride.drop?.address || ride.drop?.name}</div>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleAcceptRide(ride._id)}
                    style={{
                      width: "100%",
                      padding: "12px 24px",
                      borderRadius: 8,
                      border: "none",
                      background: "#92400e",
                      color: "white",
                      fontSize: 16,
                      fontWeight: "bold",
                      cursor: "pointer",
                    }}
                  >
                    ✅ Accept This Ride
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Stats Cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 20, marginBottom: 30 }}>
          <div style={{ background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", padding: 20, borderRadius: 12, cursor: "pointer" }} onClick={() => setActiveFilter("accepted")}>
            <div style={{ fontSize: 14, opacity: 0.9 }}>⏳ Accepted</div>
            <div style={{ fontSize: 32, fontWeight: "bold", marginTop: 8 }}>{stats.accepted}</div>
          </div>
          <div style={{ background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)", padding: 20, borderRadius: 12, cursor: "pointer" }} onClick={() => setActiveFilter("ongoing")}>
            <div style={{ fontSize: 14, opacity: 0.9 }}>🚀 Ongoing</div>
            <div style={{ fontSize: 32, fontWeight: "bold", marginTop: 8 }}>{stats.ongoing}</div>
          </div>
          <div style={{ background: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)", padding: 20, borderRadius: 12, cursor: "pointer" }} onClick={() => setActiveFilter("completed")}>
            <div style={{ fontSize: 14, opacity: 0.9 }}>✅ Completed</div>
            <div style={{ fontSize: 32, fontWeight: "bold", marginTop: 8 }}>{stats.completed}</div>
          </div>
        </div>

        {/* Filter Buttons */}
        <div style={{ display: "flex", gap: 10, marginBottom: 20, flexWrap: "wrap" }}>
          {["all", "accepted", "ongoing", "completed"].map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              style={{
                padding: "10px 20px",
                borderRadius: 8,
                border: "none",
                background: activeFilter === filter ? "#667eea" : "#1a1a2e",
                color: "white",
                cursor: "pointer",
                textTransform: "capitalize",
                fontWeight: activeFilter === filter ? "bold" : "normal",
              }}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* Rides List */}
        <div style={{ display: "grid", gap: 20 }}>
          {filteredRides.length === 0 ? (
            <div style={{ textAlign: "center", padding: 40, background: "#1a1a2e", borderRadius: 12 }}>
              <p style={{ fontSize: 18, opacity: 0.7 }}>No {activeFilter} rides</p>
            </div>
          ) : (
            filteredRides.map((ride) => (
              <div
                key={ride._id}
                style={{
                  background: "#1a1a2e",
                  padding: 25,
                  borderRadius: 12,
                  border: "1px solid #2a2a3e",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 15 }}>
                  <div>
                    <h3 style={{ fontSize: 18, fontWeight: "bold", marginBottom: 5 }}>
                      Ride #{ride._id.slice(-6).toUpperCase()}
                    </h3>
                    <StatusBadge status={ride.status} />
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: 24, fontWeight: "bold", color: "#4facfe" }}>₹{ride.fare?.totalFare || 0}</div>
                    <div style={{ fontSize: 12, opacity: 0.7 }}>{ride.distance?.toFixed(2) || 0} km</div>
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 15, marginBottom: 20 }}>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: "500", marginBottom: 8 }}>
                      <span style={{ opacity: 0.7 }}>Customer Name:</span> {ride.customerName}
                    </div>
                    <div style={{ fontSize: 14, fontWeight: "500" }}>
                      <span style={{ opacity: 0.7 }}>Phone No:</span> {ride.customerPhone}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: 12, opacity: 0.7, marginBottom: 5 }}>Booked</div>
                    <div style={{ fontSize: 14 }}>{new Date(ride.createdAt).toLocaleString()}</div>
                  </div>
                </div>

                <div style={{ marginBottom: 20 }}>
                  <div style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 10 }}>
                    <span style={{ color: "#4ade80", fontSize: 18 }}>📍</span>
                    <div>
                      <div style={{ fontSize: 12, opacity: 0.7 }}>Pickup</div>
                      <div style={{ fontSize: 14 }}>{ride.pickup?.address || ride.pickup?.name}</div>
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                    <span style={{ color: "#f87171", fontSize: 18 }}>📍</span>
                    <div>
                      <div style={{ fontSize: 12, opacity: 0.7 }}>Drop</div>
                      <div style={{ fontSize: 14 }}>{ride.drop?.address || ride.drop?.name}</div>
                    </div>
                  </div>
                </div>

                {ride.otp && (
                  <div style={{ background: "#2a2a3e", padding: 15, borderRadius: 8, marginBottom: 15 }}>
                    <div style={{ fontSize: 12, opacity: 0.7, marginBottom: 5 }}>Ride OTP</div>
                    <div style={{ fontSize: 24, fontWeight: "bold", letterSpacing: 4, color: "#4facfe" }}>{ride.otp}</div>
                  </div>
                )}

                {/* Action Buttons */}
                <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                  {ride.status === "accepted" && (
                    <button
                      onClick={() => handleStartRide(ride._id)}
                      style={{
                        flex: 1,
                        padding: "12px 24px",
                        borderRadius: 8,
                        border: "none",
                        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                        color: "white",
                        fontSize: 16,
                        fontWeight: "bold",
                        cursor: "pointer",
                      }}
                    >
                      🚀 Start Ride
                    </button>
                  )}
                  {ride.status === "ongoing" && (
                    <>
                      <button
                        onClick={() => navigate(`/live-map/${ride._id}`)}
                        style={{
                          flex: 1,
                          padding: "12px 24px",
                          borderRadius: 8,
                          border: "none",
                          background: "#2a2a3e",
                          color: "white",
                          fontSize: 16,
                          cursor: "pointer",
                        }}
                      >
                        🗺️ View Map
                      </button>
                      <button
                        onClick={() => handleCompleteRide(ride._id)}
                        style={{
                          flex: 1,
                          padding: "12px 24px",
                          borderRadius: 8,
                          border: "none",
                          background: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
                          color: "white",
                          fontSize: 16,
                          fontWeight: "bold",
                          cursor: "pointer",
                        }}
                      >
                        ✅ Complete Ride
                      </button>
                    </>
                  )}
                  {ride.status === "completed" && (
                    <div style={{ width: "100%", textAlign: "center", padding: 10, opacity: 0.7 }}>
                      Ride completed successfully
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
