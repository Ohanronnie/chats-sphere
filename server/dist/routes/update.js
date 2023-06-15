import { Router } from "express";
import Update from "../controllers/update.js";
import Multer from "../utils/multer.js";
const router = Router();
router.post("/image", Multer.single("image"), Update.image);
router.post("/data", Update.data);
export default router;
