import { Navigate, Outlet, useLocation } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { ROLES } from "../Constants";

export default function RequireAuth(props: { allowedRoles: string[] }) {
  const { auth } = useAuth();
  const location = useLocation();
  const { allowedRoles } = props;
  const isAllowed = auth?.roles.some((r) =>
    allowedRoles.includes(ROLES[r.name])
  );

  return isAllowed ? (
    <Outlet />
  ) : (
    <Navigate to="/login" state={{ from: location }} replace />
  );
}
