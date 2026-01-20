import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../../services/api";
import { socket } from "../../services/socket";
import StatusBadge from "../../components/StatusBadge";
import Loader from "../../components/Loader";

export default function RideDetails() {
  const { id: rideId } = useParams();
  const navigate = useNavigate();

  const [ride, setRide] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRideDetails = async () => {
      try {
        const res = await API.get(`/ride/${rideId}`);
        setRide(res.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching ride details:", err);
        setLoading(false);
      }
    };

    fetchRideDetails();

    socket.on("rideUpdate", (updatedRide) => {
      if (updatedRide._id === rideId) {
        setRide(updatedRide);
      }
    });

    return () => {
      socket.off("rideUpdate");
    };
  }, [rideId]);

  const cancelRide = async () => {
    try {
      await API.post(`/ride/cancel/${rideId}`);
      alert("Ride cancelled successfully");
    } catch (error) {
      console.error("Error cancelling ride:", error);
      alert("Failed to cancel ride");
    }
  };

  const completeRide = async () => {
    try {
      await API.post(`/ride/complete/${rideId}`);
      alert("Ride completed successfully");
    } catch (error) {
      console.error("Error completing ride:", error);
      alert("Failed to complete ride");
    }
  };

  if (loading) return <Loader message="Loading ride details..." />;
  if (!ride) return <p style={{ padding: 20 }}>Ride not found</p>;

  return (
    <div style={{ padding: 20, maxWidth: 600, margin: "auto" }}>
      <button onClick={() => navigate(-1)}>← Back</button>

      <h2>Ride Details</h2>
      <StatusBadge status={ride.status} />

      <p>Pickup: {ride.pickup.lat}, {ride.pickup.lng}</p>
      <p>Drop: {ride.drop.lat}, {ride.drop.lng}</p>

      {ride.status === "accepted" && (
        <button onClick={completeRide}>Complete Ride</button>
      )}

      {(ride.status === "pending" || ride.status === "accepted") && (
        <button onClick={cancelRide}>Cancel Ride</button>
      )}
    </div>
  );
}
