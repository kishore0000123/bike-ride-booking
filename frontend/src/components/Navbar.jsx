import React from "react";
import { Link, useNavigate } from "react-router-dom";
import bikeIcon from "../assets/bike.svg";

export default function Navbar() {
  const navigate = useNavigate();
  const role = localStorage.getItem("role");
  const isLoggedIn = !!localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
  };

  return (
    <nav
      style={{
        backgroundColor: "#1f2937",
        color: "white",
        padding: "1rem 2rem",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
      }}
    >
      <div className="logo">
        <img src={bikeIcon} alt="Bike" style={{ height: 28 }} />
        <span>Bike Ride Booking</span>
      </div>

      <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
        {isLoggedIn ? (
          <>
            {role === "user" && (
              <>
                <Link to="/user-dashboard" style={{ color: "white", textDecoration: "none" }}>
                  Dashboard
                </Link>
                <Link to="/map" style={{ color: "white", textDecoration: "none" }}>
                  Book Ride
                </Link>
              </>
            )}
            {role === "rider" && (
              <Link to="/rider-dashboard" style={{ color: "white", textDecoration: "none" }}>
                Dashboard
              </Link>
            )}
            {role === "admin" && (
              <Link to="/admin-dashboard" style={{ color: "white", textDecoration: "none" }}>
                Admin Panel
              </Link>
            )}
            <button
              onClick={handleLogout}
              style={{
                padding: "0.5rem 1rem",
                backgroundColor: "#ef4444",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                fontWeight: "500"
              }}
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" style={{ color: "white", textDecoration: "none" }}>
              Login
            </Link>
            <Link to="/register" style={{ color: "white", textDecoration: "none" }}>
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
