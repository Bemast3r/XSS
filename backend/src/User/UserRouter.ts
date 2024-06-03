import { requiresAuthentication } from "../Middleware/auth";
import { UserResource } from "../util/Resources";
import express from "express";
import { body, matchedData, param, validationResult } from "express-validator";
import { getUsersFromDB, getUser, getAlleUser, getAlleAdmin, createUser, updateUser, deleteUser } from "./UserService";

export const userRouter = express.Router();

/**
 * Holt alle User
 */
userRouter.get("/admin/users", requiresAuthentication,
    async (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        try {
            if (req.role !== "a") {
                return res.sendStatus(403)
            }
            const users = await getUsersFromDB();
            return res.send(users); // 200 by default
        } catch (err) {
            res.status(400);
            next(err);
        }
    }
);


/**
 * Suche einen User
 */
userRouter.get("/finde/:id", requiresAuthentication,
    param("id").isMongoId(),
    async (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        try {
            const user = await getUser(req.params.id)
            return res.send(user)
        } catch (error) {
            res.status(400);
            next(error);
        }
    }
);

userRouter.get("/admin/alle", requiresAuthentication,
    async (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        try {
            if (req.role !== "a") {
                return res.sendStatus(403)
            }
            const user = await getAlleUser()
            return res.send(user)
        } catch (error) {
            res.status(400);
            next(error);
        }
    }
);


userRouter.get("/alle/admin", requiresAuthentication,
    async (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        try {
            if (req.role !== "a") {
                return res.sendStatus(403)
            }
            const user = await getAlleAdmin()
            return res.send(user)
        } catch (error) {
            res.status(400);
            next(error);
        }
    }
);



/**
 * Erstellt einen Benutzer 
 */
userRouter.post("/user-erstellen", requiresAuthentication,
    body("name").isString(),
    body("password").isString(),
    body("admin").isBoolean(),

    async (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        try {
            const userRes = matchedData(req) as UserResource
            const user = await createUser(userRes);
            return res.send(user); // 200 by default
        } catch (err) {
            res.status(400);
            next(err);
        }
    }
);


/**
 * Ändere einen User.
 */
userRouter.put("/aendern", requiresAuthentication,
    body("name").optional().isString(),
    body("bio").optional().isString(),
    body("password").optional().isString(),
    body("admin").optional().isBoolean(),
    async (req: any, res: any, next: any) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        try {
            const userRes = req.body as UserResource; 
            const user = await updateUser(userRes);
            return res.send(user);
        } catch (error) {
            res.status(400);
            next(error);
        }
    }
);

/**
 * Löscht den Benutzer
 */
userRouter.delete("/delete/:id", requiresAuthentication,
    param("id").isMongoId(),
    async (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        try {
            const user = matchedData(req) as UserResource
            if(user.id){
                const deleted = await deleteUser(user.id);
                return res.send(deleted); // 200 by default
            }else{
                return res.status(404)
            }
        
        } catch (err) {
            res.status(400);
            next(err);
        }
    }
);

export default userRouter;