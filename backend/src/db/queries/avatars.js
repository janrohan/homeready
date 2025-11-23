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
            educationLevel,
            educationField,
            occupation,
            income,
            incomeGrowthRate,
            savings,
            savingsRate,
            debtLevel,
            propertyPrice,
            pricePerSqm,
            propertyType
        ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16)
        RETURNING *
        `;

        const params = [
            data.userId,
            data.name,
            data.age,
            data.gender,
            data.region,
            data.educationLevel,
            data.educationField,
            data.occupation,
            data.income,
            data.incomeGrowthRate,
            data.savings,
            data.savingsRate,
            data.debtLevel,
            data.propertyPrice,
            data.pricePerSqm,
            data.propertyType
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

export async function getLatestAvatarByUser(user_id) {
    const res = await db.query(
      "SELECT * FROM avatars WHERE user_id = $1 ORDER BY id DESC LIMIT 1",
      [user_id]
    );
    return res.rows[0] || null;
  }
