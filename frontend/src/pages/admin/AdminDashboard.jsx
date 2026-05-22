import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import API from "../../services/api";

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [allRides, setAllRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      const [statsRes, ridesRes] = await Promise.all([
        API.get("/ride/admin/stats"),
        API.get("/ride/admin/all-rides")
      ]);
      
      setStats(statsRes.data);
      setAllRides(ridesRes.data);
      setLoading(false);
    } catch (error) {
      console.error("Admin data fetch error:", error);
      setLoading(false);
    }
  };

  const derived = useMemo(() => {
    const completed = stats?.rides?.completed || 0;
    const cancelled = stats?.rides?.cancelled || 0;
    const total = stats?.rides?.total || 0;
    const active = (stats?.rides?.pending || 0) + (stats?.rides?.ongoing || 0) + (stats?.rides?.accepted || 0);
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;
    const cancellationRate = total > 0 ? Math.round((cancelled / total) * 100) : 0;
    const avgFare = completed > 0 ? Math.round((stats?.revenue?.total || 0) / completed) : 0;
    const riderCoverage = stats?.riders?.total > 0 ? Math.round((stats?.riders?.online / stats?.riders?.total) * 100) : 0;

    const filteredRides = allRides.filter((ride) => {
      const matchesStatus = statusFilter === "all" || ride.status === statusFilter;
      const haystack = `${ride.customerName} ${ride.customerPhone} ${ride.riderId?.name || ""} ${ride.pickup?.address || ""} ${ride.drop?.address || ""}`.toLowerCase();
      const matchesSearch = haystack.includes(search.toLowerCase());
      return matchesStatus && matchesSearch;
    });

    const recentRides = [...allRides].slice(0, 5);

    return {
      completionRate,
      cancellationRate,
      avgFare,
      active,
      riderCoverage,
      filteredRides,
      recentRides
    };
  }, [allRides, search, statusFilter, stats]);

  if (loading) {
    return (
      <div style={{ padding: 32, color: "white", minHeight: "100vh", background: "radial-gradient(circle at top left, #1e293b 0%, #020617 42%, #020617 100%)" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ height: 220, borderRadius: 28, background: "linear-gradient(135deg, rgba(59,130,246,0.22), rgba(15,23,42,0.95))", border: "1px solid rgba(148,163,184,0.15)" }} />
          <div style={{ marginTop: 24, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 16 }}>
            {[1, 2, 3, 4].map((card) => (
              <div key={card} className="card" style={{ background: "#0f172a", minHeight: 110 }} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: 24, minHeight: "100vh", background: "radial-gradient(circle at top left, #1e293b 0%, #020617 42%, #020617 100%)" }}>
      <div style={{ maxWidth: 1440, margin: "0 auto" }}>
        <div style={{
          padding: 28,
          borderRadius: 28,
          marginBottom: 22,
          color: "white",
          background: "linear-gradient(135deg, rgba(15,23,42,0.92), rgba(59,130,246,0.22))",
          border: "1px solid rgba(148,163,184,0.15)",
          boxShadow: "0 24px 60px rgba(0,0,0,0.35)"
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: 20, flexWrap: "wrap", alignItems: "flex-start" }}>
            <div>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 12px", borderRadius: 999, background: "rgba(34,197,94,0.12)", color: "#86efac", fontSize: 12, fontWeight: 700, letterSpacing: 0.4, textTransform: "uppercase" }}>
                Operations Center
              </div>
              <h1 style={{ margin: "16px 0 10px", fontSize: 42, lineHeight: 1.05 }}>Admin Dashboard</h1>
              <p style={{ margin: 0, maxWidth: 720, color: "#cbd5e1", fontSize: 16 }}>
                Watch the ride network, revenue, riders, and service health from one control room. Use the navigation to manage riders, vehicles, quality, and payouts.
              </p>
            </div>

            <div style={{ display: "grid", gap: 10, minWidth: 240 }}>
              <Link to="/admin-operations" className="btn-primary" style={{ textAlign: "center", padding: "12px 18px" }}>Open Operations</Link>
              <Link to="/drivers" className="btn-secondary" style={{ textAlign: "center", padding: "12px 18px" }}>Manage Riders</Link>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 14, marginTop: 24 }}>
            {[
              { label: "Total Rides", value: stats?.rides.total || 0, accent: "#60a5fa" },
              { label: "Completion Rate", value: `${derived.completionRate}%`, accent: "#34d399" },
              { label: "Active Rides", value: derived.active, accent: "#f59e0b" },
              { label: "Revenue Today", value: `₹${stats?.revenue.today || 0}`, accent: "#f472b6" }
            ].map((item) => (
              <div key={item.label} style={{ background: "rgba(15,23,42,0.7)", border: "1px solid rgba(148,163,184,0.12)", borderRadius: 20, padding: 18 }}>
                <div style={{ color: "#94a3b8", fontSize: 13, marginBottom: 8 }}>{item.label}</div>
                <div style={{ color: item.accent, fontSize: 34, fontWeight: 800, lineHeight: 1 }}>{item.value}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 16, marginBottom: 22 }}>
          {[
            { label: "Completed", value: stats?.rides.completed || 0, bg: "linear-gradient(135deg, #10b981 0%, #065f46 100%)" },
            { label: "Ongoing", value: stats?.rides.ongoing || 0, bg: "linear-gradient(135deg, #8b5cf6 0%, #4338ca 100%)" },
            { label: "Pending", value: stats?.rides.pending || 0, bg: "linear-gradient(135deg, #f59e0b 0%, #b45309 100%)" },
            { label: "Cancelled", value: stats?.rides.cancelled || 0, bg: "linear-gradient(135deg, #ef4444 0%, #991b1b 100%)" },
            { label: "Total Riders", value: stats?.riders.total || 0, bg: "linear-gradient(135deg, #14b8a6 0%, #0f766e 100%)" },
            { label: "Online Riders", value: stats?.riders.online || 0, bg: "linear-gradient(135deg, #06b6d4 0%, #0e7490 100%)" }
          ].map((item) => (
            <div key={item.label} className="card" style={{ padding: 20, background: item.bg, color: "white", border: "none", borderRadius: 22 }}>
              <div style={{ fontSize: 14, opacity: 0.88 }}>{item.label}</div>
              <div style={{ fontSize: 34, fontWeight: 800, marginTop: 8 }}>{item.value}</div>
            </div>
          ))}
        </div>

        <div className="tabs" style={{ marginBottom: 18, justifyContent: "flex-start" }}>
          <button
            className={activeTab === "overview" ? "active" : ""}
            onClick={() => setActiveTab("overview")}
          >
            Overview
          </button>
          <button
            className={activeTab === "rides" ? "active" : ""}
            onClick={() => setActiveTab("rides")}
          >
            All Rides ({allRides.length})
          </button>
        </div>

        {activeTab === "overview" && (
          <div style={{ display: "grid", gridTemplateColumns: "1.15fr 0.85fr", gap: 18 }}>
            <div className="card" style={{ padding: 22, background: "#0f172a", border: "1px solid #1f2937" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
                <h3 style={{ margin: 0, color: "white" }}>Service Health</h3>
                <span style={{ color: "#94a3b8", fontSize: 13 }}>Live metrics</span>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 14 }}>
                {[
                  { label: "Avg Fare", value: `₹${derived.avgFare}`, note: "per completed ride" },
                  { label: "Cancellation Rate", value: `${derived.cancellationRate}%`, note: "needs attention when high" },
                  { label: "Rider Coverage", value: `${derived.riderCoverage}%`, note: "online riders / total" },
                  { label: "Revenue Total", value: `₹${stats?.revenue.total || 0}`, note: "all completed rides" }
                ].map((item) => (
                  <div key={item.label} style={{ background: "linear-gradient(180deg, rgba(30,41,59,0.95), rgba(15,23,42,0.95))", borderRadius: 18, padding: 18, border: "1px solid rgba(148,163,184,0.08)" }}>
                    <div style={{ color: "#94a3b8", fontSize: 13 }}>{item.label}</div>
                    <div style={{ fontSize: 28, fontWeight: 800, color: "#e2e8f0", marginTop: 8 }}>{item.value}</div>
                    <div style={{ color: "#64748b", fontSize: 12, marginTop: 6 }}>{item.note}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="card" style={{ padding: 22, background: "#0f172a", border: "1px solid #1f2937" }}>
              <h3 style={{ marginTop: 0, color: "white" }}>Quick Actions</h3>
              <div style={{ display: "grid", gap: 10 }}>
                {[
                  { label: "Open Operations", to: "/admin-operations" },
                  { label: "Inspect Riders", to: "/drivers" },
                  { label: "Check Quality", to: "/quality" },
                  { label: "Review Payouts", to: "/banking" }
                ].map((item) => (
                  <Link key={item.label} to={item.to} style={{ display: "block", padding: "14px 16px", borderRadius: 14, background: "#111827", color: "#e2e8f0", textDecoration: "none", border: "1px solid #243041" }}>
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === "rides" && (
          <div className="card" style={{ padding: 22, background: "#0f172a", border: "1px solid #1f2937" }}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 14, flexWrap: "wrap", marginBottom: 16 }}>
              <div>
                <h3 style={{ margin: 0, color: "white" }}>All Rides</h3>
                <p style={{ margin: "6px 0 0", color: "#94a3b8" }}>Search and monitor booking activity in real time.</p>
              </div>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                {["all", "pending", "accepted", "ongoing", "completed", "cancelled"].map((status) => (
                  <button key={status} onClick={() => setStatusFilter(status)} className={statusFilter === status ? "btn-primary" : "btn-secondary"} style={{ padding: "10px 14px", textTransform: "capitalize" }}>
                    {status}
                  </button>
                ))}
              </div>
            </div>

            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by customer, rider, or location"
              style={{ width: "100%", marginBottom: 16, borderRadius: 14, background: "#111827", color: "white", border: "1px solid #243041", padding: "14px 16px" }}
            />

            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", color: "white" }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid #243041", color: "#94a3b8" }}>
                    <th style={{ padding: "12px 8px", textAlign: "left" }}>Ride</th>
                    <th style={{ padding: "12px 8px", textAlign: "left" }}>Customer</th>
                    <th style={{ padding: "12px 8px", textAlign: "left" }}>Rider</th>
                    <th style={{ padding: "12px 8px", textAlign: "left" }}>Fare</th>
                    <th style={{ padding: "12px 8px", textAlign: "left" }}>Status</th>
                    <th style={{ padding: "12px 8px", textAlign: "left" }}>Created</th>
                  </tr>
                </thead>
                <tbody>
                  {derived.filteredRides.map((ride) => (
                    <tr key={ride._id} style={{ borderBottom: "1px solid #1f2937" }}>
                      <td style={{ padding: "14px 8px", color: "#cbd5e1" }}>#{ride._id.slice(-6)}</td>
                      <td style={{ padding: "14px 8px" }}>
                        <div style={{ fontWeight: 700 }}>{ride.customerName}</div>
                        <div style={{ color: "#64748b", fontSize: 12 }}>{ride.customerPhone}</div>
                      </td>
                      <td style={{ padding: "14px 8px", color: "#cbd5e1" }}>{ride.riderId?.name || "Not assigned"}</td>
                      <td style={{ padding: "14px 8px", color: "#cbd5e1" }}>₹{ride.fare?.totalFare || 0}</td>
                      <td style={{ padding: "14px 8px" }}>
                        <span style={{ padding: "5px 10px", borderRadius: 999, fontSize: 12, background: ride.status === "completed" ? "rgba(16,185,129,0.2)" : ride.status === "ongoing" ? "rgba(139,92,246,0.2)" : ride.status === "accepted" ? "rgba(59,130,246,0.2)" : ride.status === "cancelled" ? "rgba(239,68,68,0.2)" : "rgba(245,158,11,0.2)", color: "white" }}>
                          {ride.status}
                        </span>
                      </td>
                      <td style={{ padding: "14px 8px", color: "#cbd5e1" }}>{new Date(ride.createdAt).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
