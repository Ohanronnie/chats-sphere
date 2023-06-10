import { Response, Request } from "express";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
class Chat {
  constructor() {}
  static async myId(req: Request, res: Response) {
    let token = <string>req.headers["Authorisation"];
    token = token?.split(" ")?.[1]?.trim();
    interface IPayload {
      email: string;
      _id: string;
    }
    try {
      const payload = jwt.verify(token, process.env.SECRET_KEY!) as IPayload;
      return res.status(200).json(payload._id);
    } catch (err: any) {
      return res.status(300).json({ message: "Expired Token" });
    }
  }
}
export default Chat;
