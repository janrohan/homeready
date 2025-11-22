import express from "express";
import avatarRoutes from "./avatar.routes.js";

const router = express.Router();

// group routes
router.use("/avatars", avatarRoutes);

export default router;
