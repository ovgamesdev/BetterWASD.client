import { BrowserRouter } from "react-router-dom";
import "./App.css";
import "./pages/button.css";
import Navbar from "./components/UI/Navbar";

import Routes from "./routes/Routes";

function App() {
  return (
    <BrowserRouter>
      <div className="wrapper">
        <Navbar />
        <Routes />
      </div>
    </BrowserRouter>
  );
}

export default App;
