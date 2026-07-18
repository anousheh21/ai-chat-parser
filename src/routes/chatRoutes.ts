import { Router } from "express";
import { chatControllerPost } from "../controllers/chatController.js";

const router = Router();

router.post("/v1/chat-parser", chatControllerPost);

export default router;