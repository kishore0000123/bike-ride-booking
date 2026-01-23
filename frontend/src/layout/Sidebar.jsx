import { NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import bikeIcon from "../assets/bike.svg";

const Sidebar = () => {
  const navigate = useNavigate();
  const role = localStorage.getItem("role");
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
        </>
      )}

      {role === "rider" && (
        <>
          <NavLink to="/rider-dashboard" end>🏍️ Rider Dashboard</NavLink>
          <NavLink to="/rider-dashboard?status=accepted">⏳ Accepted Rides</NavLink>
          <NavLink to="/rider-dashboard?status=ongoing">🚀 Ongoing Rides</NavLink>
          <NavLink to="/rider-dashboard?status=completed">✅ Completed Rides</NavLink>
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
