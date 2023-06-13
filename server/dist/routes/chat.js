import { Router } from "express";
import Chat from "../controllers/chat.js";
const router = Router();
router.post("/me", Chat.myId);
router.get("/user", Chat.userExists);
router.post("/messagelist", Chat.messageList);
router.post("/message", Chat.message);
export default router;
