import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/useAuth";

export function GuestRoute() {
  const { isAuthenticated } = useAuth();
  if (isAuthenticated) {
    return <Navigate to="/boards" replace />;
  }
  return <Outlet />;
}
