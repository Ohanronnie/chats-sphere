import User from "../models/User.js";
import Chat from "../models/Chat.js";
import { SendMail } from "../utils/mail.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
dotenv.config();
console.log(process.env.SECRET_KEY);
function EmailRegex(email) {
    let regexp = /^[^\s@]+@[^\s@]+\.[a-z]+$/;
    try {
        return regexp.test(email);
    }
    catch (err) {
        return false;
    }
}
function UserNameRegex(username) {
    let regexp = /^[a-zA-Z0-9_ ]+$/;
    try {
        return regexp.test(username);
    }
    catch (err) {
        return false;
    }
}
function message(text) {
    return {
        message: text,
    };
}
export default class Register {
    constructor() { }
    static async signup(req, res) {
        try {
            let body = req.body;
            let { email, username, firstName, lastName, password, csrfToken } = body;
            // email validation
            if (!EmailRegex(email))
                return res.status(302).json(message("Invalid email format"));
            else if (username.length <= 4)
                return res.status(302).json(message("Username too short"));
            else if (!UserNameRegex(username))
                return res.status(302).json(message("Invalid username format"));
            else if (password.length < 6)
                return res.status(302).json(message("Password too short"));
            /*  else if (csrfToken !== req.csrfToken())
              return res.status(400).json(message("Request not valid"));*/ else if (firstName.length < 4 ||
                lastName.length < 4)
                return res.status(302).json(message("Name too short"));
            let UsernameExist = await User.findOne({
                username: username,
            });
            let EmailExist = await User.findOne({
                email: email,
            });
            if (UsernameExist)
                return res.status(302).json(message("Username exists"));
            else if (EmailExist)
                return res.status(302).json(message("Email exists"));
            let JwtToken = jwt.sign({ email: email, username: username }, process.env.SECRET_KEY, {
                expiresIn: "5y",
            });
            let UserModel = await User.create({
                firstName: firstName,
                lastName: lastName,
                username: username,
                password: password,
                status: "Pending",
                email: email,
                confirmCode: JwtToken,
                isOnline: false,
            });
            let ChatModel = await Chat.create({
                email: email,
                chats: [],
            });
            let MailSent = await SendMail(email, `${process.env.FRONTENDURL}/register/token?token=${JwtToken}`);
            res
                .status(300)
                .json(message("Click the link in your email to verify your email address"));
        }
        catch (err) {
            console.log(err);
            return res
                .status(err.code || 500)
                .json(message("Sorry, an error occurred"));
        }
    }
    static async login(req, res) {
        try {
            let body = req.body;
            let { csrfToken, email, password } = body;
            //      if (csrfToken !== req.csrfToken())
            //        return res.status(302).json(message("Request not valid"));
            let isEmailValid = await User.findOne({
                email: email,
            });
            if (!isEmailValid)
                return res.status(302).json(message("Invalid email address"));
            let isValid = bcrypt.compareSync(password, isEmailValid.password);
            if (!isValid)
                return res.status(302).json(message("Incorrect password"));
            else if (isEmailValid.status === "Pending")
                return res
                    .status(300)
                    .json(message("Please, click the link in your email to confirm your email"));
            else {
                let token = jwt.sign({ email: isEmailValid.email, _id: isEmailValid._id }, process.env.SECRET_KEY, {
                    expiresIn: "30d",
                });
                return res.status(200).json({ token: token });
            }
        }
        catch (err) {
            console.log(err);
            return res.status(302).json(message("Sorry, error occurred somewhere"));
        }
    }
    static async emailExists(req, res) {
        let { email } = req.query;
        try {
            let isMailExist = await User.findOne({
                email: email,
            });
            if (!EmailRegex(email))
                return res.status(302).json(message("Invalid email format"));
            else if (isMailExist)
                return res.status(302).json(message("Email exist"));
            else
                return res.status(200).json(null);
        }
        catch (err) {
            return res.status(302).json(message("Error occurred somewhere"));
        }
    }
    static async userExists(req, res) {
        let { username } = req.query;
        try {
            let isUserExist = await User.findOne({
                username: username,
            });
            if (username.length <= 4)
                return res.status(302).json(message("Username too short"));
            else if (!UserNameRegex(username))
                return res.status(302).json(message("Invalid username format"));
            else if (isUserExist)
                return res.status(302).json(message("Username exist"));
            else
                return res.status(200).json(null);
        }
        catch (err) {
            return res.status(302).json(message("Error occurred somewhere"));
        }
    }
    static async token(req, res) {
        const token = req.query.token;
        try {
            let payload = jwt.verify(token, process.env.SECRET_KEY);
            console.log(payload);
            let user = (await User.findOne({
                username: payload.username,
                email: payload.email,
            }));
            user.status = "Active";
            await user.save();
            return res.status(200).json({});
        }
        catch (err) {
            return res.status(302).json({ message: "Invalid Token" });
        }
    }
}
