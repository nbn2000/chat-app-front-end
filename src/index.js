import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Router } from "./Router";
import "./assets/Global.css";
import { Provider } from "react-redux";
import { store } from "./context/store";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Provider store={store}>
  <BrowserRouter>
    <Router />
  </BrowserRouter>
  </Provider>
);