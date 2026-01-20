import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import API from "../../services/api";
import RideCard from "../../components/RideCard";
import { socket } from "../../services/socket";

export default function UserDashboard() {
  const [rides, setRides] = useState([]);
  const [searchParams] = useSearchParams();
  const statusFromUrl = searchParams.get("status") || "pending";
  const [activeTab, setActiveTab] = useState(statusFromUrl);
  const navigate = useNavigate();

  useEffect(() => {
    // Update active tab when URL changes
    const newStatus = searchParams.get("status") || "pending";
    setActiveTab(newStatus);
  }, [searchParams]);

  useEffect(() => {
    API.get("/ride/my-rides")
      .then(res => {
        console.log("📦 All rides fetched:", res.data);
        setRides(res.data);
      })
      .catch(err => console.error(err));

    socket.on("rideUpdate", updatedRide => {
      console.log("🔄 Ride updated:", updatedRide);
      setRides(prev =>
        prev.map(r => r._id === updatedRide._id ? updatedRide : r)
      );
    });

    return () => socket.off("rideUpdate");
  }, []);

  const filterRides = (status) => {
    const filtered = rides.filter(r => r.status === status);
    console.log(`🔍 Filtering ${status} rides:`, filtered);
    return filtered;
  };

  const cancelRide = async (id) => {
    try {
      await API.post(`/ride/cancel/${id}`);
      // Refresh rides after cancel
      const res = await API.get("/ride/my-rides");
      setRides(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const acceptRide = async (id) => {
    try {
      await API.post(`/ride/accept/${id}`);
      // Refresh rides after accept
      const res = await API.get("/ride/my-rides");
      setRides(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const completeRide = async (id) => {
    try {
      await API.post(`/ride/complete/${id}`);
      // Refresh rides after complete
      const res = await API.get("/ride/my-rides");
      setRides(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  // Get rides for current status from URL
  const currentRides = filterRides(activeTab);
  
  // Status title mapping
  const statusTitles = {
    pending: "⏳ Pending Rides",
    accepted: "✅ Accepted Rides",
    cancelled: "❌ Cancelled Rides",
    completed: "✔️ Completed Rides"
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1 style={{ color: "white", margin: 0, marginBottom: "30px" }}>
        {statusTitles[activeTab]}
      </h1>

      <div>
        {currentRides.length === 0 && (
          <p className="empty">No {activeTab} rides</p>
        )}
        {currentRides.map(ride => (
          <div key={ride._id} style={{ marginBottom: "20px" }}>
            <RideCard
              ride={ride}
              onCancel={cancelRide}
              onAccept={acceptRide}
              onComplete={completeRide}
              showActions={true}
            />
            {(ride.status === "accepted" || ride.status === "ongoing") && (
              <div style={{ textAlign: "center", marginTop: 10 }}>
                <button 
                  onClick={() => navigate(`/live-map/${ride._id}`)}
                  className="btn-primary"
                  style={{ background: "#22c55e" }}
                >
                  🗺️ Track Live on Map
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
