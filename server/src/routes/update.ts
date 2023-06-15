import { Router, Request, IRouter, Response } from "express";
import Update from "../controllers/update.js";
import Multer from "../utils/multer.js";
const router: IRouter = Router();
router.post("/image", Multer.single("image"), Update.image);
router.post("/data", Update.data);
export default router;
