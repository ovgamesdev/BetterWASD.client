import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import AuthProvider from "./providers/AuthProvider";

export const HOSTURL = localStorage.debug
  ? "http://localhost:5000"
  : "https://betterwasd.herokuapp.com";

ReactDOM.render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
