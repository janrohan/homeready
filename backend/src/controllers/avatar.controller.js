import { createAvatar, getAvatarsForUser } from "../services/avatar.service.js";

export async function createAvatarController(req, res) {
    try {
        const user = req.user;
        if (!user) return res.status(401).json({ error: "Unauthorized" });

        // dev-only logging of incoming body (do not log sensitive data in production)
        if (process.env.NODE_ENV !== 'production') {
            try {
                console.debug('[createAvatar] user:', { id: user.id, username: user.username });
                console.debug('[createAvatar] body:', req.body);
            } catch (e) {
                console.debug('[createAvatar] failed to log payload');
            }
        }

        const payload = {
            userId: user.id,
            name: req.body.name,
            gender: req.body.gender,
            age: req.body.age,
            educationLevel: req.body.educationLevel,
            educationField: req.body.educationField,
            occupation: req.body.occupation,
            income: req.body.income,
            savings: req.body.savings,
            debt: req.body.debt,
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
