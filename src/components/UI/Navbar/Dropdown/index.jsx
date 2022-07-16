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
    auth.setEditor({ profile_image: profile.user.channel_image, user_id: profile.user.user_id, user_login: profile.user.user_login });
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
              <div onClick={() => navigate("/emotes/top")} className="item item-mobile">
                эмоции
              </div>
              <div onClick={() => navigate("/dashboard/emotes")} className="item item-mobile">
                панель управления
              </div>
              <div onClick={() => navigate("/admin/paint")} className="item item-mobile">
                admin
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

              {auth.editor === null && (
                <div className="item" onClick={() => navigate("/faq/support")}>
                  <svg className="svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
                    <path
                      fill="currentColor"
                      d="m24.05 46.15-.2-6.55-2.15-.05q-7.35-.6-12.375-6.075Q4.3 28 4.3 20.6q0-7.85 5.575-13.375T23.35 1.7q3.9 0 7.25 1.425t5.825 3.95q2.475 2.525 3.9 5.975 1.425 3.45 1.425 7.5 0 7.8-4.975 14.55Q31.8 41.85 24.05 46.15Zm-.65-13.5q1 0 1.7-.7t.7-1.7q0-.95-.7-1.65t-1.7-.7q-1 0-1.7.7t-.7 1.65q0 1 .7 1.7t1.7.7Zm-1.85-7.15h3.4q0-1.25.475-2.2.475-.95 1.625-2.05 1.4-1.45 1.975-2.575.575-1.125.575-2.575 0-2.5-1.55-4.075-1.55-1.575-4.4-1.575-2.3 0-4.125 1.325Q17.7 13.1 16.8 15.3l3.15 1.3q.6-1.35 1.525-2.025.925-.675 1.925-.675 1.3 0 2.025.575.725.575.725 1.625 0 .8-.55 1.75t-1.8 2.25q-1.4 1.45-1.825 2.45-.425 1-.425 2.95Zm6.7 9.45v3.1q4.1-3.45 6.425-8.15T37 20.55q0-6.2-3.875-10.15T23.35 6.45q-6 0-10.175 4.15Q9 14.75 9 20.65q0 5.95 4.175 10.125T23.25 34.95ZM23 22.25Z"
                    />
                  </svg>
                  {/* <svg xmlns="http://www.w3.org/2000/svg" height="48" width="48">
                    <path d="m24.05 46.15-.2-6.55-2.15-.05q-7.35-.6-12.375-6.075Q4.3 28 4.3 20.6q0-7.85 5.575-13.375T23.35 1.7q3.9 0 7.25 1.425t5.825 3.95q2.475 2.525 3.9 5.975 1.425 3.45 1.425 7.5 0 7.8-4.975 14.55Q31.8 41.85 24.05 46.15Zm-.65-13.5q1 0 1.7-.7t.7-1.7q0-.95-.7-1.65t-1.7-.7q-1 0-1.7.7t-.7 1.65q0 1 .7 1.7t1.7.7Zm-1.85-7.15h3.4q0-1.25.475-2.2.475-.95 1.625-2.05 1.4-1.45 1.975-2.575.575-1.125.575-2.575 0-2.5-1.55-4.075-1.55-1.575-4.4-1.575-2.3 0-4.125 1.325Q17.7 13.1 16.8 15.3l3.15 1.3q.6-1.35 1.525-2.025.925-.675 1.925-.675 1.3 0 2.025.575.725.575.725 1.625 0 .8-.55 1.75t-1.8 2.25q-1.4 1.45-1.825 2.45-.425 1-.425 2.95Zm6.7 9.45v3.1q4.1-3.45 6.425-8.15T37 20.55q0-6.2-3.875-10.15T23.35 6.45q-6 0-10.175 4.15Q9 14.75 9 20.65q0 5.95 4.175 10.125T23.25 34.95ZM23 22.25Z" />
                  </svg> */}
                  Обратная связь
                </div>
              )}

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
        <>
          <NavLink to="/login" className="d-flex nav-link login">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
              <path
                fill="currentColor"
                d="M416 448h-84c-6.6 0-12-5.4-12-12v-40c0-6.6 5.4-12 12-12h84c17.7 0 32-14.3 32-32V160c0-17.7-14.3-32-32-32h-84c-6.6 0-12-5.4-12-12V76c0-6.6 5.4-12 12-12h84c53 0 96 43 96 96v192c0 53-43 96-96 96zm-47-201L201 79c-15-15-41-4.5-41 17v96H24c-13.3 0-24 10.7-24 24v96c0 13.3 10.7 24 24 24h136v96c0 21.5 26 32 41 17l168-168c9.3-9.4 9.3-24.6 0-34z"
              />
            </svg>
            login
          </NavLink>
        </>
      )}
    </>
  );
};

export default Dropdown;
