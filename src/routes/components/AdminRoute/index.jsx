import { Navigate, useLocation } from "react-router-dom";
import useAuth from "../../../hooks/useAuth";

const AdminRoute = ({ children, to = "/" }) => {
  const auth = useAuth();
  const location = useLocation();
  const url = new URLSearchParams();
  url.set("redirect", location.pathname + location.search + location.hash);

  if (auth.user?.user_role !== "ADMIN" && auth.isLoaded) {
    return <Navigate to={{ pathname: to }} />;
  }

  return auth.user?.user_role === "ADMIN" ? children : <Navigate to={{ pathname: "/login", search: url.toString() }} />;
};

export default AdminRoute;
