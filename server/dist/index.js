import express from "express";
import bodyparser from "body-parser";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import { defaultConfig } from "./controllers/config.js";
import register from "./routes/register.js";
import { createServer } from "http";
import socketIO from "socket.io";
dotenv.config();
const app = express();
const http = createServer(app);
const io = socketIO(http);
const config = {
    origin: process.env.FRONTENDURL,
    credentials: true,
};
const PORT = process.env.PORT || 3001;
app.use(bodyparser.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());
app.use(cors(config));
app.use(defaultConfig);
app.use("/register", register);
io.on("connection", function (socket) {
    console.log(`${socket.id} just connected`);
    socket.on("newMessage", function (message) {
        console.log(message);
    });
    io.on("disconnect", function () {
        console.log(`${socket.id} just disconnected`);
    });
});
http.listen(PORT, () => {
    console.log(`App is up and running at port ${PORT}`);
});
