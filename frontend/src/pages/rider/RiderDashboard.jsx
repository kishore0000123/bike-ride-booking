import API from "../../services/api";
import { socket } from "../../services/socket";
import { useEffect, useState } from "react";
import RideCard from "../../components/RideCard";
import Loader from "../../components/Loader";

export default function RiderDashboard() {
  const [pendingRides, setPendingRides] = useState([]);
  const [acceptedRides, setAcceptedRides] = useState([]);
  const [ongoingRides, setOngoingRides] = useState([]);
  const [cancelledRides, setCancelledRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("pending");
  const [trackingRide, setTrackingRide] = useState(null);
  const [locationInterval, setLocationInterval] = useState(null);

  const fetchRides = async () => {
    try {
      const res = await API.get("/ride/pending");

      const pending = [];
      const accepted = [];
      const ongoing = [];
      const cancelled = [];

      res.data.forEach(ride => {
        if (ride.status === "pending") pending.push(ride);
        if (ride.status === "accepted") accepted.push(ride);
        if (ride.status === "ongoing") ongoing.push(ride);
        if (ride.status === "cancelled") cancelled.push(ride);
      });

      setPendingRides(pending);
      setAcceptedRides(accepted);
      setOngoingRides(ongoing);
      setCancelledRides(cancelled);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRides();

    socket.on("newRide", fetchRides);
    socket.on("rideUpdate", fetchRides);

    return () => {
      socket.off("newRide");
      socket.off("rideUpdate");
      if (locationInterval) {
        clearInterval(locationInterval);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const acceptRide = async (id) => {
    try {
      await API.post(`/ride/accept/${id}`);
    } catch (err) {
      console.error(err);
    }
  };

  const startRide = async (id) => {
    try {
      await API.post(`/ride/start/${id}`);
      setTrackingRide(id);
      startLocationTracking(id);
    } catch (err) {
      console.error(err);
    }
  };

  const startLocationTracking = (rideId) => {
    // Simulate rider movement (in real app, use navigator.geolocation)
    let lat = 12.9716; // Starting position (Bangalore)
    let lng = 77.5946;

    const interval = setInterval(() => {
      // Simulate movement (random walk)
      lat += (Math.random() - 0.5) * 0.005;
      lng += (Math.random() - 0.5) * 0.005;

      const location = { lat, lng };
      console.log("📍 Sending location update:", location);

      socket.emit("updateRiderLocation", {
        rideId,
        location
      });
    }, 5000); // Update every 5 seconds

    setLocationInterval(interval);
  };

  const stopLocationTracking = () => {
    if (locationInterval) {
      clearInterval(locationInterval);
      setLocationInterval(null);
    }
  };

  const completeRide = async (id) => {
    try {
      await API.post(`/ride/complete/${id}`);
      stopLocationTracking();
      setTrackingRide(null);
    } catch (err) {
      console.error(err);
    }
  };

  const cancelRide = async (id) => {
    try {
      await API.post(`/ride/cancel/${id}`);
      if (trackingRide === id) {
        stopLocationTracking();
        setTrackingRide(null);
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return <Loader message="Loading available rides..." />;
  }

  return (
    <>
      <div className="page">
        <div className="header center">
          <h1>Rider Dashboard</h1>
          {trackingRide && (
            <div style={{ background: "#22c55e", padding: "10px 20px", borderRadius: "8px", color: "white", marginTop: 10 }}>
              <strong>📍 Live Tracking Active</strong>
              <div style={{ fontSize: "12px", marginTop: 4 }}>Sending location updates every 5 seconds</div>
            </div>
          )}
        </div>

        <div className="tabs">
          <button
            className={activeTab === "pending" ? "active" : ""}
            onClick={() => setActiveTab("pending")}
          >
            Pending ({pendingRides.length})
          </button>

          <button
            className={activeTab === "accepted" ? "active" : ""}
            onClick={() => setActiveTab("accepted")}
          >
            Accepted ({acceptedRides.length})
          </button>

          <button
            className={activeTab === "ongoing" ? "active" : ""}
            onClick={() => setActiveTab("ongoing")}
          >
            Ongoing ({ongoingRides.length})
          </button>

          <button
            className={activeTab === "cancelled" ? "active" : ""}
            onClick={() => setActiveTab("cancelled")}
          >
            Cancelled ({cancelledRides.length})
          </button>
        </div>

        {/* PENDING */}
        {activeTab === "pending" && (
          <>
            {pendingRides.length === 0 && <p className="empty">No pending rides</p>}
            {pendingRides.map(ride => (
              <RideCard
                key={ride._id}
                ride={ride}
                onAccept={acceptRide}
                onCancel={cancelRide}
                showActions
              />
            ))}
          </>
        )}

        {/* ACCEPTED */}
        {activeTab === "accepted" && (
          <>
            {acceptedRides.length === 0 && <p className="empty">No accepted rides</p>}
            {acceptedRides.map(ride => (
              <div key={ride._id}>
                <RideCard ride={ride} />
                <div style={{ textAlign: "center", marginTop: 10 }}>
                  <button 
                    onClick={() => startRide(ride._id)}
                    className="btn-primary"
                    style={{ marginRight: 10 }}
                  >
                    🚀 Start Ride
                  </button>
                  <button 
                    onClick={() => cancelRide(ride._id)}
                    className="btn-secondary"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ))}
          </>
        )}

        {/* ONGOING */}
        {activeTab === "ongoing" && (
          <>
            {ongoingRides.length === 0 && <p className="empty">No ongoing rides</p>}
            {ongoingRides.map(ride => (
              <div key={ride._id}>
                <RideCard ride={ride} />
                <div style={{ textAlign: "center", marginTop: 10 }}>
                  <button 
                    onClick={() => completeRide(ride._id)}
                    className="btn-primary"
                  >
                    ✅ Complete Ride
                  </button>
                </div>
              </div>
            ))}
          </>
        )}

        {/* CANCELLED */}
        {activeTab === "cancelled" && (
          <>
            {cancelledRides.length === 0 && <p className="empty">No cancelled rides</p>}
            {cancelledRides.map(ride => (
              <RideCard key={ride._id} ride={ride} />
            ))}
          </>
        )}
      </div>
    </>
  );
}
