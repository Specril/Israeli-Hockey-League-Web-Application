"use client";



import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./page";
import { BrowserRouter } from "react-router-dom";
if (typeof document !== "undefined") {
  const root = ReactDOM.createRoot(document.getElementById("root"));
}
root.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
