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
import update from "./routes/update.js";
import { createServer } from "http";
import { Server, Socket as _Socket } from "socket.io";
import jwt from "jsonwebtoken";
import User from "./models/User.js";
import fs from "fs";
import path from "path";
import Chat from "./models/Chat.js";
import { ChatMessage } from "./controllers/chatMessage.js";
dotenv.config();
const app: Application = express();
const http = createServer(app);
const io = new Server(http, {
  cors: {
    origin: process.env.FRONTENDURL!,
    methods: ["GET", "POST"],
  },
});
const config: CorsConfig = {
  origin: process.env.FRONTENDURL!,
  credentials: true,
  methods: ["GET", "POST"],
};
const PORT = process.env.PORT || 3001;
app.use(bodyparser.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());
app.use(cors(config));
/*app.get('/images/:id',(req: Request,res: Response) => {
  try{
  fs.createReadStream(`./images/${req.params.id}`).pipe(res)
  } catch(err: any){
    res.send(err)
  }
});*/
app.use("/images", express.static("./images"));
app.use(defaultConfig);
app.use("/register", register);
app.use("/api", api);
app.use("/update", update);
interface Socket extends _Socket {
  _userID?: string;
}
io.on("connection", function (socket: Socket) {
  console.log(`${socket.id} just connected`);
  socket.on("newMessage", async function (data: IMessage) {
    let { from, to, url, createdAt, message } = data;
    try {
      await ChatMessage(data);
      io.emit("message", { message, to, url, from, createdAt });
    } catch (err: any) {
      return;
    }
  });
  socket.on("active", async (id: { token: string }) => {
    try {
      let token = id.token;
      interface IPayload {
        email: string;
        _id: string;
      }
      const payload = jwt.verify(token, process.env.SECRET_KEY!) as IPayload;
      const _user = await User.findOne({ _id: payload._id });
      _user!.isOnline = true;
      _user!.save();
      socket._userID = payload._id;
    } catch (err: any) {}
  });
  socket.on("disconnect", async function () {
    if (socket._userID) {
      const _user = await User.findOne({ _id: socket._userID });
      _user!.isOnline = false;
      _user!.save();
    }
    console.log(`${socket.id} just disconnected`);
  });
});
http.listen(PORT, () => {
  console.log(`App is up and running at port ${PORT}`);
});
