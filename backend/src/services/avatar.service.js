import * as AvatarQuery from "../db/queries/avatars.js";

export async function createAvatar(data) {
    return await AvatarQuery.createAvatar(data);
}

export async function getAvatarsForUser(userId) {
    return await AvatarQuery.getAvatarsByUser(userId);
}
