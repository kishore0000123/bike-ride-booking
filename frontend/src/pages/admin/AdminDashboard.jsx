import React from "react";

export default function AdminDashboard() {
  return (
    <div style={{ padding: "20px", maxWidth: "1200px", margin: "0 auto" }}>
      <h1>Admin Dashboard</h1>
      <p style={{ color: "#6b7280" }}>
        Admin features coming soon...
      </p>
      
      <div style={{ 
        marginTop: "2rem", 
        padding: "1.5rem", 
        backgroundColor: "#f3f4f6", 
        borderRadius: "8px" 
      }}>
        <h3>Future Features:</h3>
        <ul>
          <li>View all users and riders</li>
          <li>Monitor ride statistics</li>
          <li>Manage system settings</li>
          <li>Generate reports</li>
        </ul>
      </div>
    </div>
  );
}
