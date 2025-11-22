// test.js
import db from "./db/index.js";

async function test() {
    try {
        // 1️⃣ Insert a test user
        const insertUser = await db.query(
            "INSERT INTO users (username, password_hash) VALUES ($1, $2) RETURNING *",
            ["testuser", "hashedpassword123"]
        );
        console.log("Inserted user:", insertUser.rows[0]);

        // 2️⃣ Query all users
        const users = await db.query("SELECT * FROM users");
        console.log("All users:", users.rows);

        // 3️⃣ Insert a test avatar for that user
        const insertAvatar = await db.query(
            `INSERT INTO avatars (user_id, name, gender, age, occupation, income, savings)
             VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
            [insertUser.rows[0].id, "Avatar1", "male", 30, "Engineer", 4000, 10000]
        );
        console.log("Inserted avatar:", insertAvatar.rows[0]);

        // 4️⃣ Query all avatars
        const avatars = await db.query("SELECT * FROM avatars");
        console.log("All avatars:", avatars.rows);

    } catch (err) {
        console.error("Error:", err);
    } finally {
        // Close the DB connection
        db.pool.end();
    }
}

test();
