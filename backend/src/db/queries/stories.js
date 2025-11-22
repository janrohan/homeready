import db from "../index.js";

export async function createStory({ userId = null, decisions }) {
  const res = await db.query(
    `INSERT INTO stories (user_id, decisions) VALUES ($1, $2) RETURNING id, user_id, decisions, created_at`,
    [userId, decisions]
  );
  return res.rows[0];
}

export async function listStoriesByUser(userId) {
  const res = await db.query(
    `SELECT id, user_id, decisions, created_at FROM stories WHERE user_id = $1 ORDER BY created_at DESC`,
    [userId]
  );
  return res.rows;
}
