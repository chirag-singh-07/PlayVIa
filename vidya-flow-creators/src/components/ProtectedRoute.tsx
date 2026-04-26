import { Navigate, useLocation } from "react-router-dom";
import { useAuth, Role } from "@/lib/auth";

export const ProtectedRoute = ({ role, children }: { role: Role; children: React.ReactNode }) => {
  const { user } = useAuth();
  const location = useLocation();
  if (!user || user.role !== role) {
    const loginPath = role === "admin" ? "/admin/login" : "/creator/login";
    return <Navigate to={loginPath} state={{ from: location }} replace />;
  }
  return <>{children}</>;
};