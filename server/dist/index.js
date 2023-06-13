import express from "express";
import bodyparser from "body-parser";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import { defaultConfig } from "./controllers/config.js";
import register from "./routes/register.js";
import api from "./routes/chat.js";
import { createServer } from "http";
import { Server } from "socket.io";
import User from "./models/User.js";
import Chat from "./models/Chat.js";
dotenv.config();
const app = express();
const http = createServer(app);
const io = new Server(http, {
    cors: {
        origin: process.env.FRONTENDURL,
        methods: ["GET", "POST"],
    },
});
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
app.use("/api", api);
io.on("connection", function (socket) {
    console.log(`${socket.id} just connected`);
    socket.on("newMessage", async function (data) {
        let { from, to, createdAt, message } = data;
        console.log(data);
        let sender = (await User.findOne({ _id: from }).select("email"));
        let receiver = (await User.findOne({ _id: to }).select("email"));
        let senderChat = (await Chat.findOne({ email: sender.email }));
        let receiverChat = (await Chat.findOne({ email: receiver.email }));
        if (senderChat.chats.length === 0 ||
            !senderChat.chats.find((e) => e.hasOwnProperty(receiver._id))) {
            senderChat.chats.push({
                [receiver._id]: [
                    {
                        from: sender._id,
                        to: receiver._id,
                        message,
                        createdAt,
                    },
                ],
            });
            await Chat.updateOne({ _id: senderChat._id }, senderChat);
        }
        else {
            senderChat.chats.forEach((e) => {
                if (e.hasOwnProperty(receiver._id)) {
                    e[receiver._id].push({
                        from: sender._id,
                        to: receiver._id,
                        message,
                        createdAt,
                    });
                }
            });
            await Chat.updateOne({ _id: senderChat._id }, senderChat);
        }
        if (receiverChat.chats.length === 0 ||
            !receiverChat.chats.find((e) => e.hasOwnProperty(sender._id))) {
            receiverChat.chats.push({
                [sender._id]: [
                    {
                        from: sender._id,
                        to: receiver._id,
                        message,
                        createdAt,
                    },
                ],
            });
            await Chat.updateOne({ _id: receiverChat._id }, receiverChat);
        }
        else {
            receiverChat.chats.forEach((e) => {
                if (e.hasOwnProperty(sender._id)) {
                    e[sender._id].push({
                        from: sender._id,
                        to: receiver._id,
                        message,
                        createdAt,
                    });
                }
            });
            await Chat.updateOne({ _id: receiverChat._id }, receiverChat);
        }
        io.emit("message", { message, to, from, createdAt });
    });
    io.on("disconnect", function () {
        console.log(`${socket.id} just disconnected`);
    });
});
http.listen(PORT, () => {
    console.log(`App is up and running at port ${PORT}`);
});
