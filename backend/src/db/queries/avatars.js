import db from "../index.js";

export async function createAvatar(data) {
    return db.query(
        "INSERT INTO avatars (user_id, name) VALUES ($1,$2) RETURNING *",
        [data.user_id, data.name]
    );
}
