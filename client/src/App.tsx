import Menu from "./routes/Menu";
import Signup from "./routes/Register";
import Login from "./routes/Login";
import Chats from "./routes/Chats";
import AddChats from "./routes/AddChat";
import Home from "./routes/Home";
import Token from "./routes/VerifyToken";
import { io, Socket } from "socket.io-client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
const socket: Socket = io("http://localhost:3001");
export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/">
          <Route index element={<Menu />} />
          <Route path="register/signup" element={<Signup />} />
          <Route path="register/login" element={<Login />} />
          <Route path="register/token" element={<Token />} />
          <Route path="home" element={<Home />} />
          <Route path="chats" element={<Chats />} />
          <Route path="adduser" element={<AddChats />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
