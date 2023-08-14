import { Navigate, Outlet, useLocation } from "react-router-dom";
import useAuth from "../hooks/useAuth";

export default function RequireAuth(props: { allowedRoles: string[] }) {
  const { auth } = useAuth();
  const location = useLocation();
  const { allowedRoles } = props;
  const isAllowed = auth?.roles.find((r) => allowedRoles.includes(r.name));

  return isAllowed ? (
    <Outlet />
  ) : (
    <Navigate to="/login" state={{ from: location }} replace />
  );
}
