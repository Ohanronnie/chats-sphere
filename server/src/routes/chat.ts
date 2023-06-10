import { Router, Request, IRouter, Response } from "express";
import Chat from "../controllers/chat.js";

const router: IRouter = Router();
router.get("me", Chat.myId);
export default router;
