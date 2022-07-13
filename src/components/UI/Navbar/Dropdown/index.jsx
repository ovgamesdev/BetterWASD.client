import { NavLink, useNavigate } from "react-router-dom";

import useAuth from "../../../../hooks/useAuth";
import useComponentVisible from "../../../../hooks/useComponentVisible/index.tsx";

import "../navbar.scss";

const Dropdown = () => {
  const auth = useAuth();
  const { ref, isComponentVisible, setIsComponentVisible } = useComponentVisible();

  const navigate = useNavigate();

  const onLogOut = () => {
    global.gtag("event", "logout_auth_token", { wasd_user_id: auth.user.user_id, user_login: auth.user.user_login });
    auth.logOut();
    navigate("/");
  };

  const toEditor = (profile) => {
    auth.setEditor({
      profile_image: profile.user.channel_image,
      user_id: profile.user.user_id,
      user_login: profile.user.user_login,
    });
    global.gtag("event", "user_to_editor", {
      wasd_user_id: auth.user.user_id,
      user_login: auth.user.user_login,
      editor_user_id: profile.user.user_id,
      editor_user_login: profile.user.user_login,
    });
  };

  return (
    <>
      {auth.user ? (
        <div ref={ref} className="nav-link" style={{ position: "relative" }}>
          <div className="nav-link d-flex nav-drop" onClick={() => setIsComponentVisible(!isComponentVisible)}>
            <div className="avatar" style={{ backgroundImage: `url(${auth.editor?.profile_image || auth.user.profile_image})` }} />
            <div className="button">{auth.editor?.user_login || auth.user?.user_login}</div>
          </div>
          {isComponentVisible && (
            <div className="menu" onClick={() => setIsComponentVisible(false)}>
              <div onClick={() => navigate("/emotes")} className="item item-mobile">
                эмоции
              </div>
              <div onClick={() => navigate("/dashboard")} to="/dashboard" className="item item-mobile">
                панель управления
              </div>

              <hr className="divider item-mobile" />

              {auth.user.channel_editor &&
                auth.user.channel_editor.map(
                  (editor, index) =>
                    editor?.user_id !== auth.editor?.user_id && (
                      <div className="item" key={index} onClick={() => toEditor(editor)}>
                        <div className="dropdown-avatar" style={{ backgroundImage: `url(${editor.user?.channel_image})` }} />
                        {editor.user?.user_login}
                      </div>
                    )
                )}
              {auth.editor !== null && (
                <div onClick={() => auth.setEditor(null)} className="item">
                  <div className="dropdown-avatar" style={{ backgroundImage: `url(${auth.user.profile_image})` }} />
                  {auth.user.user_login}
                </div>
              )}

              {(auth.user.channel_editor.length !== 0 || auth.editor) && <hr className="divider" />}

              <div className="item" onClick={onLogOut}>
                <svg className="svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                  <path
                    fill="currentColor"
                    d="M497 273L329 441c-15 15-41 4.5-41-17v-96H152c-13.3 0-24-10.7-24-24v-96c0-13.3 10.7-24 24-24h136V88c0-21.4 25.9-32 41-17l168 168c9.3 9.4 9.3 24.6 0 34zM192 436v-40c0-6.6-5.4-12-12-12H96c-17.7 0-32-14.3-32-32V160c0-17.7 14.3-32 32-32h84c6.6 0 12-5.4 12-12V76c0-6.6-5.4-12-12-12H96c-53 0-96 43-96 96v192c0 53 43 96 96 96h84c6.6 0 12-5.4 12-12z"
                  />
                </svg>
                Выйти
              </div>
            </div>
          )}
        </div>
      ) : (
        <NavLink to="/login" className="d-flex nav-link login">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
            <path
              fill="currentColor"
              d="M416 448h-84c-6.6 0-12-5.4-12-12v-40c0-6.6 5.4-12 12-12h84c17.7 0 32-14.3 32-32V160c0-17.7-14.3-32-32-32h-84c-6.6 0-12-5.4-12-12V76c0-6.6 5.4-12 12-12h84c53 0 96 43 96 96v192c0 53-43 96-96 96zm-47-201L201 79c-15-15-41-4.5-41 17v96H24c-13.3 0-24 10.7-24 24v96c0 13.3 10.7 24 24 24h136v96c0 21.5 26 32 41 17l168-168c9.3-9.4 9.3-24.6 0-34z"
            />
          </svg>
          login
        </NavLink>
      )}
    </>
  );
};

export default Dropdown;
