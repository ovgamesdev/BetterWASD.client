import { BrowserRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import Navbar from "./components/UI/Navbar";

import Routes from "./routes/Routes";

import "./toastify.scss";
import "./App.css";
import "./pages/button.css";

function App() {
  return (
    <BrowserRouter>
      {!window.location.pathname.match("/alert-box/") && (
        <ToastContainer
          position="top-left"
          autoClose={5000}
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
      <div
        className={
          "wrapper" +
          (window.location.pathname.match("/alert-box/") ? " alert_mode" : "") +
          (window.location.pathname.match("/uninstall/") ? " uninstall_mode" : "")
        }
      >
        <Navbar />
        <Routes />
      </div>
    </BrowserRouter>
  );
}

export default App;
