import React from "react";
import { NavLink } from "react-router-dom";

const AdminNavbarDashboard = () => {
  return (
    <>
      <NavLink to="/admin/paint">Цвет имени</NavLink>
      <br />
      <br />
      <NavLink to="/admin/bell">Уведомления</NavLink>
      <br />
      <br />
      <NavLink to="/admin/support">Обратная связь</NavLink>
      <br />
      <br />
      <NavLink to="/admin/disabled-options">Отключенные опции</NavLink>
    </>
  );
};

export default AdminNavbarDashboard;
