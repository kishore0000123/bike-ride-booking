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
      setAllRides(res.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
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
                <div>
                  <h3 style={{ margin: "0 0 5px 0", color: "white" }}>
                    Ride #{ride._id.slice(-6)}
                  </h3>
                  <p style={{ margin: "5px 0", color: "#94a3b8", fontSize: "14px" }}>
                    📅 {new Date(ride.createdAt).toLocaleString()}
                  </p>
                </div>
                <StatusBadge status={ride.status} />
              </div>

              {/* Customer Details */}
              <div style={{ 
                background: "#1e293b", 
                padding: "15px", 
                borderRadius: "8px", 
                marginBottom: "15px" 
              }}>
                <h4 style={{ margin: "0 0 10px 0", color: "#94a3b8", fontSize: "14px" }}>Customer Details</h4>
                <p style={{ margin: "5px 0", color: "white" }}>👤 {ride.customerName}</p>
                <p style={{ margin: "5px 0", color: "#94a3b8" }}>📞 {ride.customerPhone}</p>
                <p style={{ margin: "5px 0", color: "#94a3b8" }}>📧 {ride.customerEmail}</p>
                {ride.otp && (
                  <p style={{ margin: "5px 0", color: "#f59e0b", fontWeight: "bold" }}>🔐 OTP: {ride.otp}</p>
                )}
              </div>

              {/* Rider Details */}
              {ride.riderId && (
                <div style={{ 
                  background: "#1e293b", 
                  padding: "15px", 
                  borderRadius: "8px", 
                  marginBottom: "15px" 
                }}>
                  <h4 style={{ margin: "0 0 10px 0", color: "#94a3b8", fontSize: "14px" }}>Rider Details</h4>
                  <p style={{ margin: "5px 0", color: "white" }}>🚴 {ride.riderId.name}</p>
                  <p style={{ margin: "5px 0", color: "#94a3b8" }}>📧 {ride.riderId.email}</p>
                </div>
              )}

              {/* Location Details */}
              <div style={{ 
                background: "#1e293b", 
                padding: "15px", 
                borderRadius: "8px" 
              }}>
                <h4 style={{ margin: "0 0 10px 0", color: "#94a3b8", fontSize: "14px" }}>Route Details</h4>
                <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
                  <div>
                    <p style={{ margin: "0", color: "#10b981", fontWeight: "bold", fontSize: "14px" }}>📍 Pickup</p>
                  </div>
                  <div>
                    <p style={{ margin: "0", color: "#ef4444", fontWeight: "bold", fontSize: "14px" }}>📍 Drop</p>
                  </div>
                </div>
              </div>

              {/* Timestamps */}
              {ride.updatedAt && (
                <div style={{ marginTop: "15px", paddingTop: "15px", borderTop: "1px solid #334155" }}>
                  <p style={{ margin: "0", color: "#64748b", fontSize: "12px" }}>
                    Last updated: {new Date(ride.updatedAt).toLocaleString()}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
