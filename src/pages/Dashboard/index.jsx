import React from "react";
import useTitle from "../../hooks/useTitle";
import NavbarDashboard from "../../components/UI/Navbar/Dashboard";
import "./../user.css";
import { Navigate, Route, Routes } from "react-router-dom";

import DashboardEmotes from "./Emotes";
import DashboardPaint from "./Paint";
import DashboardSub from "./Sub";
import DashboardEditor from "./Editor";
import UserOnlyRoute from "../../routes/components/UserOnlyRoute";

const DashboardRoutes = () => {
  useTitle("BetterWASD | Панель управления");

  return (
    <section
      className="question-section paint"
      style={{ paddingBottom: "160px" }}
    >
      <div className="items">
        <div className="item item_left">
          <NavbarDashboard defaultActiveKey="#/dashboard/editors" />
        </div>

        <Routes>
          <Route path="emotes" element={<DashboardEmotes />} />
          <Route
            path="paint"
            element={
              <UserOnlyRoute to="/dashboard/emotes">
                <DashboardPaint />
              </UserOnlyRoute>
            }
          />
          <Route path="sub-badges" element={<DashboardSub />} />
          <Route
            path="editors"
            element={
              <UserOnlyRoute to="/dashboard/emotes">
                <DashboardEditor />
              </UserOnlyRoute>
            }
          />

          <Route path="*" element={<Navigate to="emotes" />} />
        </Routes>
      </div>
    </section>
  );
};

export default DashboardRoutes;
