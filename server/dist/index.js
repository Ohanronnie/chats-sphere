import express from "express";
import bodyparser from "body-parser";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import { defaultConfig } from "./controllers/config.js";
import register from "./routes/register.js";
dotenv.config();
const app = express();
/*app.use(cors({
  origin: process.env.FRONTENDURL + '/',
  methods: 'GET, POST, PUT, DELETE',
  allowedHeaders: 'Content-Type, Authorization'
}));*/
const config = {
    origin: process.env.FRONTENDURL,
    credentials: true,
};
const PORT = process.env.PORT || 3001;
app.use(bodyparser.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());
app.use(cors(config));
/*app.use(
  csrf({
    cookie: {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24, // 24hrs,
      sameSite: "strict",
    },
  })
);*/
app.use(defaultConfig);
app.use("/register", register);
app.get("/csrf", function (req, res) {
    let token = req.csrfToken();
    console.log(token);
    res.json(token);
    res.end();
});
app.listen(PORT, () => {
    console.log(`App is up and running at port ${PORT}`);
});
