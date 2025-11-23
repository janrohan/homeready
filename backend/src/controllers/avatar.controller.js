import { createAvatar, getAvatarsForUser } from "../services/avatar.service.js";
import * as avatarQueries from "../db/queries/avatars.js";

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
            age: req.body.age,
            gender: req.body.gender,
            region: req.body.region,
            educationLevel: req.body.educationLevel,
            educationField: req.body.educationField,
            occupation: req.body.occupation,
            income: req.body.income,
            incomeGrowthRate: req.body.incomeGrowthRate,
            savings: req.body.savings,
            savingsRate: req.body.savingsRate,
            debtLevel: req.body.debt,
            propertyPrice: req.body.propertyPrice,
            pricePerSqm: req.body.pricePerSqm,
            propertyType: req.body.propertyType
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

export async function getLatestAvatarController(req, res) {
    try {
      const user = req.user; // from auth middleware
      if (!user) return res.status(401).json({ error: "Unauthorized" });
  
      const avatars = await avatarQueries.getLatestAvatarByUser(user.id);
      if (!avatars) {
        return res.status(404).json({ error: "No avatar found for user" });
      }
  
      res.json({ success: true, avatar: avatars });
    } catch (err) {
      console.error("[getLatestAvatarController] error:", err);
      res.status(500).json({ error: "Server error retrieving avatar" });
    }
  }
