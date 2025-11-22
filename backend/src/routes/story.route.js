import express from "express";
import { createStoryController, listMyStoriesController } from "../controllers/story.controller.js";
import auth from "../middleware/auth.middleware.js";

const router = express.Router();

// public: accept story save even without auth (will be anonymous)
router.post("/", createStoryController);

// protected: list current user's saved stories
router.get("/my", auth, listMyStoriesController);

export default router;
