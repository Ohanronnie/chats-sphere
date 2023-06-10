import jwt from "jsonwebtoken";
class Chat {
    constructor() { }
    static async myId(req, res) {
        let token = req.headers["Authorisation"];
        token = token?.split(" ")?.[1]?.trim();
        try {
            const payload = jwt.verify(token, process.env.SECRET_KEY);
            return res.status(200).json(payload._id);
        }
        catch (err) {
            return res.status(300).json({ message: "Expired Token" });
        }
    }
}
export default Chat;
