import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";
import L from "leaflet";
import API from "../../services/api";
import { socket } from "../../services/socket";
import StatusBadge from "../../components/StatusBadge";
import "leaflet/dist/leaflet.css";

// Fix Leaflet default marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

// Custom icons
const pickupIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const dropIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const riderIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

export default function LiveMap() {
  const { id: rideId } = useParams();
  const navigate = useNavigate();
  const [ride, setRide] = useState(null);
  const [riderLocation, setRiderLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const mapRef = useRef(null);

  useEffect(() => {
    const fetchRide = async () => {
      try {
        const res = await API.get(`/ride/${rideId}`);
        setRide(res.data);
        setLoading(false);

        // Join ride room for real-time updates
        socket.emit("joinRide", rideId);
      } catch (err) {
        console.error("Error fetching ride:", err);
        setLoading(false);
      }
    };

    fetchRide();

    // Listen for rider location updates
    socket.on("riderLocationUpdate", (data) => {
      if (data.rideId === rideId) {
        console.log("📍 Rider location updated:", data.location);
        setRiderLocation(data.location);
      }
    });

    // Listen for ride status updates
    socket.on("rideUpdate", (updatedRide) => {
      if (updatedRide._id === rideId) {
        console.log("🔄 Ride status updated:", updatedRide.status);
        setRide(updatedRide);
      }
    });

    return () => {
      socket.emit("leaveRide", rideId);
      socket.off("riderLocationUpdate");
      socket.off("rideUpdate");
    };
  }, [rideId]);

  if (loading) {
    return (
      <div style={{ padding: "50px", textAlign: "center", color: "white" }}>
        <h3>Loading map...</h3>
      </div>
    );
  }

  if (!ride) {
    return (
      <div style={{ padding: "50px", textAlign: "center", color: "white" }}>
        <h3>Ride not found</h3>
        <button onClick={() => navigate("/my-rides")} className="btn-primary" style={{ marginTop: 20 }}>
          Back to My Rides
        </button>
      </div>
    );
  }

  const pickupCoords = [ride.pickup.lat, ride.pickup.lng];
  const dropCoords = [ride.drop.lat, ride.drop.lng];
  const center = riderLocation 
    ? [riderLocation.lat, riderLocation.lng]
    : [(ride.pickup.lat + ride.drop.lat) / 2, (ride.pickup.lng + ride.drop.lng) / 2];

  // Create route line
  const routePositions = [];
  if (riderLocation) {
    routePositions.push([riderLocation.lat, riderLocation.lng]);
  } else {
    routePositions.push(pickupCoords);
  }
  routePositions.push(dropCoords);

  const calculateDistance = (lat1, lng1, lat2, lng2) => {
    const R = 6371; // Earth's radius in km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLng = ((lng2 - lng1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return (R * c).toFixed(2); // Distance in km
  };

  const distanceToPickup = riderLocation
    ? calculateDistance(riderLocation.lat, riderLocation.lng, ride.pickup.lat, ride.pickup.lng)
    : null;

  const distanceToDrop = riderLocation
    ? calculateDistance(riderLocation.lat, riderLocation.lng, ride.drop.lat, ride.drop.lng)
    : null;

  return (
    <div style={{ padding: "20px", maxWidth: "1200px", margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <h2 style={{ color: "white", margin: 0 }}>
          🗺️ Live Ride Tracking
        </h2>
        <button onClick={() => navigate("/my-rides")} className="btn-secondary">
          ← Back to Rides
        </button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 350px", gap: "20px" }}>
        {/* Map Section */}
        <div style={{ background: "#1e293b", borderRadius: "12px", overflow: "hidden", height: "600px" }}>
          <MapContainer
            center={center}
            zoom={13}
            style={{ height: "100%", width: "100%" }}
            ref={mapRef}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {/* Pickup Marker */}
            <Marker position={pickupCoords} icon={pickupIcon}>
              <Popup>
                <strong>📍 Pickup Location</strong>
                <br />
                {ride.pickup.address}
              </Popup>
            </Marker>

            {/* Drop Marker */}
            <Marker position={dropCoords} icon={dropIcon}>
              <Popup>
                <strong>🏁 Drop Location</strong>
                <br />
                {ride.drop.address}
              </Popup>
            </Marker>

            {/* Rider Marker (Live) */}
            {riderLocation && (
              <Marker position={[riderLocation.lat, riderLocation.lng]} icon={riderIcon}>
                <Popup>
                  <strong>🏍️ Rider Location (Live)</strong>
                  <br />
                  Moving towards destination...
                </Popup>
              </Marker>
            )}

            {/* Route Line */}
            {ride.status === "ongoing" && (
              <Polyline positions={routePositions} color="blue" weight={3} opacity={0.7} dashArray="10, 10" />
            )}
          </MapContainer>
        </div>

        {/* Info Panel */}
        <div>
          <div style={{ background: "#1e293b", padding: "20px", borderRadius: "12px", marginBottom: "15px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 15 }}>
              <h3 style={{ color: "white", margin: 0 }}>Ride #{ride._id.slice(-6)}</h3>
              <StatusBadge status={ride.status} />
            </div>

            <div style={{ color: "#94a3b8", fontSize: "14px", lineHeight: "1.8" }}>
              <div style={{ marginBottom: 10 }}>
                <strong style={{ color: "white" }}>Customer:</strong> {ride.customerName}
              </div>
              <div style={{ marginBottom: 10 }}>
                <strong style={{ color: "white" }}>Phone:</strong> {ride.customerPhone}
              </div>
              <div style={{ marginBottom: 10 }}>
                <strong style={{ color: "white" }}>OTP:</strong>{" "}
                <span style={{ background: "#0f172a", padding: "4px 12px", borderRadius: "6px", fontWeight: "bold", color: "#22c55e" }}>
                  {ride.otp}
                </span>
              </div>
            </div>
          </div>

          <div style={{ background: "#1e293b", padding: "20px", borderRadius: "12px", marginBottom: "15px" }}>
            <h4 style={{ color: "white", marginTop: 0 }}>📍 Route Details</h4>
            <div style={{ color: "#94a3b8", fontSize: "14px", lineHeight: "2" }}>
              <div style={{ marginBottom: 8, paddingBottom: 8, borderBottom: "1px solid #334155" }}>
                <div style={{ color: "#22c55e", fontWeight: "bold" }}>Pickup</div>
                <div>{ride.pickup.address}</div>
              </div>
              <div>
                <div style={{ color: "#ef4444", fontWeight: "bold" }}>Drop</div>
                <div>{ride.drop.address}</div>
              </div>
            </div>
          </div>

          {riderLocation && (
            <div style={{ background: "#1e293b", padding: "20px", borderRadius: "12px", marginBottom: "15px" }}>
              <h4 style={{ color: "white", marginTop: 0 }}>🚴 Live Updates</h4>
              <div style={{ color: "#94a3b8", fontSize: "14px", lineHeight: "1.8" }}>
                <div style={{ marginBottom: 10 }}>
                  <strong style={{ color: "white" }}>Distance to Pickup:</strong>{" "}
                  <span style={{ color: "#22c55e" }}>{distanceToPickup} km</span>
                </div>
                <div style={{ marginBottom: 10 }}>
                  <strong style={{ color: "white" }}>Distance to Drop:</strong>{" "}
                  <span style={{ color: "#ef4444" }}>{distanceToDrop} km</span>
                </div>
                <div style={{ background: "#0f172a", padding: "10px", borderRadius: "6px", marginTop: 10 }}>
                  <div style={{ fontSize: "12px", color: "#64748b", marginBottom: 4 }}>Last Updated</div>
                  <div style={{ color: "#22c55e", fontWeight: "bold" }}>{new Date().toLocaleTimeString()}</div>
                </div>
              </div>
            </div>
          )}

          {!riderLocation && ride.status === "accepted" && (
            <div style={{ background: "#fbbf24", padding: "15px", borderRadius: "8px", color: "#78350f" }}>
              <strong>⏳ Waiting for rider to start...</strong>
              <div style={{ fontSize: "13px", marginTop: 5 }}>
                Rider location will appear when ride starts
              </div>
            </div>
          )}

          {ride.status === "pending" && (
            <div style={{ background: "#3b82f6", padding: "15px", borderRadius: "8px", color: "white" }}>
              <strong>🔍 Finding a rider...</strong>
              <div style={{ fontSize: "13px", marginTop: 5 }}>
                Please wait while we assign a rider
              </div>
            </div>
          )}

          {ride.status === "completed" && (
            <div style={{ background: "#22c55e", padding: "15px", borderRadius: "8px", color: "white" }}>
              <strong>✅ Ride Completed!</strong>
              <div style={{ fontSize: "13px", marginTop: 5 }}>
                Thank you for riding with us
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
