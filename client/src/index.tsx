import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import Menu from "./routes/Menu";
import Signup from "./routes/Register";
import Login from "./routes/Login";
import Token from "./routes/VerifyToken";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter, Routes, Route } from "react-router-dom";
const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/">
          <Route index element={<Menu />} />
          <Route path="register/signup" element={<Signup />} />
          <Route path="register/login" element={<Login />} />
          <Route path="register/token" element={<Token />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
root.render(
  <React.StrictMode>
    <Router />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
