import express from "express";
import avatarRoutes from "./avatar.route.js";
import authRoutes from "./auth.route.js";

const router = express.Router();

// auth
router.use("/auth", authRoutes);

// avatars (protected)
router.use("/avatars", avatarRoutes);

export default router;
