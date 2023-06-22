import Menu from "./routes/Menu";
import Signup from "./routes/Register";
import Login from "./routes/Login";
import Chats from "./routes/Chats";
import AddChats from "./routes/AddChat";
import Home from "./routes/Home";
import Token from "./routes/VerifyToken";
import Upload from "./routes/Upload";
import ImageUpload from "./routes/UploadImage";
import { io, Socket } from "socket.io-client";
import { useEffect, useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";
import axios from "./utils/axios.ts";

function ProtectedRoute() {
  const [loading, setLoading] = useState<boolean>(true);
  const [valid, setValid] = useState<boolean>(false);
  useEffect(function () {
    axios()
      .post("/api/me")
      .then((response) => {
        setValid(true);
        setLoading(false);
      })
      .catch((error) => {
        setValid(false);
        setLoading(false);
      });
  }, []);
  //return !loading && valid ? children : <Navigate to="/register/login" replace />
  if (!loading && valid) return <Outlet />;
  else if (!loading && !valid) return <Navigate to="/register/login" replace />;
}
export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/">
          <Route index element={<Menu />} />
          <Route path="register/signup" element={<Signup />} />
          <Route path="register/login" element={<Login />} />
          <Route path="register/token" element={<Token />} />
          <Route
            path="home"
            element={
              <ProtectedRoute>
                <Home />{" "}
              </ProtectedRoute>
            }
          />
          <Route
            path="chats/:userId"
            element={
              <ProtectedRoute>
                <Chats />{" "}
              </ProtectedRoute>
            }
          />
          <Route
            path="adduser"
            element={
              <ProtectedRoute>
                <AddChats />{" "}
              </ProtectedRoute>
            }
          />
          <Route
            path="upload"
            element={
              <ProtectedRoute>
                <Upload />{" "}
              </ProtectedRoute>
            }
          />
          <Route path="imageupload/:to/:from" element={<ProtectedRoute />}>
            <Route path="" element={<ImageUpload />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
