import { createAvatar } from "../services/avatar.service.js";

export async function createAvatarController(req, res) {
    try {
        const avatar = await createAvatar(req.body);
        res.json(avatar);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error creating avatar" });
    }
}
