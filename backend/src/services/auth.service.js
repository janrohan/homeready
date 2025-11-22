import bcrypt from "bcrypt";
import * as UserQuery from "../db/queries/users.js";

const SALT_ROUNDS = 10;

export async function registerUser({ username, email, password }) {
    const existing = await UserQuery.findByUsername(username);
    if (existing) throw new Error("Username already taken");

    const hash = await bcrypt.hash(password, SALT_ROUNDS);
    const user = await UserQuery.createUser({ username, email, passwordHash: hash });
    return user;
}

export async function authenticateUser({ username, password }) {
    const pwdHash = await UserQuery.getPasswordHashByUsername(username);
    if (!pwdHash) return null;
    const match = await bcrypt.compare(password, pwdHash);
    if (!match) return null;
    const user = await UserQuery.findByUsername(username);
    return user;
}
