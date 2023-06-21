import { Request, Response } from "express";
import User from "../models/User.js";
import cloudinary from "../utils/cloudinary.js";
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
    const upload = async (path: string) => await cloudinary(path, "Image");
    if (file) path = req.file!.path;
    else return res.status(401).json(null);
    const url = await upload(path);
    try {
      let token = <string>req.headers["authorisation"];
      token = token?.split(" ")?.[1]?.trim();
      interface IPayload {
        email: string;
        _id: string;
      }
      const payload = jwt.verify(token, process.env.SECRET_KEY!) as IPayload;
      const response = (await User.findOne({ email: payload.email }))!;
      response.cover = url!.url;
      await response.save();
      res.status(200).json({ url: url!.url });
    } catch (err: any) {
      console.log(err);
      res.status(500).json({ url: null });
    }
  }
  static async messageImage(req: Request, res: Response) {
    try {
      let file = req.file!;
      let path;
      const upload = async (path: string) => await cloudinary(path, "Image");
      if (file) path = req.file!.path;
      else return res.status(401).json(null);
      const url = await upload(path);
      res.status(200).json({ url: url!.url });
    } catch (err: any) {
      return res.status(500).json(null);
    }
  }
}
export default Update;
