import * as AvatarQuery from "../db/queries/avatars.js";

export async function createAvatar(data) {
    if (process.env.NODE_ENV !== 'production') {
        try {
            console.debug('[service.createAvatar] payload:', data);
        } catch (e) {
            console.debug('[service.createAvatar] failed to log payload');
        }
    }

    try {
        const avatar = await AvatarQuery.createAvatar(data);
        return avatar;
    } catch (err) {
        console.error('[service.createAvatar] error:', err && err.stack ? err.stack : err);
        throw err;
    }
}

export async function getAvatarsForUser(userId) {
    return await AvatarQuery.getAvatarsByUser(userId);
}
