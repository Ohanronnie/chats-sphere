import User from "../models/User.js";
import cloudinary from "../utils/cloudinary.js";
import jwt from "jsonwebtoken";
class Update {
    constructor() { }
    static async data(req, res) {
        try {
            let token = req.headers["authorisation"];
            token = token?.split(" ")?.[1]?.trim();
            const payload = jwt.verify(token, process.env.SECRET_KEY);
            const response = (await User.findOne({ email: payload.email }));
            return res.status(200).json({ cover: response.cover });
        }
        catch (err) {
            return res.status(500).json();
        }
    }
    static async image(req, res) {
        let file = req.file;
        let path;
        const upload = async (path) => await cloudinary(path, "Image");
        if (file)
            path = req.file.path;
        else
            return res.status(401).json(null);
        const url = await upload(path);
        try {
            let token = req.headers["authorisation"];
            token = token?.split(" ")?.[1]?.trim();
            const payload = jwt.verify(token, process.env.SECRET_KEY);
            const response = (await User.findOne({ email: payload.email }));
            response.cover = url.url;
            await response.save();
            console.log(response);
            res.status(200).json(null);
        }
        catch (err) {
            console.log(err);
            res.status(500).json(null);
        }
    }
}
export default Update;
