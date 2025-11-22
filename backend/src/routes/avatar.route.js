import express from "express";
import { createAvatarController, listAvatarsController } from "../controllers/avatar.controller.js";
import auth from "../middleware/auth.middleware.js";

const router = express.Router();
router.use(auth);
router.post("/createAvatar", createAvatarController);
router.get("/listAvatar", listAvatarsController);

export default router;
