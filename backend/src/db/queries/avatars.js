import db from "../index.js";

export async function createAvatar(data) {
    const res = await db.query(
        "INSERT INTO avatars (user_id, name, gender, age, educationLevel, educationField, occupation, income, savings, debt) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *",
        [data.user_id, data.name, data.gender || null, data.age || null, data.education || null, data.educationField || null, data.occupation || null, data.income || 0, data.savings || 0, data.debt || 0]
    );
    return res.rows[0];
}

export async function getAvatarsByUser(user_id) {
    const res = await db.query(
        "SELECT * FROM avatars WHERE user_id = $1 ORDER BY id",
        [user_id]
    );
    return res.rows;
}
