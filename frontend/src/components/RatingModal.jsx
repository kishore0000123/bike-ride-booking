import { useState } from "react";
import API from "../services/api";

export default function RatingModal({ ride, onClose, onSubmit }) {
  const [rating, setRating] = useState(5);
  const [review, setReview] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    try {
      setSubmitting(true);
      await API.post(`/ride/rate/${ride._id}`, {
        rating,
        review,
        ratingType: "rider"
      });
      
      if (onSubmit) onSubmit();
      if (onClose) onClose();
    } catch (error) {
      console.error("Rating error:", error);
      alert("Failed to submit rating");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: "rgba(0,0,0,0.7)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 1000
    }}>
      <div className="card" style={{ 
        padding: "30px", 
        maxWidth: "500px", 
        width: "90%",
        position: "relative"
      }}>
        <button 
          onClick={onClose}
          style={{
            position: "absolute",
            top: "10px",
            right: "10px",
            background: "none",
            border: "none",
            color: "#94a3b8",
            fontSize: "24px",
            cursor: "pointer"
          }}
        >
          ×
        </button>

        <h2 style={{ color: "white", marginBottom: "20px" }}>Rate Your Ride</h2>
        
        <div style={{ marginBottom: "20px" }}>
          <label style={{ color: "#94a3b8", display: "block", marginBottom: "10px" }}>
            Rating (1-5 stars)
          </label>
          <div style={{ display: "flex", gap: "10px" }}>
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => setRating(star)}
                style={{
                  background: "none",
                  border: "none",
                  fontSize: "32px",
                  cursor: "pointer",
                  color: star <= rating ? "#fbbf24" : "#4b5563"
                }}
              >
                ★
              </button>
            ))}
          </div>
        </div>

        <div style={{ marginBottom: "20px" }}>
          <label style={{ color: "#94a3b8", display: "block", marginBottom: "10px" }}>
            Review (Optional)
          </label>
          <textarea
            value={review}
            onChange={(e) => setReview(e.target.value)}
            placeholder="Share your experience..."
            style={{
              width: "100%",
              padding: "10px",
              borderRadius: "8px",
              border: "1px solid #334155",
              background: "#1e293b",
              color: "white",
              minHeight: "100px",
              resize: "vertical"
            }}
          />
        </div>

        <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
          <button 
            onClick={onClose}
            className="btn-secondary"
            disabled={submitting}
          >
            Cancel
          </button>
          <button 
            onClick={handleSubmit}
            className="btn-primary"
            disabled={submitting}
          >
            {submitting ? "Submitting..." : "Submit Rating"}
          </button>
        </div>
      </div>
    </div>
  );
}
