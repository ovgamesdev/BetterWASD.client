import React from "react";
import { NavLink, useLocation } from "react-router-dom";

import useAuth from "../../../hooks/useAuth";
import Bell from "../Bell/index.jsx";
import Dropdown from "./Dropdown";

import "./navbar.scss";

const Navbar = () => {
  const auth = useAuth();
  const location = useLocation();

  return (
    !window.location.pathname.match("/alert-box/") &&
    !window.location.pathname.match("/chat-box/") &&
    !window.location.pathname.match("/uninstall/") && (
      <header className="nav__wrapper">
        <div className="nav">
          <div className="d-flex" style={{ alignItems: "flex-end" }}>
            <NavLink to="/">
              <img className="nav-img" alt="BWASYA" src="https://raw.githubusercontent.com/ovgamesdev/res/main/Wasya_Better_color_logo_dark.svg" />
            </NavLink>
            <NavLink to="/emotes/top" className={() => `nav-link ${location.pathname.split("/")[1] === "emotes" ? "active" : ""}`}>
              эмоции
            </NavLink>
            {auth.user && (
              <NavLink to="/dashboard/emotes" className={() => `nav-link ${location.pathname.split("/")[1] === "dashboard" ? "active" : ""}`}>
                панель управления
              </NavLink>
            )}
            {auth.user?.user_role === "ADMIN" && (
              <NavLink to="/admin/paint" className={() => `nav-link ${location.pathname.split("/")[1] === "admin" ? "active" : ""}`}>
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
