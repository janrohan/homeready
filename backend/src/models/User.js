class User {
    constructor({ id, username, email = null, password_hash = null, created_at = null }) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.passwordHash = password_hash;
        this.createdAt = created_at;
    }

    // Safe serializer: omit passwordHash
    toJSON() {
        return {
            id: this.id,
            username: this.username,
            email: this.email,
            createdAt: this.createdAt,
        };
    }
}

export default User;
