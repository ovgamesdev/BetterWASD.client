import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";

import DashboardEmotes from "./Emotes";
import DashboardPaint from "./Paint";
import DashboardSub from "./Sub";
import DashboardEditor from "./Editor";
// import DashboardPro from "./Pro";
import DashboardAlertBox from "./AlertBox";
import UserOnlyRoute from "../../routes/components/UserOnlyRoute";
import NavbarDashboard from "../../components/UI/Navbar/Dashboard";

import useMeta from "../../hooks/useMeta/index.tsx";
import useAuth from "../../hooks/useAuth";

import "./../user.css";

const DashboardRoutes = () => {
  useMeta({ title: "BetterWASYA | Панель управления" });

  const auth = useAuth();

  const accessAlertBox = auth.editor?.access ? (auth.editor?.access?.canAlertBox ? true : false) : true;
  const accessSubBadges = auth.editor?.access ? (auth.editor?.access?.canSubBadges ? true : false) : true;

  return (
    <section className="question-section" style={{ paddingBottom: "160px" }}>
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
          <Route
            path="editors"
            element={
              <UserOnlyRoute to="/dashboard/emotes">
                <DashboardEditor />
              </UserOnlyRoute>
            }
          />
          {/* <Route
            path="pro"
            element={
              <UserOnlyRoute to="/dashboard/emotes">
                <DashboardPro />
              </UserOnlyRoute>
            }
          /> */}
          {accessSubBadges && <Route path="sub-badges" element={<DashboardSub />} />}
          {accessAlertBox && <Route path="alertbox" element={<DashboardAlertBox />} />}
          <Route path="*" element={<Navigate to="emotes" />} />
        </Routes>
      </div>
    </section>
  );
};

export default DashboardRoutes;
