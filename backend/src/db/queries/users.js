import db from "../index.js";
import User from "../../models/User.js";

export async function createUser({ username, email = null, passwordHash }) {
    const res = await db.query(
        "INSERT INTO users (username, email, password_hash) VALUES ($1,$2,$3) RETURNING id, username, email, password_hash, created_at",
        [username, email, passwordHash]
    );
    return new User(res.rows[0]);
}

export async function findByUsername(username) {
    const res = await db.query(
        "SELECT * FROM users WHERE username = $1 LIMIT 1",
        [username]
    );
    const row = res.rows[0];
    return row ? new User(row) : null;
}

export async function findById(id) {
    const res = await db.query(
        "SELECT id, username, email, password_hash, created_at FROM users WHERE id = $1 LIMIT 1",
        [id]
    );
    const row = res.rows[0];
    return row ? new User(row) : null;
}

export async function getPasswordHashByUsername(username) {
    const res = await db.query(
        "SELECT password_hash FROM users WHERE username = $1 LIMIT 1",
        [username]
    );
    return res.rows[0] && res.rows[0].password_hash;
}
