import React from "react";
import StatusBadge from "./StatusBadge";

export default function RideCard({
  ride,
  onAccept,
  onComplete,
  onCancel,
  showActions
}) {
  // 🛑 HARD SAFETY CHECK (prevents crash)
  if (!ride || !ride.pickup || !ride.drop) {
    return null;
  }

  return (
    <div className="card ride-card">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: "12px" }}>
        <div>
          <h3 style={{ margin: "0 0 8px 0" }}>Ride #{ride._id.slice(-6)}</h3>
          <StatusBadge status={ride.status} />
        </div>
        {ride.otp && ride.status === "accepted" && (
          <div style={{ background: "#fef3c7", padding: "8px 12px", borderRadius: "6px", textAlign: "center" }}>
            <div style={{ fontSize: "11px", color: "#92400e", fontWeight: "600" }}>OTP</div>
            <div style={{ fontSize: "20px", color: "#92400e", fontWeight: "bold", letterSpacing: "2px" }}>{ride.otp}</div>
          </div>
        )}
      </div>

      <div className="ride-details">
        <div className="detail-row">
          <span className="label">👤 Customer:</span>
          <span className="value">{ride.customerName || ride.userId?.name || "N/A"}</span>
        </div>

        <div className="detail-row">
          <span className="label">📱 Phone:</span>
          <span className="value">{ride.customerPhone || "N/A"}</span>
        </div>

        <div className="detail-row">
          <span className="label">📍 Pickup:</span>
          <span className="value">{ride.pickup.address || `${ride.pickup.lat?.toFixed(4)}, ${ride.pickup.lng?.toFixed(4)}`}</span>
        </div>

        <div className="detail-row">
          <span className="label">🏁 Drop:</span>
          <span className="value">{ride.drop.address || `${ride.drop.lat?.toFixed(4)}, ${ride.drop.lng?.toFixed(4)}`}</span>
        </div>

        {ride.createdAt && (
          <div className="detail-row">
            <span className="label">🕐 Booked:</span>
            <span className="value">{new Date(ride.createdAt).toLocaleString()}</span>
          </div>
        )}
      </div>

      {ride.riderId && (
        <div className="rider-info">
          <p style={{ margin: "4px 0", fontWeight: "600", color: "#059669" }}>✅ Rider Assigned</p>
          <p style={{ margin: "4px 0" }}><strong>Name:</strong> {ride.riderId.name}</p>
          <p style={{ margin: "4px 0" }}><strong>Contact:</strong> {ride.riderId.email}</p>
        </div>
      )}

      {showActions && (
        <div style={{ marginTop: 10 }}>
          {ride.status === "pending" && onAccept && (
            <button className="btn-primary" onClick={() => onAccept(ride._id)}>
              Accept
            </button>
          )}

          {ride.status === "accepted" && onComplete && (
            <button className="btn-primary" onClick={() => onComplete(ride._id)}>
              Complete
            </button>
          )}

          {(ride.status === "pending" || ride.status === "accepted") &&
            onCancel && (
              <button className="btn-danger" onClick={() => onCancel(ride._id)}>
                Cancel
              </button>
            )}
        </div>
      )}
    </div>
  );
}
