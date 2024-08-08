import { User } from "../../User/UserModel";


export async function login(name: string, password: string): Promise<{ success: boolean, id?: string, name?: string, role?: "u" | "a"  }> {
    if (!password) {
        throw new Error("password is not defined");
    }
    const user = await User.findOne({ name }).exec();

    if (!user) {
        return { success: false };
    }

    if (!(await user.isPasswordCorrect(password))) {
        return { success: false };
    }

    if (user.admin) {
        return { success: true, id: user._id.toString(), name: user.name, role: "a" };

    } else {
        return { success: true, id: user._id.toString(), name: user.name, role: "u" };
    }
};
