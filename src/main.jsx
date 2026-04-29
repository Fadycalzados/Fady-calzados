import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, ScrollRestoration } from "react-router-dom";
import FadyCalzados from "../fady_final_v2.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <ScrollRestoration />
      <Routes>
        <Route path="/" element={<FadyCalzados />} />
        <Route path="/product/:productId" element={<FadyCalzados />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
