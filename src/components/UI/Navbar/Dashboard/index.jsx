import React from "react";
import { NavLink } from "react-router-dom";
import useAuth from "../../../../hooks/useAuth";

const NavbarDashboard = () => {
  const auth = useAuth();

  const accessAlertBox = auth.editor?.access ? (auth.editor?.access?.canAlertBox ? true : false) : true;
  const accessSubBadges = auth.editor?.access ? (auth.editor?.access?.canSubBadges ? true : false) : true;

  return (
    <>
      <NavLink to="/dashboard/emotes">Эмоции</NavLink>
      {auth.editor === null && <br />}
      {auth.editor === null && <br />}
      {auth.editor === null && <NavLink to="/dashboard/paint">Цвет имени</NavLink>}
      {accessSubBadges && <br />}
      {accessSubBadges && <br />}
      {accessSubBadges && <NavLink to="/dashboard/sub-badges">Значок подписчика</NavLink>}
      {accessAlertBox && <br />}
      {accessAlertBox && <br />}
      {accessAlertBox && <NavLink to="/dashboard/alertbox">Оповещения</NavLink>}
      {auth.editor === null && <br />}
      {auth.editor === null && <br />}
      {auth.editor === null && <NavLink to="/dashboard/editors">Редакторы</NavLink>}
    </>
  );
};

export default NavbarDashboard;
