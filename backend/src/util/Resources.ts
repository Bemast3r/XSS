
export type UserResource = {
    id?: string;
    name: string;
    password?: string;
    admin?: boolean;
    createdAt?: Date;
    bio?:string
}


export type LoginResource = {
    /** The JWT */
    "access_token": string,
    /** Constant value */
    "token_type": "Bearer"
}