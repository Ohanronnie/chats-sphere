import express, { Application, Router, Request, Response } from "express";
import bodyparser from "body-parser";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import csrf from "csurf";
import { CorsConfig } from "./interfaces/cors.js";
import { IMessage } from "./interfaces/message.js";
import { defaultConfig } from "./controllers/config.js";
import register from "./routes/register.js";
import api from "./routes/chat.js";
import { createServer } from "http";
import { Server, Socket } from "socket.io";
dotenv.config();
const app: Application = express();
const http = createServer(app);
const io = new Server(http);
const config: CorsConfig = {
  origin: process.env.FRONTENDURL!,
  credentials: true,
};
const PORT = process.env.PORT || 3001;
app.use(bodyparser.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());
app.use(cors(config));
app.use(defaultConfig);
app.use("/register", register);
app.use("/api", api);
io.on("connection", function (socket: Socket) {
  console.log(`${socket.id} just connected`);
  socket.on("newMessage", function (message: IMessage) {
    console.log(message);
  });
  io.on("disconnect", function () {
    console.log(`${socket.id} just disconnected`);
  });
});
http.listen(PORT, () => {
  console.log(`App is up and running at port ${PORT}`);
});
