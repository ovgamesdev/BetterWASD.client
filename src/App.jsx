import { useEffect } from "react";
import { BrowserRouter } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { CSSTransition } from "react-transition-group";

import Navbar from "./components/UI/Navbar";
import Loading from "./components/UI/Loading/Button";

import Routes from "./routes/Routes";
import useAuth from "./hooks/useAuth";

import "./toastify.scss";
import "./App.css";
import "./pages/button.css";

function App() {
  const auth = useAuth();

  useEffect(() => {
    if (auth.isLoaded && auth.token && auth.user === null) toast.warn("Ошибка авторизации, повторите попытку позже");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auth.isLoaded]);

  const wrapperClassName =
    (window.location.pathname.match("/alert-box/") ? " alert_mode" : "") +
    (window.location.pathname.match("/uninstall/") ? " uninstall_mode" : "");

  return (
    <>
      <BrowserRouter>
        {!window.location.pathname.match("/alert-box/") && (
          <ToastContainer
            position="top-left"
            autoClose={5000}
            limit={10}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            className="toast-container"
            toastClassName="toast"
            bodyClassName="toast-body"
            progressClassName="toast-progress"
          />
        )}
        <div className={`wrapper ${wrapperClassName}`}>
          <Navbar />
          <Routes />
        </div>
      </BrowserRouter>

      <CSSTransition in={!auth.isLoaded} timeout={400} classNames="list-transition" unmountOnExit appear>
        {(state) => (
          <div className={`loader-wrapper ${state}`} style={{ zIndex: 9999999 }}>
            <div className="loader-content">
              {/* <img className="loader-image" src="https://static.wasd.tv/assets/fe/images/preloader_wasd_300.gif" alt="" /> */}
              <Loading />
              Загрузка...
            </div>
          </div>
        )}
      </CSSTransition>
    </>
  );
}

export default App;
