import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import API from "../../services/api";

const sectionConfig = {
  operations: {
    icon: "🗺️",
    title: "Live Operations",
    subtitle: "Monitor active rides, rider coverage, and fast-moving incidents.",
    accent: ["#60a5fa", "#1d4ed8"],
    highlights: ["Active ride queue", "Rider assignments", "Live incident review"],
    actions: [
      { label: "Open Dashboard", to: "/admin-dashboard" },
      { label: "Inspect Performance", to: "/performance" }
    ]
  },
  drivers: {
    icon: "🏍️",
    title: "Rider Control Center",
    subtitle: "Track availability, assignment pressure, and rider productivity.",
    accent: ["#22c55e", "#0f766e"],
    highlights: ["Online coverage", "Assignment queue", "Average load per rider"],
    actions: [
      { label: "Open Dashboard", to: "/admin-dashboard" },
      { label: "Quality Review", to: "/quality" }
    ]
  },
  vehicles: {
    icon: "🚲",
    title: "Vehicle Fleet",
    subtitle: "Keep bikes service-ready, visible, and properly assigned.",
    accent: ["#38bdf8", "#2563eb"],
    highlights: ["Active fleet", "Maintenance due", "Registration status"],
    actions: [
      { label: "Open Riders", to: "/drivers" },
      { label: "Operations", to: "/admin-operations" }
    ]
  },
  performance: {
    icon: "📈",
    title: "Performance Analytics",
    subtitle: "Compare completion rate, cancellations, revenue, and service health.",
    accent: ["#a855f7", "#4f46e5"],
    highlights: ["Completion rate", "Cancellation trend", "Avg fare per ride"],
    actions: [
      { label: "Revenue View", to: "/banking" },
      { label: "Open Dashboard", to: "/admin-dashboard" }
    ]
  },
  incentives: {
    icon: "💰",
    title: "Incentives Board",
    subtitle: "Reward high-performing riders and keep service levels high.",
    accent: ["#f59e0b", "#ea580c"],
    highlights: ["Peak-hour bonus", "Completion streaks", "Customer rating bonus"],
    actions: [
      { label: "See Riders", to: "/drivers" },
      { label: "Performance", to: "/performance" }
    ]
  },
  banking: {
    icon: "🏦",
    title: "Banking & Settlements",
    subtitle: "Monitor revenue, payouts, and daily settlement health.",
    accent: ["#14b8a6", "#0e7490"],
    highlights: ["Revenue today", "Payout queue", "Settlement completion"],
    actions: [
      { label: "Open Revenue", to: "/performance" },
      { label: "Admin Dashboard", to: "/admin-dashboard" }
    ]
  },
  quality: {
    icon: "✔️",
    title: "Quality Check",
    subtitle: "Audit cancellations, ratings, and service reliability.",
    accent: ["#f43f5e", "#be123c"],
    highlights: ["Average rating", "Cancellation rate", "Customer feedback"],
    actions: [
      { label: "Open Operations", to: "/admin-operations" },
      { label: "Review Riders", to: "/drivers" }
    ]
  }
};

export default function AdminSectionPage({ section }) {
  const config = sectionConfig[section] || sectionConfig.operations;
  const [stats, setStats] = useState(null);
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [statsRes, ridesRes] = await Promise.all([
          API.get("/ride/admin/stats"),
          API.get("/ride/admin/all-rides")
        ]);

        setStats(statsRes.data);
        setRides(ridesRes.data);
      } catch (error) {
        console.error("Admin section error:", error);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [section]);

  const metrics = useMemo(() => {
    const total = stats?.rides?.total || 0;
    const completed = stats?.rides?.completed || 0;
    const pending = stats?.rides?.pending || 0;
    const ongoing = stats?.rides?.ongoing || 0;
    const cancelled = stats?.rides?.cancelled || 0;
    const avgFare = completed > 0 ? Math.round((stats?.revenue?.total || 0) / completed) : 0;
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;
    const cancellationRate = total > 0 ? Math.round((cancelled / total) * 100) : 0;
    const topCustomers = rides.slice(0, 3).map((ride) => ride.customerName).filter(Boolean);

    return {
      total,
      completed,
      pending,
      ongoing,
      cancelled,
      avgFare,
      completionRate,
      cancellationRate,
      topCustomers
    };
  }, [rides, stats]);

  if (loading) {
    return <div style={{ color: "white", padding: 24 }}>Loading section...</div>;
  }

  return (
    <div style={{ padding: 24, minHeight: "100vh", background: "radial-gradient(circle at top left, #111827 0%, #020617 45%, #020617 100%)" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <div style={{
          padding: 28,
          borderRadius: 28,
          color: "white",
          background: `linear-gradient(135deg, ${config.accent[0]}22, ${config.accent[1]}55)`,
          border: "1px solid rgba(148,163,184,0.14)",
          marginBottom: 20
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
            <div>
              <div style={{ fontSize: 46, lineHeight: 1 }}>{config.icon}</div>
              <h1 style={{ margin: "12px 0 8px", fontSize: 38 }}>{config.title}</h1>
              <p style={{ margin: 0, color: "#cbd5e1", maxWidth: 760 }}>{config.subtitle}</p>
            </div>
            <div style={{ display: "grid", gap: 10, minWidth: 240 }}>
              {config.actions.map((action) => (
                <Link key={action.to} to={action.to} className="btn-primary" style={{ textAlign: "center", padding: "12px 18px" }}>
                  {action.label}
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))", gap: 16, marginBottom: 20 }}>
          {[
            { label: "Total rides", value: metrics.total },
            { label: "Completion rate", value: `${metrics.completionRate}%` },
            { label: "Cancellation rate", value: `${metrics.cancellationRate}%` },
            { label: "Avg fare", value: `₹${metrics.avgFare}` },
            { label: "Active rides", value: metrics.pending + metrics.ongoing }
          ].map((card) => (
            <div key={card.label} className="card" style={{ background: "#0f172a", color: "white", border: "1px solid #1f2937", padding: 18, borderRadius: 20 }}>
              <div style={{ color: "#94a3b8", fontSize: 13 }}>{card.label}</div>
              <div style={{ fontSize: 32, fontWeight: 800, marginTop: 8 }}>{card.value}</div>
            </div>
          ))}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1.1fr 0.9fr", gap: 18 }}>
          <div className="card" style={{ background: "#0f172a", border: "1px solid #1f2937", padding: 22 }}>
            <h3 style={{ marginTop: 0, color: "white" }}>Section Highlights</h3>
            <div style={{ display: "grid", gap: 12 }}>
              {config.highlights.map((item) => (
                <div key={item} style={{ padding: 14, borderRadius: 14, background: "#111827", border: "1px solid #243041", color: "#e2e8f0" }}>
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div className="card" style={{ background: "#0f172a", border: "1px solid #1f2937", padding: 22 }}>
            <h3 style={{ marginTop: 0, color: "white" }}>Snapshot</h3>
            <div style={{ display: "grid", gap: 10, color: "#cbd5e1" }}>
              <div>Total: {metrics.total}</div>
              <div>Completed: {metrics.completed}</div>
              <div>Pending: {metrics.pending}</div>
              <div>Ongoing: {metrics.ongoing}</div>
              <div>Cancelled: {metrics.cancelled}</div>
              <div>Top customers: {metrics.topCustomers.join(", ") || "N/A"}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}