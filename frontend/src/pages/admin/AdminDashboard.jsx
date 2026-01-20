import { useEffect, useState } from "react";
import API from "../../services/api";

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [allRides, setAllRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      const [statsRes, ridesRes] = await Promise.all([
        API.get("/ride/admin/stats"),
        API.get("/ride/admin/all-rides")
      ]);
      
      setStats(statsRes.data);
      setAllRides(ridesRes.data);
      setLoading(false);
    } catch (error) {
      console.error("Admin data fetch error:", error);
      setLoading(false);
    }
  };

  if (loading) {
    return <div style={{ padding: "20px", color: "white" }}>Loading admin dashboard...</div>;
  }

  return (
    <div style={{ padding: "20px" }}>
      <h1 style={{ color: "white", marginBottom: "30px" }}>🎯 Admin Dashboard</h1>

      {/* Statistics Overview */}
      <div style={{ 
        display: "grid", 
        gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", 
        gap: "20px", 
        marginBottom: "30px" 
      }}>
        <div className="card" style={{ padding: "20px", background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" }}>
          <div style={{ fontSize: "14px", color: "#e0e7ff", marginBottom: "5px" }}>Total Rides</div>
          <div style={{ fontSize: "32px", fontWeight: "bold", color: "white" }}>{stats?.rides.total || 0}</div>
        </div>

        <div className="card" style={{ padding: "20px", background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)" }}>
          <div style={{ fontSize: "14px", color: "#fce7f3", marginBottom: "5px" }}>Completed Rides</div>
          <div style={{ fontSize: "32px", fontWeight: "bold", color: "white" }}>{stats?.rides.completed || 0}</div>
        </div>

        <div className="card" style={{ padding: "20px", background: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)" }}>
          <div style={{ fontSize: "14px", color: "#e0f2fe", marginBottom: "5px" }}>Ongoing Rides</div>
          <div style={{ fontSize: "32px", fontWeight: "bold", color: "white" }}>{stats?.rides.ongoing || 0}</div>
        </div>

        <div className="card" style={{ padding: "20px", background: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)" }}>
          <div style={{ fontSize: "14px", color: "#fef3c7", marginBottom: "5px" }}>Pending Rides</div>
          <div style={{ fontSize: "32px", fontWeight: "bold", color: "white" }}>{stats?.rides.pending || 0}</div>
        </div>

        <div className="card" style={{ padding: "20px", background: "linear-gradient(135deg, #30cfd0 0%, #330867 100%)" }}>
          <div style={{ fontSize: "14px", color: "#ccfbf1", marginBottom: "5px" }}>Total Users</div>
          <div style={{ fontSize: "32px", fontWeight: "bold", color: "white" }}>{stats?.users.total || 0}</div>
        </div>

        <div className="card" style={{ padding: "20px", background: "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)" }}>
          <div style={{ fontSize: "14px", color: "#1e293b", marginBottom: "5px" }}>Total Riders</div>
          <div style={{ fontSize: "32px", fontWeight: "bold", color: "#1e293b" }}>{stats?.riders.total || 0}</div>
        </div>

        <div className="card" style={{ padding: "20px", background: "linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)" }}>
          <div style={{ fontSize: "14px", color: "#1e293b", marginBottom: "5px" }}>Online Riders</div>
          <div style={{ fontSize: "32px", fontWeight: "bold", color: "#1e293b" }}>{stats?.riders.online || 0}</div>
        </div>

        <div className="card" style={{ padding: "20px", background: "linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)" }}>
          <div style={{ fontSize: "14px", color: "#1e293b", marginBottom: "5px" }}>Total Revenue</div>
          <div style={{ fontSize: "32px", fontWeight: "bold", color: "#1e293b" }}>₹{stats?.revenue.total || 0}</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs" style={{ marginBottom: "20px" }}>
        <button
          className={activeTab === "overview" ? "active" : ""}
          onClick={() => setActiveTab("overview")}
        >
          Overview
        </button>
        <button
          className={activeTab === "rides" ? "active" : ""}
          onClick={() => setActiveTab("rides")}
        >
          All Rides ({allRides.length})
        </button>
      </div>

      {/* All Rides Table */}
      {activeTab === "rides" && (
        <div className="card" style={{ padding: "20px", overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", color: "white" }}>
            <thead>
              <tr style={{ borderBottom: "2px solid #334155" }}>
                <th style={{ padding: "10px", textAlign: "left" }}>ID</th>
                <th style={{ padding: "10px", textAlign: "left" }}>Customer</th>
                <th style={{ padding: "10px", textAlign: "left" }}>Rider</th>
                <th style={{ padding: "10px", textAlign: "left" }}>Distance</th>
                <th style={{ padding: "10px", textAlign: "left" }}>Fare</th>
                <th style={{ padding: "10px", textAlign: "left" }}>Status</th>
                <th style={{ padding: "10px", textAlign: "left" }}>Date</th>
              </tr>
            </thead>
            <tbody>
              {allRides.map((ride) => (
                <tr key={ride._id} style={{ borderBottom: "1px solid #334155" }}>
                  <td style={{ padding: "10px" }}>#{ride._id.slice(-6)}</td>
                  <td style={{ padding: "10px" }}>{ride.customerName}</td>
                  <td style={{ padding: "10px" }}>{ride.riderId?.name || "Not assigned"}</td>
                  <td style={{ padding: "10px" }}>{ride.distance ? `${ride.distance} km` : "N/A"}</td>
                  <td style={{ padding: "10px" }}>₹{ride.fare?.totalFare || 0}</td>
                  <td style={{ padding: "10px" }}>
                    <span style={{
                      padding: "4px 8px",
                      borderRadius: "4px",
                      fontSize: "12px",
                      background: 
                        ride.status === "completed" ? "#10b981" :
                        ride.status === "ongoing" ? "#8b5cf6" :
                        ride.status === "accepted" ? "#3b82f6" :
                        ride.status === "cancelled" ? "#ef4444" : "#f59e0b",
                      color: "white"
                    }}>
                      {ride.status.toUpperCase()}
                    </span>
                  </td>
                  <td style={{ padding: "10px" }}>{new Date(ride.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Overview Charts */}
      {activeTab === "overview" && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
          <div className="card" style={{ padding: "20px" }}>
            <h3 style={{ color: "white", marginBottom: "15px" }}>📊 Ride Status Breakdown</h3>
            <div style={{ color: "#94a3b8" }}>
              <div style={{ marginBottom: "10px", display: "flex", justifyContent: "space-between" }}>
                <span>Completed:</span>
                <span style={{ color: "#10b981", fontWeight: "bold" }}>{stats?.rides.completed || 0}</span>
              </div>
              <div style={{ marginBottom: "10px", display: "flex", justifyContent: "space-between" }}>
                <span>Ongoing:</span>
                <span style={{ color: "#8b5cf6", fontWeight: "bold" }}>{stats?.rides.ongoing || 0}</span>
              </div>
              <div style={{ marginBottom: "10px", display: "flex", justifyContent: "space-between" }}>
                <span>Pending:</span>
                <span style={{ color: "#f59e0b", fontWeight: "bold" }}>{stats?.rides.pending || 0}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span>Cancelled:</span>
                <span style={{ color: "#ef4444", fontWeight: "bold" }}>{stats?.rides.cancelled || 0}</span>
              </div>
            </div>
          </div>

          <div className="card" style={{ padding: "20px" }}>
            <h3 style={{ color: "white", marginBottom: "15px" }}>💰 Revenue Insights</h3>
            <div style={{ color: "#94a3b8" }}>
              <div style={{ marginBottom: "10px", display: "flex", justifyContent: "space-between" }}>
                <span>Today's Revenue:</span>
                <span style={{ color: "#10b981", fontWeight: "bold" }}>₹{stats?.revenue.today || 0}</span>
              </div>
              <div style={{ marginBottom: "10px", display: "flex", justifyContent: "space-between" }}>
                <span>Total Revenue:</span>
                <span style={{ color: "#3b82f6", fontWeight: "bold" }}>₹{stats?.revenue.total || 0}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span>Avg per Ride:</span>
                <span style={{ color: "#f59e0b", fontWeight: "bold" }}>
                  ₹{stats?.rides.completed > 0 ? Math.round(stats.revenue.total / stats.rides.completed) : 0}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
