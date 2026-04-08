import express from "express";
import { sendMessage, getChatHistory } from "../controllers/chatbot.controller.js";

const router = express.Router();

// Send message to chatbot
router.post("/message", sendMessage);

// Get chat history
router.get("/history/:sender", getChatHistory);

export default router;
