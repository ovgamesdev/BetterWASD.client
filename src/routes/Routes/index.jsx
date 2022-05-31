import { Routes, Route, Navigate } from "react-router-dom";

import Home from "../../pages/Home";
import Login from "../../pages/Login";
import NotFound from "../../pages/NotFound";
import useAuth from "../../hooks/useAuth";
import PrivateRoute from "../components/PrivateRoute";
import GuestRoute from "../components/GuestRoute";
import Terms from "../../pages/Terms";
// import Emote from "../../pages/Emotes/Emote";
import User from "../../pages/User";
import Privacy from "../../pages/Privacy";
import Subscription from "../../pages/Subscription";
import XsollaCallback from "../../pages/XsollaCallback";
import Dashboard from "../../pages/Dashboard";
import EmotesRoutes from "../../pages/Emotes";

function AppRoutes() {
  const auth = useAuth();

  return auth ? (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/terms" element={<Terms />} />
      <Route path="/privacy" element={<Privacy />} />

      <Route path="/emotes/*" element={<EmotesRoutes />}>
        {/* <Route path=":id" element={<EmotesRoutes />} /> */}
      </Route>

      {/* <Route path="/emotes/:id" element={<Emote />} /> */}
      <Route path="/users/:id" element={<User />} />

      <Route
        path="/dashboard/*"
        element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        }
      ></Route>

      <Route
        path="/login"
        element={
          <GuestRoute>
            <Login />
          </GuestRoute>
        }
      />
      <Route path="/logout" element={<Navigate to="/" />} />
      <Route
        path="/subscribe"
        element={
          <PrivateRoute>
            <Subscription />
          </PrivateRoute>
        }
      />
      <Route
        path="/xsolla/callback"
        element={
          <PrivateRoute>
            <XsollaCallback />
          </PrivateRoute>
        }
      />

      <Route path="*" element={<NotFound />} />
    </Routes>
  ) : (
    <div> loading </div>
  );
}

export default AppRoutes;
