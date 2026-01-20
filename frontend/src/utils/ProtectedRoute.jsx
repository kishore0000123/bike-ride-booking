import { Navigate } from "react-router-dom";
import { isAuthenticated, getUserRole } from "./auth";

export default function ProtectedRoute({ role, children }) {
  // Not logged in
  if (!isAuthenticated()) {
    return <Navigate to="/" replace />;
  }

  // Logged in but wrong role
  if (role && getUserRole() !== role) {
    return <Navigate to="/" replace />;
  }

  return children;
}
