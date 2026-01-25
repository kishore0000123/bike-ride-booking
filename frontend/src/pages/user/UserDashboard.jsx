import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

export default function UserDashboard() {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const name = localStorage.getItem("userName") || "User";
    setUserName(name);
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <div style={{ marginBottom: "20px", padding: "20px", background: "#1e293b", borderRadius: "12px" }}>
        <h2 style={{ color: "white", margin: "0 0 10px 0" }}>Welcome, {userName}!</h2>
        <p style={{ color: "#94a3b8", margin: 0 }}>Book your bike ride easily</p>
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
      </div>
    </div>
  );
}
