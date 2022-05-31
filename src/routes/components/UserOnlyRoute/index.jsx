import { Navigate, useLocation } from "react-router-dom";
import useAuth from "../../../hooks/useAuth";

function UserOnlyRoute({ children, to = "/login" }) {
  const auth = useAuth();
  const location = useLocation();
  const url = new URLSearchParams();
  url.set("redirect", location.pathname + location.search);

  return typeof auth.editor?.user_id === "undefined" ? (
    children
  ) : (
    <Navigate
      to={{
        pathname: to,
      }}
    />
  );
}

export default UserOnlyRoute;
