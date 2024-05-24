
import { JwtPayload , sign, verify } from "jsonwebtoken";
import { login } from "../Login/authentication/AuthenticationService";

const mongoUrl = process.env.MONGO_URL;
const jwtSecret = process.env.JWT_SECRET || "VerySecret";
const jwtTTL = process.env.JWT_TTL || "1d";

export async function verifyPasswordAndCreateJWT(username: string, password: string): Promise<string | undefined> {

    const secret = jwtSecret
    if (!secret) {
        throw Error("JWT_SECRET not set.");
    }

    const ttl = jwtTTL
    if (!ttl) {
        throw new Error("JWT_TTL not set.");
    }

    const loginResult = await login(username, password);
    if ((loginResult).success === false) {
        return undefined;
    }
    const timeInSec = Math.floor(Date.now() / 1000);
    const payload: JwtPayload = {
        sub: loginResult.id,
        name: loginResult.name,
        iat: timeInSec, 
        role: loginResult.role
    };
    return sign(payload, secret, { algorithm: "HS512", expiresIn: ttl });
}

export function verifyJWT(jwtString: string | undefined): { userId: string, role: "u" | "a", name: string } {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        throw Error("JWT_SECRET not set.");
    }

    const ttl = process.env.JWT_TTL;
    if (!ttl) {
        throw new Error("JWT_TTL not set.");
    }

    if (!jwtString) {
        throw new Error("Invalid token.");
    }

    try {
        const payload = verify(jwtString, secret);
        if (
            typeof payload === 'object' &&
            "sub" in payload && payload.sub &&
            "role" in payload && payload.role && "name" in payload &&
            payload.name
        ) {
            return { userId: payload.sub, role: payload.role , name: payload.name};
        }
    } catch (err: any) {
        throw new Error(err.message);
    }
    throw new Error("Invalid payload.");
}