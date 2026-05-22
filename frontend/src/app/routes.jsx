import { Routes, Route } from "react-router-dom";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import UserDashboard from "../pages/user/UserDashboard";
import RiderDashboard from "../pages/rider/RiderDashboard";
import MapPage from "../pages/user/MapPage";
import LiveMap from "../pages/user/LiveMap";
import RideDetails from "../pages/user/RideDetails";
import ProtectedRoute from "../utils/ProtectedRoute";
import DashboardLayout from "../layout/DashboardLayout";
import AdminDashboard from "../pages/admin/AdminDashboard";
import AdminSectionPage from "../pages/admin/AdminSectionPage";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Dashboard Routes with Sidebar */}
      <Route element={<DashboardLayout />}>
        <Route path="/user" element={
          <ProtectedRoute role="user">
            <UserDashboard />
          </ProtectedRoute>
        } />

        <Route path="/rider" element={
          <ProtectedRoute role="rider">
            <RiderDashboard />
          </ProtectedRoute>
        } />

        <Route path="/dashboard" element={
          <ProtectedRoute role="user">
            <UserDashboard />
          </ProtectedRoute>
        } />

        <Route path="/user-dashboard" element={
          <ProtectedRoute role="user">
            <UserDashboard />
          </ProtectedRoute>
        } />

        <Route path="/rider-dashboard" element={
          <ProtectedRoute role="rider">
            <RiderDashboard />
          </ProtectedRoute>
        } />

        <Route path="/admin-dashboard" element={
          <ProtectedRoute role="admin">
            <AdminDashboard />
          </ProtectedRoute>
        } />

        <Route path="/admin-operations" element={
          <ProtectedRoute role="admin">
            <AdminSectionPage section="operations" />
          </ProtectedRoute>
        } />

        <Route path="/drivers" element={
          <ProtectedRoute role="admin">
            <AdminSectionPage section="drivers" />
          </ProtectedRoute>
        } />

        <Route path="/vehicles" element={
          <ProtectedRoute role="admin">
            <AdminSectionPage section="vehicles" />
          </ProtectedRoute>
        } />

        <Route path="/performance" element={
          <ProtectedRoute role="admin">
            <AdminSectionPage section="performance" />
          </ProtectedRoute>
        } />

        <Route path="/incentives" element={
          <ProtectedRoute role="admin">
            <AdminSectionPage section="incentives" />
          </ProtectedRoute>
        } />

        <Route path="/banking" element={
          <ProtectedRoute role="admin">
            <AdminSectionPage section="banking" />
          </ProtectedRoute>
        } />

        <Route path="/quality" element={
          <ProtectedRoute role="admin">
            <AdminSectionPage section="quality" />
          </ProtectedRoute>
        } />

        <Route path="/map" element={
          <ProtectedRoute role="user">
            <MapPage />
          </ProtectedRoute>
        } />

        <Route path="/my-rides" element={
          <ProtectedRoute role="user">
            <UserDashboard />
          </ProtectedRoute>
        } />

        <Route path="/ride/:id" element={<RideDetails />} />

        <Route path="/live-map/:id" element={<LiveMap />} />
      </Route>

      {/* Redirect to login by default */}
      <Route path="/" element={<Login />} />
    </Routes>
  );
}
