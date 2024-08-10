import { User } from "../User/UserModel";

export async function prefillAdmin() {
    const admin = await User.findOne({ name: "Admin" }).exec();
    if (admin) {
        return;
    }
    await User.create({
        name: "Admin",
        password: "abcABC123!",
        admin: true
    });
    console.log("Successfully created default admin");
}

export async function prefillUser() {
    const admin = await User.findOne({ name: "User" }).exec();
    if (admin) {
        return;
    }
    await User.create({
        name: "User",
        password: "abcABC123!",
        admin: false
    });
    console.log("Successfully created default user");
}