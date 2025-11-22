import db from "../index.js";
import Avatar from "../../models/Avatar.js";

export async function createAvatar(data) {
    const text = "INSERT INTO avatars (user_id, name, gender, age, education_level, education_field, occupation, income, savings, debt) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *";
        const params = [
            data.userId,
            data.name,
            data.gender || null,
            data.age || null,
            // accept either camelCase or snake_case keys
            data.education || data.educationLevel || null,
            data.educationField || null,
            data.occupation || null,
            // income: support monthly or annual? use provided numeric value
            (data.income != null ? data.income : (data.startingIncome != null ? data.startingIncome : 0)),
            data.savings || 0,
            data.debt || 0,
        ];

        if (process.env.NODE_ENV !== 'production') {
            try {
                console.debug('[queries.createAvatar] SQL:', text);
                console.debug('[queries.createAvatar] params:', params);
            } catch (e) {
                console.debug('[queries.createAvatar] failed to log SQL or params');
            }
        }

        try {
            const res = await db.query(text, params);
            return new Avatar(res.rows[0]);
        } catch (err) {
            console.error('[queries.createAvatar] DB error:', err && err.stack ? err.stack : err);
            throw err;
        }
}

export async function getAvatarsByUser(user_id) {
    const res = await db.query(
        "SELECT * FROM avatars WHERE user_id = $1 ORDER BY id",
        [user_id]
    );
    return res.rows;
}

export async function getAllAvatars() {
    const res = await db.query(
        "SELECT * FROM avatars ORDER BY id DESC"
    );
    return res.rows;
}
