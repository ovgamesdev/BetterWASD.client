import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";

import AdminDashboardPaint from "./Paint";
import AdminNavbarDashboard from "../../components/UI/Navbar/AdminDashboard";

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

          <Route path="*" element={<Navigate to="paint" />} />
        </Routes>
      </div>
    </section>
  );
};

export default AdminDashboard;
