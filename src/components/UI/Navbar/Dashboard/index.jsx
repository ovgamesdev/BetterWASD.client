import React from "react";
import { NavLink } from "react-router-dom";
import useAuth from "../../../../hooks/useAuth";

const NavbarDashboard = () => {
  const auth = useAuth();

  return (
    <>
      <NavLink to="/dashboard/emotes">Эмоции</NavLink>
      {auth.editor === null && <br></br>}
      {auth.editor === null && <br></br>}
      {auth.editor === null && <NavLink to="/dashboard/paint">Цвет имени</NavLink>}
      <br></br>
      <br></br>
      <NavLink to="/dashboard/sub-badges">Значок подписчика</NavLink>
      {auth.editor === null && <br></br>}
      {auth.editor === null && <br></br>}
      {auth.editor === null && <NavLink to="/dashboard/alertbox">Оповещения (beta)</NavLink>}
      {auth.editor === null && <br></br>}
      {auth.editor === null && <br></br>}
      {auth.editor === null && <NavLink to="/dashboard/editors">Редакторы</NavLink>}
      {/* {auth.editor === null && <br></br>}
      {auth.editor === null && <br></br>}
      {auth.editor === null && (
        <NavLink to="/dashboard/pro">BetterWASYA Pro</NavLink>
      )} */}
      {/* {auth.editor === null && <br></br>}
      {auth.editor === null && <br></br>}
      {auth.editor === null && (
        <a
          className="nav-link"
          target="_blank"
          rel="noreferrer"
          href="https://ovgamesdev.github.io/BetterWASYA.obs_chat/settings/"
        >
          Чат для OBS &gt;
        </a>
      )} */}
    </>
  );
};

export default NavbarDashboard;
