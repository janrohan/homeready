import express from "express";
import { createAvatarController } from "../controllers/avatar.controller.js";

const router = express.Router();
router.post("/", createAvatarController);

export default router;
