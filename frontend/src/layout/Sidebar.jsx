import { NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import bikeIcon from "../assets/bike.svg";

const Sidebar = () => {
  const navigate = useNavigate();
  const role = localStorage.getItem("role");
  const [myRidesOpen, setMyRidesOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
  };

  return (
    <div className="sidebar">
      <button 
        onClick={() => setMenuOpen(!menuOpen)}
        style={{
          background: "transparent",
          border: "none",
          color: "white",
          fontSize: "28px",
          cursor: "pointer",
          padding: "20px",
          width: "100%",
          textAlign: "left"
        }}
      >
        ☰
      </button>

      {menuOpen && (
        <>
          <div className="logo">
            <img src={bikeIcon} alt="Bike" style={{ height: 32 }} />
            <h2>Bike Ride</h2>
          </div>

      {role === "user" && (
        <>
          <NavLink to="/dashboard" end>📊 Dashboard</NavLink>
          <NavLink to="/map">🗺️ Book Ride</NavLink>
          
          <div 
            className="menu-item" 
            onClick={() => setMyRidesOpen(!myRidesOpen)}
            style={{ cursor: "pointer", padding: "12px 20px", color: "#94a3b8", display: "flex", justifyContent: "space-between", alignItems: "center" }}
          >
            <span>🚴 My Rides</span>
            <span style={{ fontSize: "12px" }}>{myRidesOpen ? "▼" : "▶"}</span>
          </div>
          
          {myRidesOpen && (
            <div style={{ paddingLeft: "20px" }}>
              <NavLink to="/my-rides?status=pending" className="sub-menu-link">⏳ Pending</NavLink>
              <NavLink to="/my-rides?status=accepted" className="sub-menu-link">✅ Accepted</NavLink>
              <NavLink to="/my-rides?status=cancelled" className="sub-menu-link">❌ Cancelled</NavLink>
              <NavLink to="/my-rides?status=completed" className="sub-menu-link">✔️ Completed</NavLink>
            </div>
          )}

          <NavLink to="/riders-list">👥 Riders History</NavLink>
        </>
      )}

      {role === "rider" && (
        <>
          <NavLink to="/rider-dashboard" end>📊 Dashboard</NavLink>
          <NavLink to="/rider-dashboard?tab=pending">⏳ Pending Rides</NavLink>
          <NavLink to="/rider-dashboard?tab=accepted">✅ Accepted Rides</NavLink>
          <NavLink to="/rider-dashboard?tab=cancelled">❌ Cancelled</NavLink>
        </>
      )}

      {role === "admin" && (
        <>
          <NavLink to="/admin-dashboard" end>📊 Dashboard</NavLink>
          <NavLink to="/drivers">🚴 Drivers</NavLink>
          <NavLink to="/vehicles">🚲 Vehicles</NavLink>
          <NavLink to="/live-map">🗺️ Live Map</NavLink>
          <NavLink to="/performance">📈 Performance</NavLink>
          <NavLink to="/incentives">💰 Incentives</NavLink>
          <NavLink to="/banking">🏦 Banking</NavLink>
          <NavLink to="/quality">✔️ Quality Check</NavLink>
        </>
      )}

          <div className="sidebar-footer">
            <button onClick={handleLogout} className="logout-btn">
              🚪 Logout
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Sidebar;
