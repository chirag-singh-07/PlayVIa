import { Navigate, useLocation } from "react-router-dom";
import { useAuth, Role } from "@/lib/auth";

export const ProtectedRoute = ({ role, children }: { role: Role; children: React.ReactNode }) => {
  const { user } = useAuth();
  const location = useLocation();
  if (!user) {
    const loginPath = role === "admin" ? "/admin/login" : "/creator/login";
    return <Navigate to={loginPath} state={{ from: location }} replace />;
  }

  // If role required is 'creator', allow both 'user' and 'creator' roles
  const isAuthorized = role === "admin" 
    ? user.role === "admin" 
    : (user.role === "creator" || user.role === "user" || user.role === "admin");

  if (!isAuthorized) {
    const loginPath = role === "admin" ? "/admin/login" : "/creator/login";
    return <Navigate to={loginPath} state={{ from: location }} replace />;
  }
  return <>{children}</>;
};