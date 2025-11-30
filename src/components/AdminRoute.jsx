import { Navigate } from "react-router-dom";

export default function AdminRoute({ children }) {
  const role = localStorage.getItem("admin_role");

  if (role !== "admin") {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
}
// src/components/AdminRoute.jsx