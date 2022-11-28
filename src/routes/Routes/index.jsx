import { Routes, Route, Navigate } from "react-router-dom";

import PrivateRoute from "../components/PrivateRoute";
import GuestRoute from "../components/GuestRoute";
import AdminRoute from "../components/AdminRoute";
import UserOnlyRoute from "../components/UserOnlyRoute";

import Home from "../../pages/Home";
import Login from "../../pages/Login";
import NotFound from "../../pages/NotFound";
import Terms from "../../pages/Terms";
import User from "../../pages/User";
import Privacy from "../../pages/Privacy";
import Dashboard from "../../pages/Dashboard";
import EmotesRoutes from "../../pages/Emotes";
import AlertBox from "../../pages/AlertBox";
import ChatBox from "../../pages/ChatBox";
import Uninstall from "../../pages/Uninstall";
import AdminDashboard from "../../pages/AdminDashboard";
import FagSupport from "../../pages/FagSupport";
import Support from "../../pages/Support";

import AlertProvider from "../../providers/AlertProvider";
import ChatProvider from "../../providers/ChatProvider";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/terms" element={<Terms />} />
      <Route path="/privacy" element={<Privacy />} />
      <Route path="/emotes/*" element={<EmotesRoutes />} />
      <Route path="/users/:id" element={<User />} />
      <Route path="/support" element={<Support />} />

      <Route
        path="/alert-box/v1/:token"
        element={
          <AlertProvider>
            <AlertBox />
          </AlertProvider>
        }
      />
      <Route
        path="/chat-box/v1/:token"
        element={
          <ChatProvider>
            <ChatBox />
          </ChatProvider>
        }
      />
      <Route path="/uninstall/:user_id" element={<Uninstall />} />

      <Route
        path="/faq/support"
        element={
          <UserOnlyRoute to="/">
            <PrivateRoute>
              <FagSupport />
            </PrivateRoute>
          </UserOnlyRoute>
        }
      />
      <Route
        path="/faq/support/reply/:id"
        element={
          <UserOnlyRoute to="/">
            <PrivateRoute>
              <FagSupport />
            </PrivateRoute>
          </UserOnlyRoute>
        }
      />

      <Route
        path="/admin/*"
        element={
          <AdminRoute>
            <AdminDashboard />
          </AdminRoute>
        }
      />

      <Route
        path="/dashboard/*"
        element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        }
      />

      <Route
        path="/login"
        element={
          <GuestRoute>
            <Login />
          </GuestRoute>
        }
      />
      <Route path="/logout" element={<Navigate to="/" />} />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
