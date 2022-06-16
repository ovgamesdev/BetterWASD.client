import { BrowserRouter } from "react-router-dom";
import "./App.css";
import "./pages/button.css";
import Navbar from "./components/UI/Navbar";

import Routes from "./routes/Routes";

import { ToastContainer } from "react-toastify";
import "./toastify.scss";

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
          (window.location.pathname.match("/alert-box/") ? " alert_mode" : "")
        }
      >
        <Navbar />
        <Routes />
      </div>
    </BrowserRouter>
  );
}

export default App;
