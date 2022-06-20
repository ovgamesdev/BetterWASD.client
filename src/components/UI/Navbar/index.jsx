import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import useAuth from "../../../hooks/useAuth";

import styles from "./navbar.module.scss";

const Navbar = () => {
  const auth = useAuth();
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);

  const onLogOut = () => {
    auth.logOut();
    navigate("/");
  };

  const toEditor = (profile) => {
    auth.setEditor({
      profile_image: profile.user.channel_image,
      user_id: profile.user.user_id,
      user_login: profile.user.user_login,
    });
  };

  return (
    !window.location.pathname.match("/alert-box/") && (
      <header className={styles.root}>
        <div className={styles.nav}>
          <div className="d-flex" style={{ alignItems: "flex-end" }}>
            <NavLink to="/">
              <img
                alt="BWASD"
                src="https://raw.githubusercontent.com/ovgamesdev/res/main/Wasya_Better_color_logo_dark.svg"
              />
            </NavLink>
            <NavLink exact="true" to="/emotes" className={styles["nav-link"]}>
              эмоции
            </NavLink>
            {auth.user ? (
              <NavLink
                exact="true"
                to="/dashboard"
                className={styles["nav-link"]}
              >
                панель управления
              </NavLink>
            ) : null}
            {/* {auth.user && auth.editor === null ? (
            <NavLink to="/subscribe" className={styles["nav-link"]}>
              подписаться
            </NavLink>
          ) : null} */}
          </div>
          <div className="d-flex" style={{ alignItems: "flex-end" }}>
            {auth.user ? (
              <div
                className={styles["nav-link"] + " d-flex " + styles["nav-drop"]}
                style={{ top: "10px", position: "relative" }}
                tabIndex={0}
                onClick={() => {
                  setShowDropdown(!showDropdown);
                }}
                onBlur={() => {
                  setShowDropdown(false);
                }}
              >
                {auth.user.user_role && (
                  <div className={[styles["user-role"]]}>
                    {auth.user.user_role}
                  </div>
                )}
                <div
                  className={styles["avatar"]}
                  style={{
                    backgroundImage: `url(${
                      auth.editor?.profile_image || auth.user.profile_image
                    })`,
                  }}
                ></div>

                <div className={styles.button}>
                  {auth.editor?.user_login || auth.user?.user_login}
                </div>
                {showDropdown && (
                  <div className={styles.menu}>
                    <div
                      onClick={() => navigate("/emotes")}
                      className={styles.item + " " + styles["item-mobile"]}
                    >
                      эмоции
                    </div>
                    <div
                      onClick={() => navigate("/dashboard")}
                      to="/dashboard"
                      className={styles.item + " " + styles["item-mobile"]}
                    >
                      панель управления
                    </div>

                    <hr
                      className={styles.divider + " " + styles["item-mobile"]}
                    />

                    {auth.user.channel_editor &&
                      auth.user.channel_editor.map(
                        (editor, index) =>
                          editor?.user_id !== auth.editor?.user_id && (
                            <div
                              className={styles.item}
                              key={index}
                              onClick={() => toEditor(editor)}
                            >
                              <div
                                className={styles["dropdown-avatar"]}
                                style={{
                                  backgroundImage: `url(${editor.user?.channel_image})`,
                                }}
                              ></div>
                              {editor.user?.user_login}
                            </div>
                          )
                      )}
                    {auth.editor !== null && (
                      <div
                        onClick={() => auth.setEditor(null)}
                        className={styles.item}
                      >
                        <div
                          className={styles["dropdown-avatar"]}
                          style={{
                            backgroundImage: `url(${auth.user.profile_image})`,
                          }}
                        ></div>
                        {auth.user.user_login}
                      </div>
                    )}

                    {(auth.user.channel_editor.length !== 0 || auth.editor) && (
                      <hr className={styles.divider} />
                    )}

                    <div className={styles.item} onClick={onLogOut}>
                      <svg
                        className={styles.svg}
                        aria-hidden="true"
                        focusable="false"
                        data-prefix="fas"
                        role="img"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 512 512"
                      >
                        <path
                          fill="currentColor"
                          d="M497 273L329 441c-15 15-41 4.5-41-17v-96H152c-13.3 0-24-10.7-24-24v-96c0-13.3 10.7-24 24-24h136V88c0-21.4 25.9-32 41-17l168 168c9.3 9.4 9.3 24.6 0 34zM192 436v-40c0-6.6-5.4-12-12-12H96c-17.7 0-32-14.3-32-32V160c0-17.7 14.3-32 32-32h84c6.6 0 12-5.4 12-12V76c0-6.6-5.4-12-12-12H96c-53 0-96 43-96 96v192c0 53 43 96 96 96h84c6.6 0 12-5.4 12-12z"
                        ></path>
                      </svg>
                      Выйти
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <NavLink
                to="/login"
                className={"d-flex " + styles["nav-link"] + " " + styles.login}
              >
                <svg
                  aria-hidden="true"
                  focusable="false"
                  data-prefix="fas"
                  role="img"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 512 512"
                >
                  <path
                    fill="currentColor"
                    d="M416 448h-84c-6.6 0-12-5.4-12-12v-40c0-6.6 5.4-12 12-12h84c17.7 0 32-14.3 32-32V160c0-17.7-14.3-32-32-32h-84c-6.6 0-12-5.4-12-12V76c0-6.6 5.4-12 12-12h84c53 0 96 43 96 96v192c0 53-43 96-96 96zm-47-201L201 79c-15-15-41-4.5-41 17v96H24c-13.3 0-24 10.7-24 24v96c0 13.3 10.7 24 24 24h136v96c0 21.5 26 32 41 17l168-168c9.3-9.4 9.3-24.6 0-34z"
                  ></path>
                </svg>
                login
              </NavLink>
            )}
          </div>
        </div>
      </header>
    )
  );
};

export default Navbar;
