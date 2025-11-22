import express from "express";
import avatarRoutes from "./avatar.route.js";
import authRoutes from "./auth.route.js";
import storyRoutes from "./story.route.js";

const router = express.Router();

// auth
router.use("/auth", authRoutes);

// avatars (protected)
router.use("/avatars", avatarRoutes);

// story save/list
router.use("/story", storyRoutes);

export default router;
