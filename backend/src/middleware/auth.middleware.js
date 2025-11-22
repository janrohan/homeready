import jwt from "jsonwebtoken";
import * as UserQuery from "../db/queries/users.js";

const JWT_SECRET = process.env.JWT_SECRET || 'change-this-secret';

export default async function auth(req, res, next) {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) return res.status(401).json({ error: 'Missing token' });

        const token = authHeader.split(' ')[1];
        const payload = jwt.verify(token, JWT_SECRET);
        if (!payload || !payload.id) return res.status(401).json({ error: 'Invalid token' });

        const user = await UserQuery.findById(payload.id);
        if (!user) return res.status(401).json({ error: 'User not found' });

        req.user = user;
        next();
    } catch (err) {
        console.error(err);
        return res.status(401).json({ error: 'Unauthorized' });
    }
}
