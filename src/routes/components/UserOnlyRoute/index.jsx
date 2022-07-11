import { Navigate } from "react-router-dom";
import useAuth from "../../../hooks/useAuth";

function UserOnlyRoute({ children, to = "/login" }) {
  const auth = useAuth();

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
