import { useEffect, useState } from "react";
import API from "../../services/api";
import StatusBadge from "../../components/StatusBadge";

export default function RidersList() {
  const [allRides, setAllRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("pending");

  useEffect(() => {
    fetchRidesHistory();
  }, []);

  const fetchRidesHistory = async () => {
    try {
      const res = await API.get("/ride/my-rides");
      console.log("Fetched rides:", res.data);
      setAllRides(res.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching rides:", err);
      setLoading(false);
    }
  };

  const filteredRides = activeFilter === "all" 
    ? allRides 
    : allRides.filter(ride => ride.status === activeFilter);

  const stats = {
    total: allRides.length,
    pending: allRides.filter(r => r.status === "pending").length,
    accepted: allRides.filter(r => r.status === "accepted").length,
    ongoing: allRides.filter(r => r.status === "ongoing").length,
    completed: allRides.filter(r => r.status === "completed").length,
    cancelled: allRides.filter(r => r.status === "cancelled").length
  };

  const extractCityName = (address) => {
    if (!address) return "N/A";
    // Try to extract city from address
    // Common formats: "Street, City, State" or "Area, City"
    const parts = address.split(',');
    if (parts.length >= 2) {
      // Return the second part (usually the city)
      return parts[1].trim();
    }
    // If no comma, return first 30 characters
    return address.length > 30 ? address.substring(0, 30) + '...' : address;
  };

  if (loading) {
    return (
      <div style={{ padding: "20px" }}>
        <h1 style={{ color: "white" }}>Riders History</h1>
        <p style={{ color: "#94a3b8" }}>Loading ride history...</p>
      </div>
    );
  }

  return (
    <div style={{ padding: "20px" }}>
      <h1 style={{ color: "white", marginBottom: "30px" }}>Complete Ride History</h1>

      {/* Statistics Cards */}
      <div style={{ 
        display: "grid", 
        gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", 
        gap: "15px", 
        marginBottom: "30px" 
      }}>
        <div className="card" style={{ padding: "15px", textAlign: "center", cursor: "pointer", border: activeFilter === "all" ? "2px solid #3b82f6" : "none" }}
          onClick={() => setActiveFilter("all")}>
          <div style={{ fontSize: "24px", fontWeight: "bold", color: "white" }}>{stats.total}</div>
          <div style={{ color: "#94a3b8", fontSize: "14px" }}>Total Rides</div>
        </div>
        <div className="card" style={{ padding: "15px", textAlign: "center", cursor: "pointer", border: activeFilter === "pending" ? "2px solid #f59e0b" : "none" }}
          onClick={() => setActiveFilter("pending")}>
          <div style={{ fontSize: "24px", fontWeight: "bold", color: "#f59e0b" }}>{stats.pending}</div>
          <div style={{ color: "#94a3b8", fontSize: "14px" }}>Pending</div>
        </div>
        <div className="card" style={{ padding: "15px", textAlign: "center", cursor: "pointer", border: activeFilter === "accepted" ? "2px solid #3b82f6" : "none" }}
          onClick={() => setActiveFilter("accepted")}>
          <div style={{ fontSize: "24px", fontWeight: "bold", color: "#3b82f6" }}>{stats.accepted}</div>
          <div style={{ color: "#94a3b8", fontSize: "14px" }}>Accepted</div>
        </div>
        <div className="card" style={{ padding: "15px", textAlign: "center", cursor: "pointer", border: activeFilter === "ongoing" ? "2px solid #8b5cf6" : "none" }}
          onClick={() => setActiveFilter("ongoing")}>
          <div style={{ fontSize: "24px", fontWeight: "bold", color: "#8b5cf6" }}>{stats.ongoing}</div>
          <div style={{ color: "#94a3b8", fontSize: "14px" }}>Ongoing</div>
        </div>
        <div className="card" style={{ padding: "15px", textAlign: "center", cursor: "pointer", border: activeFilter === "completed" ? "2px solid #10b981" : "none" }}
          onClick={() => setActiveFilter("completed")}>
          <div style={{ fontSize: "24px", fontWeight: "bold", color: "#10b981" }}>{stats.completed}</div>
          <div style={{ color: "#94a3b8", fontSize: "14px" }}>Completed</div>
        </div>
        <div className="card" style={{ padding: "15px", textAlign: "center", cursor: "pointer", border: activeFilter === "cancelled" ? "2px solid #ef4444" : "none" }}
          onClick={() => setActiveFilter("cancelled")}>
          <div style={{ fontSize: "24px", fontWeight: "bold", color: "#ef4444" }}>{stats.cancelled}</div>
          <div style={{ color: "#94a3b8", fontSize: "14px" }}>Cancelled</div>
        </div>
      </div>

      {/* Filter Info */}
      {activeFilter !== "all" && (
        <div style={{ marginBottom: "20px", color: "#94a3b8" }}>
          Showing {filteredRides.length} {activeFilter} ride(s) 
          <button 
            onClick={() => setActiveFilter("all")} 
            style={{ marginLeft: "10px", padding: "5px 10px", borderRadius: "5px", background: "#334155", color: "white", border: "none", cursor: "pointer" }}
          >
            Clear Filter
          </button>
        </div>
      )}

      {/* Rides List */}
      {filteredRides.length === 0 ? (
        <p className="empty">No rides found. Book a ride to see history!</p>
      ) : (
        <div style={{ display: "grid", gap: "15px" }}>
          {filteredRides.map((ride) => (
            <div key={ride._id} className="card" style={{ padding: "20px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: "15px" }}>
                <StatusBadge status={ride.status} />
                {ride.otp && (
                  <div style={{ 
                    background: "#fef3c7", 
                    color: "#92400e", 
                    padding: "10px 20px", 
                    borderRadius: "8px",
                    textAlign: "center"
                  }}>
                    <div style={{ fontSize: "12px", fontWeight: "600" }}>OTP</div>
                    <div style={{ fontSize: "24px", fontWeight: "bold", letterSpacing: "2px" }}>{ride.otp}</div>
                  </div>
                )}
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "10px", color: "#94a3b8" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <span style={{ fontSize: "18px" }}>👤</span>
                  <span style={{ fontWeight: "600", color: "#64748b" }}>Customer:</span>
                  <span style={{ marginLeft: "auto", color: "white" }}>{ride.customerName}</span>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <span style={{ fontSize: "18px" }}>📱</span>
                  <span style={{ fontWeight: "600", color: "#64748b" }}>Phone:</span>
                  <span style={{ marginLeft: "auto", color: "white" }}>{ride.customerPhone}</span>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <span style={{ fontSize: "18px", color: "#10b981" }}>📍</span>
                  <span style={{ fontWeight: "600", color: "#64748b" }}>Pickup:</span>
                  <span style={{ marginLeft: "auto", color: "white" }}>
                    {ride.pickup.lat && ride.pickup.lng 
                      ? `Lat: ${ride.pickup.lat.toFixed(4)}, Lng: ${ride.pickup.lng.toFixed(4)}`
                      : extractCityName(ride.pickup.address)}
                  </span>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <span style={{ fontSize: "18px", color: "#ef4444" }}>🏁</span>
                  <span style={{ fontWeight: "600", color: "#64748b" }}>Drop:</span>
                  <span style={{ marginLeft: "auto", color: "white" }}>
                    {ride.drop.lat && ride.drop.lng 
                      ? `Lat: ${ride.drop.lat.toFixed(4)}, Lng: ${ride.drop.lng.toFixed(4)}`
                      : extractCityName(ride.drop.address)}
                  </span>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <span style={{ fontSize: "18px" }}>⏱️</span>
                  <span style={{ fontWeight: "600", color: "#64748b" }}>Booked:</span>
                  <span style={{ marginLeft: "auto", color: "white" }}>
                    {new Date(ride.createdAt).toLocaleString('en-GB', { 
                      day: '2-digit', 
                      month: '2-digit', 
                      year: 'numeric', 
                      hour: '2-digit', 
                      minute: '2-digit', 
                      second: '2-digit' 
                    })}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
