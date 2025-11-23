import db from "../index.js";
import Avatar from "../../models/Avatar.js";

export async function createAvatar(data) {
    const text = `
        INSERT INTO avatars (
            user_id,
            name,
            age,
            gender,
            region,
            education_level,
            education_field,
            occupation_category,
            income,
            income_growth_rate,
            savings,
            savings_rate,
            debt,
            property_price,
            price_per_sqm,
            property_type
        ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16)
        RETURNING *
        `;

        const params = [
            data.userId,
            data.name,
            data.age,
            data.gender,
            data.region,
            data.education_level,
            data.education_field,
            data.occupation_category,
            data.income,
            data.income_growth_rate,
            data.savings,
            data.savings_rate,
            data.debt,
            data.property_price,
            data.price_per_sqm,
            data.property_type
        ];

        try {
            const res = await db.query(text, params);
            return new Avatar(res.rows[0]);
          } catch (err) {
            console.error("[queries.createAvatar] DB error:", err);
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
