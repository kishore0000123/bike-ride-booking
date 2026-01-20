export default function StatusBadge({ status }) {
  const colors = {
    pending: "orange",
    accepted: "blue",
    completed: "green",
    cancelled: "red"
  };

  return (
    <span style={{
      background: colors[status],
      color: "#fff",
      padding: "4px 10px",
      borderRadius: "10px",
      fontSize: "12px"
    }}>
      {status.toUpperCase()}
    </span>
  );
}
