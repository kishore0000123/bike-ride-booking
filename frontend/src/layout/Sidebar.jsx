import { NavLink } from "react-router-dom";
import { useState } from "react";
import bikeIcon from "../assets/bike.svg";
import { logout } from "../utils/auth";

const Sidebar = () => {
  const role = localStorage.getItem("role");
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
  };

  const closeMenu = () => setMenuOpen(false);

  return (
    <div className={`sidebar ${menuOpen ? "open" : ""}`}>
      <button 
        onClick={() => setMenuOpen(!menuOpen)}
        className="hamburger-btn"
      >
        ☰
      </button>

      <div className="logo">
        <img src={bikeIcon} alt="Bike" style={{ height: 32 }} />
        <h2>Bike Ride</h2>
      </div>

      {role === "user" && (
        <>
          <NavLink to="/user-dashboard" end onClick={closeMenu}>📊 Dashboard</NavLink>
          <NavLink to="/map" onClick={closeMenu}>🗺️ Book Ride</NavLink>
          <NavLink to="/user-dashboard" onClick={closeMenu}>🧾 My Rides</NavLink>
        </>
      )}

      {role === "rider" && (
        <>
          <NavLink to="/rider-dashboard" end onClick={closeMenu}>🏍️ Rider Dashboard</NavLink>
        </>
      )}

      {role === "admin" && (
        <>
          <NavLink to="/admin-dashboard" end onClick={closeMenu}>📊 Dashboard</NavLink>
          <NavLink to="/admin-operations" onClick={closeMenu}>🗺️ Operations</NavLink>
          <NavLink to="/drivers" onClick={closeMenu}>🏍️ Riders</NavLink>
          <NavLink to="/vehicles" onClick={closeMenu}>🚲 Vehicles</NavLink>
          <NavLink to="/performance" onClick={closeMenu}>📈 Performance</NavLink>
          <NavLink to="/incentives" onClick={closeMenu}>💰 Incentives</NavLink>
          <NavLink to="/banking" onClick={closeMenu}>🏦 Banking</NavLink>
          <NavLink to="/quality" onClick={closeMenu}>✔️ Quality</NavLink>
        </>
      )}

      <div className="sidebar-footer">
        <button onClick={handleLogout} className="logout-btn">
          🚪 Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
