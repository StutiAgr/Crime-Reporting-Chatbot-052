import express from "express";
import {
  loginWithPassword,
  logout,
  signup,
} from "../controllers/auth.controller.js";
import { protect } from "../controllers/auth.controller.js";
const router = express.Router();
router
  .post("/login", loginWithPassword)
  .post("/signup", signup)
  .post("/logout", logout)

export default router;