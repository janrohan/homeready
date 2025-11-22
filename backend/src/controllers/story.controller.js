import * as StoryQuery from "../db/queries/stories.js";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "change-this-secret";

export async function createStoryController(req, res) {
  try {
    const { decisions } = req.body || {};
    if (!decisions) return res.status(400).json({ error: "Missing decisions payload" });

    // Try to associate with user if token provided
    let userId = null;
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      try {
        const token = authHeader.split(" ")[1];
        const payload = jwt.verify(token, JWT_SECRET);
        if (payload && payload.id) userId = payload.id;
      } catch (err) {
        // ignore invalid token; story will be saved anonymously
      }
    }

    const row = await StoryQuery.createStory({ userId, decisions });
    return res.status(201).json({ ok: true, story: row });
  } catch (err) {
    console.error("createStoryController", err);
    return res.status(500).json({ error: "Failed to save story" });
  }
}

export async function listMyStoriesController(req, res) {
  try {
    // require auth middleware to call this; otherwise check token
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) return res.status(401).json({ error: "Missing token" });
    try {
      const token = authHeader.split(" ")[1];
      const payload = jwt.verify(token, JWT_SECRET);
      if (!payload || !payload.id) return res.status(401).json({ error: "Invalid token" });
      const stories = await StoryQuery.listStoriesByUser(payload.id);
      return res.json({ stories });
    } catch (err) {
      return res.status(401).json({ error: "Unauthorized" });
    }
  } catch (err) {
    console.error("listMyStoriesController", err);
    return res.status(500).json({ error: "Failed to list stories" });
  }
}
