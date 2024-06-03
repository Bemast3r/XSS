import { UserResource } from "../util/Resources";
import { IUser, User } from "../Model/UserModel";
import { Types } from "mongoose"


async function mapUserToResource(user: IUser & { _id: Types.ObjectId; }): Promise<UserResource> {
    const userResource: UserResource = {
        id: user._id.toString(),
        name: user.name,
        admin: user.admin,
        createdAt: user.createdAt,
        bio: user.bio
    };
    return userResource;
}

export async function getUser(userid: string) {
    const user = await User.findById(userid).exec();
    if (!user) {
        throw new Error(`Kein User mit ID ${userid} gefunden.`);
    }
    const mapped = await mapUserToResource(user);
    return mapped
}


export async function getUsersFromDB(): Promise<UserResource[]> {
    const users = await User.find().sort({ nachname: 1 });
    if (!users) {
        throw new Error(`Keine User gefunden.`);
    }
    const userResources = await Promise.all(users.map(user => mapUserToResource(user)));
    return userResources;
}

export async function createUser(userResource: UserResource): Promise<UserResource> {
    const user = await User.create({
        name: userResource.name,
        password: userResource.password,
        admin: userResource.admin,
        bio: userResource.bio,
    });

    if (!user) {
        throw new Error(`Keine User erstellen können.`);
    }
    const mapped = await mapUserToResource(user)
    return mapped
}

export async function updateUser(userResource: UserResource): Promise<UserResource> {
    if (!userResource.id) {
        throw new Error("User ID missing, cannot update.");
    }
    const user = await User.findById(userResource.id).exec();
    if (!user) {

        throw new Error(`No user with ID ${userResource.id} found, cannot update.`);
    }

    if (userResource.name) user.name = userResource.name;
    if (userResource.bio) user.bio = userResource.bio;
    if (userResource.password) user.password = userResource.password;
    if (typeof userResource.admin === 'boolean') user.admin = userResource.admin;
    const savedUser = await user.save();
    const mapped = await mapUserToResource(savedUser)
    return mapped
}

export async function deleteUser(userId: string): Promise<void> {
    try {
        await User.findByIdAndDelete(userId);
    } catch (error: any) {
        throw new Error(`Fehler beim Löschen des Benutzers: ${(error as Error).message}`);
    }
}

export async function getAlleUser(): Promise<UserResource[]> {
    try {
        const users = await getUsersFromDB();
        return users;
    } catch (error: any) {
        throw new Error(`Fehler beim Abrufen aller Benutzer: ${error.message}`);
    }
}

export async function getAlleAdmin(): Promise<UserResource[]> {
    try {
        const users = await getUsersFromDB();
        const admins = users.filter(user => user.admin);
        return admins;
    } catch (error:any) {
        throw new Error(`Fehler beim Abrufen aller Admin-Benutzer: ${error.message}`);
    }
}



