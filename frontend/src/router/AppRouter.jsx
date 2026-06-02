import { Navigate, Route, Routes } from "react-router-dom";
import { LoginPage } from "../pages/LoginPage.jsx";
import { AdminDashboard } from "../pages/AdminDashboard.jsx";
import { EmployeeDashboard } from "../pages/EmployeeDashboard.jsx";
import { ProtectedRoute } from "./ProtectedRoute.jsx";
import { useAuth } from "../hooks/useAuth.js";

const HomeRedirect = () => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <Navigate to={user.role === "admin" ? "/admin" : "/employee"} replace />;
};

export const AppRouter = () => (
  <Routes>
    <Route path="/" element={<HomeRedirect />} />
    <Route path="/login" element={<LoginPage />} />
    <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
      <Route path="/admin" element={<AdminDashboard />} />
    </Route>
    <Route element={<ProtectedRoute allowedRoles={["employee"]} />}>
      <Route path="/employee" element={<EmployeeDashboard />} />
    </Route>
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
);
