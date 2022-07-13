import React from "react";
import { NavLink } from "react-router-dom";

import useAuth from "../../../hooks/useAuth";
import Bell from "../Bell/index.jsx";
import Dropdown from "./Dropdown";

import "./navbar.scss";

const Navbar = () => {
  const auth = useAuth();

  return (
    !window.location.pathname.match("/alert-box/") &&
    !window.location.pathname.match("/uninstall/") && (
      <header className="nav__wrapper">
        <div className="nav">
          <div className="d-flex" style={{ alignItems: "flex-end" }}>
            <NavLink to="/">
              <img
                className="nav-img"
                alt="BWASD"
                src="https://raw.githubusercontent.com/ovgamesdev/res/main/Wasya_Better_color_logo_dark.svg"
              />
            </NavLink>
            <NavLink exact="true" to="/emotes" className="nav-link">
              эмоции
            </NavLink>
            {auth.user && (
              <NavLink exact="true" to="/dashboard/emotes" className="nav-link">
                панель управления
              </NavLink>
            )}
            {auth.user?.user_role === "ADMIN" && (
              <NavLink exact="true" to="/admin/paint" className="nav-link">
                admin
              </NavLink>
            )}
            {/* {auth.user && auth.editor === null && (
            <NavLink to="/subscribe" className="nav-link">
              подписаться
            </NavLink>
          )} */}
          </div>
          <div className="d-flex" style={{ alignItems: "center" }}>
            <Bell />
            <Dropdown />
          </div>
        </div>
      </header>
    )
  );
};

export default Navbar;
