import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import API from "../../services/api";

export default function Dashboard() {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("");
  const [userPhone, setUserPhone] = useState("");

  useEffect(() => {
    // Get user info
    const name = localStorage.getItem("userName") || "User";
    setUserName(name);
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <div style={{ marginBottom: "20px", padding: "20px", background: "#1e293b", borderRadius: "12px" }}>
        <h2 style={{ color: "white", margin: "0 0 10px 0" }}>Welcome, {userName}!</h2>
        <p style={{ color: "#94a3b8", margin: 0 }}>Manage your rides and bookings</p>
      </div>
      
      <div style={{ 
        display: "flex", 
        justifyContent: "center", 
        alignItems: "center", 
        minHeight: "50vh",
        flexDirection: "column",
        gap: "30px"
      }}>
        <div>
          <p style={{ color: "#94a3b8", fontSize: "18px", textAlign: "center", marginBottom: "20px" }}>
            Ready to book your ride?
          </p>
          <button 
            className="btn-primary" 
            onClick={() => navigate("/map")}
            style={{ padding: "20px 40px", fontSize: "18px", width: "100%" }}
          >
            📍 Book New Ride
          </button>
        </div>

        <div style={{ width: "100%", maxWidth: "400px" }}>
          <p style={{ color: "#94a3b8", fontSize: "16px", textAlign: "center", marginBottom: "15px" }}>
            Quick Access to Your Rides
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" }}>
            <button 
              className="btn-secondary" 
              onClick={() => navigate("/my-rides?status=pending")}
              style={{ padding: "15px", fontSize: "15px" }}
            >
              ⏳ Pending
            </button>
            <button 
              className="btn-secondary" 
              onClick={() => navigate("/my-rides?status=accepted")}
              style={{ padding: "15px", fontSize: "15px" }}
            >
              ✅ Accepted
            </button>
            <button 
              className="btn-secondary" 
              onClick={() => navigate("/my-rides?status=cancelled")}
              style={{ padding: "15px", fontSize: "15px" }}
            >
              ❌ Cancelled
            </button>
            <button 
              className="btn-secondary" 
              onClick={() => navigate("/my-rides?status=completed")}
              style={{ padding: "15px", fontSize: "15px" }}
            >
              ✔️ Completed
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
