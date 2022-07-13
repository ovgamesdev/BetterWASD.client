import React from "react";
import { NavLink } from "react-router-dom";
// import useAuth from "../../../../hooks/useAuth";

const AdminNavbarDashboard = () => {
  return (
    <>
      <NavLink to="/admin/paint">Цвет имени</NavLink>
      <br></br>
      <br></br>
      <NavLink to="/admin/bell">Уведомления</NavLink>
      {/* <br></br>
      <br></br>
      <NavLink to="/dashboard/sub-badges">Значок подписчика</NavLink>
      <br></br>
      <br></br>
      <NavLink to="/dashboard/alertbox">Оповещения</NavLink>
      <br></br>
      <br></br>
      <NavLink to="/dashboard/editors">Редакторы</NavLink> */}
    </>
  );
};

export default AdminNavbarDashboard;
