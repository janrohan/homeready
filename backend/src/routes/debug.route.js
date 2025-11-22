import express from "express";
import * as AvatarQuery from "../db/queries/avatars.js";

const router = express.Router();

// DEV DEBUG: return all avatars (no auth) — helpful during local development
router.get("/avatars", async (req, res) => {
  try {
    const rows = await AvatarQuery.getAllAvatars();
    res.json({ ok: true, avatars: rows });
  } catch (err) {
    console.error("/api/debug/avatars error", err);
    res.status(500).json({ error: "Failed to fetch avatars" });
  }
});

export default router;
