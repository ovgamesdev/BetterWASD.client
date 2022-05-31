import React from "react";
import { NavLink } from "react-router-dom";

const NavbarEmotes = () => {
  return (
    <>
      <NavLink to="/emotes/top">Топ эмоций</NavLink>
      <br />
      <br />
      <NavLink to="/emotes/shared">Общие эмоции</NavLink>
      <br />
      <br />
      <NavLink to="/emotes/global">Глобальные эмоции</NavLink>
    </>
  );
};

export default NavbarEmotes;
