import express from "express";
import bodyparser from "body-parser";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import { defaultConfig } from "./controllers/config.js";
import register from "./routes/register.js";
import api from "./routes/chat.js";
import update from "./routes/update.js";
import { createServer } from "http";
import { Server } from "socket.io";
import { ChatMessage } from "./controllers/chatMessage.js";
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
io.on("connection", function (socket) {
    console.log(`${socket.id} just connected`);
    socket.on("newMessage", async function (data) {
        let { from, to, url, createdAt, message } = data;
        try {
            await ChatMessage(data);
            io.emit("message", { message, to, url, from, createdAt });
        }
        catch (err) {
            return;
        }
    });
    io.on("disconnect", function () {
        console.log(`${socket.id} just disconnected`);
    });
});
http.listen(PORT, () => {
    console.log(`App is up and running at port ${PORT}`);
});
