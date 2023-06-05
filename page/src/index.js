import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";
import App from "./App";
import CreateProject from "./components/CreateProject";
import Navbar from "./components/Navbar.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/publish" element={<CreateProject />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
