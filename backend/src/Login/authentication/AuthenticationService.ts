import { User } from "../../Model/UserModel";


export async function login(username: string, password: string): Promise<{ success: boolean, id?: string, name?: string, role?: "u" | "a" | "m" }> {
    if (!password) {
        throw new Error("password is not defined");
    }
    const user = await User.findOne({ username: username }).exec();

    if (!user) {
        return { success: false };
    }

    if (!(await user.isPasswordCorrect(password))) {
        return { success: false };
    }

    if (user.admin) {
        return { success: true, id: user._id.toString(), name: user.name, role: "a" };

    } else if (user.mod) {
        return { success: true, id: user._id.toString(), name: user.name, role: "m" };

    } else {
        return { success: true, id: user._id.toString(), name: user.name, role: "u" };
    }
};
