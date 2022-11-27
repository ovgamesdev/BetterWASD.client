import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";

import AdminNavbarDashboard from "../../components/UI/Navbar/AdminDashboard";
import AdminDashboardPaint from "./Paint";
import AdminDashboardBell from "./Bell";
import AdminDashboardSupport from "./Support";
import AdminDashboardDisabledOptions from "./DisabledOptions";

import useMeta from "../../hooks/useMeta/index.tsx";

import "./../user.css";

const AdminDashboard = () => {
  useMeta({ title: "BetterWASYA | Admin" });

  return (
    <section className="question-section" style={{ paddingBottom: "160px" }}>
      <div className="items">
        <div className="item item_left">
          <AdminNavbarDashboard defaultActiveKey="/admin/paint" />
        </div>

        <Routes>
          <Route path="paint" element={<AdminDashboardPaint />} />
          <Route path="bell" element={<AdminDashboardBell />} />
          <Route path="support" element={<AdminDashboardSupport />} />
          <Route path="disabled-options" element={<AdminDashboardDisabledOptions />} />

          <Route path="*" element={<Navigate to="paint" />} />
        </Routes>
      </div>
    </section>
  );
};

export default AdminDashboard;
