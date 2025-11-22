import jwt from "jsonwebtoken";
import { registerUser, authenticateUser } from "../services/auth.service.js";

const JWT_SECRET = process.env.JWT_SECRET || 'change-this-secret';
const JWT_EXP = process.env.JWT_EXP || '7d';

export async function registerController(req, res) {
    try {
        const { username, email, password } = req.body;
        if (!username || !password) return res.status(400).json({ error: 'Missing username or password' });

        const user = await registerUser({ username, email, password });
        const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: JWT_EXP });
        res.json({ user, token });
    } catch (err) {
        console.error(err);
        res.status(400).json({ error: err.message || 'Registration failed' });
    }
}

export async function loginController(req, res) {
    try {
        const { username, password } = req.body;
        if (!username || !password) return res.status(400).json({ error: 'Missing username or password' });

        const user = await authenticateUser({ username, password });
        if (!user) return res.status(401).json({ error: 'Invalid credentials' });

        const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: JWT_EXP });
        res.json({ user, token });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Login failed' });
    }
}
