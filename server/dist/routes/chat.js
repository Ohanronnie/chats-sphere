import { Router } from "express";
import Chat from "../controllers/chat.js";
const router = Router();
router.get("me", Chat.myId);
export default router;
