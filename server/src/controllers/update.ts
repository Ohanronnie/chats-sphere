import { Request, Response } from "express";
import User from "../models/User.js";
import jwt from "jsonwebtoken";
class Update {
  constructor() {}
  static async data(req: Request, res: Response) {
    try {
      let token = <string>req.headers["authorisation"];
      token = token?.split(" ")?.[1]?.trim();
      interface IPayload {
        email: string;
        _id: string;
      }
      const payload = jwt.verify(token, process.env.SECRET_KEY!) as IPayload;
      const response = (await User.findOne({ email: payload.email }))!;
      return res.status(200).json({ cover: response.cover });
    } catch (err: any) {
      return res.status(500).json();
    }
  }
  static async image(req: Request, res: Response) {
    let file = req.file!;
    let path;
    if (file) path = req.file!.path;
    else return res.status(401).json(null);
    try {
      let token = <string>req.headers["authorisation"];
      token = token?.split(" ")?.[1]?.trim();
      interface IPayload {
        email: string;
        _id: string;
      }
      const payload = jwt.verify(token, process.env.SECRET_KEY!) as IPayload;
      const response = (await User.findOne({ email: payload.email }))!;
      response.cover = path;
      await response.save();
      console.log(response);
      res.status(200).json(null);
    } catch (err: any) {
      console.log(err);
      res.status(500).json(null);
    }
  }
}
export default Update;
