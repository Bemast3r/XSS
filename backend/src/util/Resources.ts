import mongoose from "mongoose";

export type UserResource = {
    id?: string;
    name: string;
    username: string;
    password?: string;
    admin?: boolean;
    createdAt?: Date;
}


export type LoginResource = {
    /** The JWT */
    "access_token": string,
    /** Constant value */
    "token_type": "Bearer"
}