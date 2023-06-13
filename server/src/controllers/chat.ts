import { Response, Request } from "express";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Chat from "../models/Chat.js";
class ChatController {
  constructor() {}
  static async myId(req: Request, res: Response) {
    let token = <string>req.headers["authorisation"];
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
  static async userExists(
    req: Request,
    res: Response
  ): Promise<Response | undefined> {
    let { email } = req.query as {
      email: string;
    };
    let message = (text: string): { message: string } => ({
      message: text,
    });
    try {
      let token = <string>req.headers["authorisation"];
      token = token?.split(" ")?.[1]?.trim();
      console.log(token);
      interface IPayload {
        email: string;
        _id: string;
      }
      const payload = jwt.verify(token, process.env.SECRET_KEY!) as IPayload;

      let isUserExist = await User.findOne({
        email: email,
      })!;
      if (!isUserExist) return res.status(302).json(null);
      else
        return res.status(200).json({
          from: payload._id,
          to: isUserExist._id,
        });
    } catch (err: any) {
      console.log(err);
      return res.status(500).json(message("Error occurred somewhere"));
    }
  }
  static async messageList(req: Request, res: Response) {
    let token = <string>req.headers["authorisation"];
    token = token?.split(" ")?.[1]?.trim();
    try {
      interface IPayload {
        email: string;
        _id: string;
      }
      const payload = jwt.verify(token, process.env.SECRET_KEY!) as IPayload;
      let response = (await Chat.findOne({ email: payload.email }).select(
        "chats"
      ))!;
      return res.status(200).json(response.chats);
    } catch (err: any) {
      return res.status(500).json([]);
    }
  }
  static async message(req: Request, res: Response) {
    let token = <string>req.headers["authorisation"];
    token = token?.split(" ")?.[1]?.trim();
    let id = req.body.id!;
    try {
      interface IPayload {
        email: string;
        _id: string;
      }
      const payload = jwt.verify(token, process.env.SECRET_KEY!) as IPayload;
      let response = (await Chat.findOne({ email: payload.email }).select(
        "chats"
      ))!;
      let details = (await User.findOne({ email: payload.email }).select(
        "firstName lastName"
      ))!;
      let json = response.chats.map((e: any) => {
        if (e.hasOwnProperty(id)) {
          return e[id];
        }
      });

      return res.status(200).json(
        Array.isArray(json)
          ? {
              id: details._id,
              name: `${details.firstName} ${details.lastName}`,
              message: json[0],
            }
          : []
      );
    } catch (err: any) {
      console.log(err);
      return res.status(500).json([]);
    }
  }
}
export default ChatController;
