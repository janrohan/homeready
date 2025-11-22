import { createAvatar, getAvatarsForUser } from "../services/avatar.service.js";

export async function createAvatarController(req, res) {
    try {
        const user = req.user;
        if (!user) return res.status(401).json({ error: "Unauthorized" });

        const payload = {
            user_id: user.id,
            name: req.body.name,
            gender: req.body.gender,
            age: req.body.age,
            occupation: req.body.occupation,
            income: req.body.income,
            savings: req.body.savings
        };

        const avatar = await createAvatar(payload);
        res.json(avatar);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error creating avatar" });
    }
}

export async function listAvatarsController(req, res) {
    try {
        const user = req.user;
        if (!user) return res.status(401).json({ error: "Unauthorized" });

        const avatars = await getAvatarsForUser(user.id);
        res.json(avatars);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error fetching avatars" });
    }
}
