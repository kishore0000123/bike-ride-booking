import { Routes, Route } from "react-router-dom";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import Dashboard from "../pages/user/Dashboard";
import UserDashboard from "../pages/user/UserDashboard";
import RiderDashboard from "../pages/rider/RiderDashboard";
import MapPage from "../pages/user/MapPage";
import LiveMap from "../pages/user/LiveMap";
import RideDetails from "../pages/user/RideDetails";
import ProtectedRoute from "../utils/ProtectedRoute";
import DashboardLayout from "../layout/DashboardLayout";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Dashboard Routes with Sidebar */}
      <Route element={<DashboardLayout />}>
        <Route path="/user" element={
          <ProtectedRoute role="user">
            <Dashboard />
          </ProtectedRoute>
        } />

        <Route path="/rider" element={
          <ProtectedRoute role="rider">
            <RiderDashboard />
          </ProtectedRoute>
        } />

        <Route path="/dashboard" element={
          <ProtectedRoute role="user">
            <Dashboard />
          </ProtectedRoute>
        } />

        <Route path="/user-dashboard" element={
          <ProtectedRoute role="user">
            <Dashboard />
          </ProtectedRoute>
        } />

        <Route path="/rider-dashboard" element={
          <ProtectedRoute role="rider">
            <RiderDashboard />
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

        <Route path="/live-map/:id" element={
          <ProtectedRoute role="user">
            <LiveMap />
          </ProtectedRoute>
        } />
      </Route>

      {/* Redirect to login by default */}
      <Route path="/" element={<Login />} />
    </Routes>
  );
}
