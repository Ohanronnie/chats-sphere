import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Chat from "../models/Chat.js";
class ChatController {
    constructor() { }
    static async myId(req, res) {
        let token = req.headers["authorisation"];
        token = token?.split(" ")?.[1]?.trim();
        try {
            const payload = jwt.verify(token, process.env.SECRET_KEY);
            return res.status(200).json(payload._id);
        }
        catch (err) {
            return res.status(300).json({ message: "Expired Token" });
        }
    }
    static async userExists(req, res) {
        let { email } = req.query;
        let message = (text) => ({
            message: text,
        });
        try {
            let token = req.headers["authorisation"];
            token = token?.split(" ")?.[1]?.trim();
            console.log(token);
            const payload = jwt.verify(token, process.env.SECRET_KEY);
            let isUserExist = await User.findOne({
                email: email,
            });
            if (!isUserExist)
                return res.status(302).json(null);
            else
                return res.status(200).json({
                    from: payload._id,
                    to: isUserExist._id,
                });
        }
        catch (err) {
            console.log(err);
            return res.status(500).json(message("Error occurred somewhere"));
        }
    }
    static async messageList(req, res) {
        let token = req.headers["authorisation"];
        token = token?.split(" ")?.[1]?.trim();
        try {
            const payload = jwt.verify(token, process.env.SECRET_KEY);
            let response = (await Chat.findOne({ email: payload.email }).select("chats"));
            let userData = [];
            let user = (await User.findOne({ email: payload.email }).select("_id"));
            let keyList = [];
            response.chats.forEach((e) => keyList.push(...Object.keys(e)));
            console.log(keyList);
            let promises = keyList.map(async function (value, index) {
                let _detail = (await User.findOne({ _id: value }).select("firstName lastName cover"));
                let _each = response.chats[index][value];
                let lastMessage = _each[_each.length - 1];
                userData.push({
                    lastMessage: lastMessage.message,
                    createdAt: lastMessage.createdAt,
                    firstName: _detail.firstName,
                    lastName: _detail.lastName,
                    cover: _detail.cover,
                    id: _detail._id,
                });
            });
            await Promise.all(promises);
            let sorted = userData.sort((a, b) => new Date(b.lastMessage.createdAt).getTime() -
                new Date(a.lastMessage.createdAt).getTime());
            res.status(200).json({
                id: user._id,
                list: sorted,
            });
        }
        catch (err) {
            console.log(err);
            return res.status(500).json([]);
        }
    }
    static async message(req, res) {
        let token = req.headers["authorisation"];
        token = token?.split(" ")?.[1]?.trim();
        let id = req.body.id;
        try {
            const payload = jwt.verify(token, process.env.SECRET_KEY);
            let response = (await Chat.findOne({ email: payload.email }).select("chats"));
            let details = (await User.findOne({ _id: id }).select("firstName lastName cover isOnline"));
            let json = [];
            response.chats.forEach((e) => {
                if (e.hasOwnProperty(id)) {
                    json.push(e[id]);
                }
            });
            return res.status(200).json(Array.isArray(json)
                ? {
                    id: payload._id,
                    cover: details.cover,
                    name: `${details.firstName} ${details.lastName}`,
                    message: json[0],
                }
                : []);
        }
        catch (err) {
            console.log(err);
            return res.status(500).json([]);
        }
    }
}
export default ChatController;
