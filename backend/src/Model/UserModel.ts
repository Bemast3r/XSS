import { Model, model, Schema, Types } from "mongoose";
import { hash, compare } from "bcryptjs";

export interface IUser {
    name: string
    password: string
    admin:boolean
    createdAt?: Date
}

export interface IUserMethods {
    isPasswordCorrect(c: string): Promise<boolean>
}

type UserModel = Model<IUser, {}, IUserMethods>;

const userSchema = new Schema<IUser, UserModel>({
    name: { type: String, required: true },
    password: { type: String, required: true },
    admin: { type: Boolean, default: false },
    createdAt: { type: Date }
}, { timestamps: true });

userSchema.method("isPasswordCorrect", async function (passwordCandidate: string): Promise<boolean> {
    if (this.isModified()) {
        throw new Error("User has been modified");
    }
    const result = await compare(passwordCandidate, this.password);
    return result;
})

userSchema.pre("save", async function (next) {
    if (this.isModified("password")) {
        const hashedPassword = await hash(this.password, 10);
        this.password = hashedPassword;
    }
    next();
});

export const User = model<IUser, UserModel>("User", userSchema);