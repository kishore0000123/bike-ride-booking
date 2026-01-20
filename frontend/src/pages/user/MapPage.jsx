import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet";
import L from "leaflet";
import API from "../../services/api";
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

// Component to handle map clicks
function LocationPicker({ onLocationSelect, selectingFor }) {
  useMapEvents({
    click(e) {
      if (selectingFor) {
        onLocationSelect(e.latlng);
      }
    },
  });
  return null;
}

export default function MapPage() {
  const [step, setStep] = useState(1); // 1=details, 2=map
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [pickupLocation, setPickupLocation] = useState(null);
  const [dropLocation, setDropLocation] = useState(null);
  const [pickupAddress, setPickupAddress] = useState("");
  const [dropAddress, setDropAddress] = useState("");
  const [selectingFor, setSelectingFor] = useState("pickup"); // "pickup" or "drop"
  const [booking, setBooking] = useState(false);
  const navigate = useNavigate();
  const mapRef = useRef(null);

  const proceedToLocations = () => {
    if (!customerName || !customerPhone || !customerEmail) {
      alert("Please enter your name, phone number, and email");
      return;
    }
    if (!/^\d{10}$/.test(customerPhone)) {
      alert("Please enter a valid 10-digit phone number");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerEmail)) {
      alert("Please enter a valid email address");
      return;
    }
    setStep(2);
  };

  const handleLocationSelect = (latlng) => {
    if (selectingFor === "pickup") {
      setPickupLocation(latlng);
      setPickupAddress(`Lat: ${latlng.lat.toFixed(4)}, Lng: ${latlng.lng.toFixed(4)}`);
      setSelectingFor("drop"); // Auto-switch to drop selection
    } else {
      setDropLocation(latlng);
      setDropAddress(`Lat: ${latlng.lat.toFixed(4)}, Lng: ${latlng.lng.toFixed(4)}`);
      setSelectingFor(null); // Done selecting
    }
  };

  const resetPickup = () => {
    setPickupLocation(null);
    setPickupAddress("");
    setSelectingFor("pickup");
  };

  const resetDrop = () => {
    setDropLocation(null);
    setDropAddress("");
    setSelectingFor("drop");
  };

  const book = async () => {
    if (!pickupLocation || !dropLocation) {
      alert("Please select both pickup and drop locations on the map");
      return;
    }

    try {
      setBooking(true);
      const res = await API.post("/ride/book", {
        customerName,
        customerPhone,
        customerEmail,
        pickup: { 
          address: pickupAddress,
          lat: pickupLocation.lat, 
          lng: pickupLocation.lng 
        },
        drop: { 
          address: dropAddress,
          lat: dropLocation.lat, 
          lng: dropLocation.lng 
        }
      });
      alert(`✅ Ride booked successfully!\n\n📧 OTP has been sent to: ${customerEmail}\nRide ID: #${res.data._id.slice(-6)}\nOTP: ${res.data.otp}\n\nPlease check your email for ride details!`);
      navigate("/my-rides?status=pending");
    } catch (err) {
      alert("❌ Failed to book ride. Please try again.");
      setBooking(false);
    }
  };

  if (step === 1) {
    return (
      <div style={{ maxWidth: "500px", margin: "50px auto", padding: "20px" }}>
        <h2 style={{ color: "white", marginBottom: "20px" }}>📋 Customer Details</h2>
        <div style={{ background: "#1e293b", padding: "30px", borderRadius: "12px" }}>
          <div style={{ marginBottom: "20px" }}>
            <label style={{ color: "#94a3b8", display: "block", marginBottom: "8px", fontSize: "14px" }}>
              Full Name *
            </label>
            <input
              type="text"
              placeholder="Enter your name"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #334155", background: "#0f172a", color: "white" }}
            />
          </div>

          <div style={{ marginBottom: "20px" }}>
            <label style={{ color: "#94a3b8", display: "block", marginBottom: "8px", fontSize: "14px" }}>
              Email Address *
            </label>
            <input
              type="email"
              placeholder="your.email@example.com"
              value={customerEmail}
              onChange={(e) => setCustomerEmail(e.target.value)}
              style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #334155", background: "#0f172a", color: "white" }}
            />
            <p style={{ color: "#64748b", fontSize: "12px", marginTop: "6px" }}>
              📧 OTP will be sent to this email
            </p>
          </div>

          <div style={{ marginBottom: "20px" }}>
            <label style={{ color: "#94a3b8", display: "block", marginBottom: "8px", fontSize: "14px" }}>
              Phone Number *
            </label>
            <input
              type="tel"
              placeholder="10-digit mobile number"
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
              style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #334155", background: "#0f172a", color: "white" }}
            />
          </div>

          <button
            onClick={proceedToLocations}
            className="btn-primary"
            style={{ width: "100%", padding: "14px", fontSize: "16px" }}
          >
            Continue to Select Locations →
          </button>
        </div>
      </div>
    );
  }

  // Step 2: Interactive Map to Select Locations
  const center = pickupLocation 
    ? [pickupLocation.lat, pickupLocation.lng]
    : [12.9716, 77.5946]; // Default: Bangalore

  return (
    <div style={{ padding: "20px", maxWidth: "1400px", margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <h2 style={{ color: "white", margin: 0 }}>🗺️ Select Pickup & Drop Locations</h2>
        <button className="btn-secondary" onClick={() => setStep(1)} style={{ padding: "8px 16px" }}>
          ← Edit Details
        </button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 400px", gap: "20px" }}>
        {/* Map Section */}
        <div>
          <div style={{ 
            background: selectingFor === "pickup" ? "#22c55e" : selectingFor === "drop" ? "#ef4444" : "#64748b", 
            padding: "15px", 
            borderRadius: "8px 8px 0 0", 
            color: "white",
            fontWeight: "bold",
            textAlign: "center"
          }}>
            {selectingFor === "pickup" && "📍 Click on map to set PICKUP location (Green)"}
            {selectingFor === "drop" && "🏁 Click on map to set DROP location (Red)"}
            {!selectingFor && "✅ Both locations selected! Ready to book."}
          </div>
          
          <div style={{ background: "#1e293b", borderRadius: "0 0 12px 12px", overflow: "hidden", height: "600px" }}>
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

              <LocationPicker 
                onLocationSelect={handleLocationSelect} 
                selectingFor={selectingFor}
              />

              {/* Pickup Marker */}
              {pickupLocation && (
                <Marker position={[pickupLocation.lat, pickupLocation.lng]} icon={pickupIcon}>
                  <Popup>
                    <strong>📍 Pickup Location</strong>
                    <br />
                    {pickupAddress}
                  </Popup>
                </Marker>
              )}

              {/* Drop Marker */}
              {dropLocation && (
                <Marker position={[dropLocation.lat, dropLocation.lng]} icon={dropIcon}>
                  <Popup>
                    <strong>🏁 Drop Location</strong>
                    <br />
                    {dropAddress}
                  </Popup>
                </Marker>
              )}
            </MapContainer>
          </div>
        </div>

        {/* Info Panel */}
        <div>
          {/* Customer Info */}
          <div style={{ background: "#1e293b", padding: "20px", borderRadius: "12px", marginBottom: "15px" }}>
            <h3 style={{ color: "white", marginTop: 0 }}>👤 Customer Details</h3>
            <div style={{ color: "#94a3b8", fontSize: "14px", lineHeight: "1.8" }}>
              <div><strong style={{ color: "white" }}>Name:</strong> {customerName}</div>
              <div><strong style={{ color: "white" }}>Email:</strong> {customerEmail}</div>
              <div><strong style={{ color: "white" }}>Phone:</strong> {customerPhone}</div>
            </div>
            <div style={{ background: "#0f172a", padding: "10px", borderRadius: "6px", marginTop: "10px", fontSize: "12px", color: "#64748b" }}>
              📧 OTP will be sent to this email
            </div>
          </div>

          {/* Pickup Location */}
          <div style={{ 
            background: "#1e293b", 
            padding: "20px", 
            borderRadius: "12px", 
            marginBottom: "15px",
            border: selectingFor === "pickup" ? "2px solid #22c55e" : "2px solid transparent"
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
              <h4 style={{ color: "white", margin: 0 }}>📍 Pickup Location</h4>
              {pickupLocation && (
                <button 
                  onClick={resetPickup}
                  style={{ 
                    background: "#ef4444", 
                    color: "white", 
                    border: "none", 
                    padding: "6px 12px", 
                    borderRadius: "6px",
                    cursor: "pointer",
                    fontSize: "12px"
                  }}
                >
                  Change
                </button>
              )}
            </div>
            
            {pickupLocation ? (
              <div style={{ color: "#22c55e", fontSize: "14px", lineHeight: "1.6" }}>
                <div><strong>✅ Selected</strong></div>
                <div style={{ color: "#94a3b8", marginTop: 5 }}>{pickupAddress}</div>
              </div>
            ) : (
              <div style={{ color: "#f59e0b", fontSize: "14px" }}>
                ⏳ Click on map to select pickup location
              </div>
            )}
          </div>

          {/* Drop Location */}
          <div style={{ 
            background: "#1e293b", 
            padding: "20px", 
            borderRadius: "12px", 
            marginBottom: "15px",
            border: selectingFor === "drop" ? "2px solid #ef4444" : "2px solid transparent"
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
              <h4 style={{ color: "white", margin: 0 }}>🏁 Drop Location</h4>
              {dropLocation && (
                <button 
                  onClick={resetDrop}
                  style={{ 
                    background: "#ef4444", 
                    color: "white", 
                    border: "none", 
                    padding: "6px 12px", 
                    borderRadius: "6px",
                    cursor: "pointer",
                    fontSize: "12px"
                  }}
                >
                  Change
                </button>
              )}
            </div>
            
            {dropLocation ? (
              <div style={{ color: "#22c55e", fontSize: "14px", lineHeight: "1.6" }}>
                <div><strong>✅ Selected</strong></div>
                <div style={{ color: "#94a3b8", marginTop: 5 }}>{dropAddress}</div>
              </div>
            ) : (
              <div style={{ color: "#f59e0b", fontSize: "14px" }}>
                {pickupLocation ? "⏳ Click on map to select drop location" : "⏸️ Select pickup first"}
              </div>
            )}
          </div>

          {/* Instructions */}
          <div style={{ background: "#0f172a", padding: "15px", borderRadius: "8px", marginBottom: "15px" }}>
            <h4 style={{ color: "#3b82f6", marginTop: 0, fontSize: "14px" }}>📖 How to use:</h4>
            <ol style={{ color: "#94a3b8", fontSize: "13px", lineHeight: "1.8", margin: 0, paddingLeft: 20 }}>
              <li>Click anywhere on the map to set <strong style={{ color: "#22c55e" }}>pickup</strong></li>
              <li>Click again to set <strong style={{ color: "#ef4444" }}>drop</strong> location</li>
              <li>Review locations and click "Book Ride"</li>
            </ol>
          </div>

          {/* Book Button */}
          <button
            onClick={book}
            disabled={booking || !pickupLocation || !dropLocation}
            className="btn-primary"
            style={{ 
              width: "100%", 
              padding: "16px", 
              fontSize: "16px",
              opacity: (!pickupLocation || !dropLocation) ? 0.5 : 1,
              cursor: (!pickupLocation || !dropLocation) ? "not-allowed" : "pointer",
              background: (!pickupLocation || !dropLocation) ? "#64748b" : "#3b82f6"
            }}
          >
            {booking ? "Booking..." : "🚴 Confirm & Book Ride"}
          </button>

          {(!pickupLocation || !dropLocation) && (
            <p style={{ color: "#f59e0b", textAlign: "center", marginTop: "12px", fontSize: "13px" }}>
              ⚠️ Please select both locations on the map
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
