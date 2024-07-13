import { requiresAuthentication } from "../Middleware/auth";
import { UserResource } from "../util/Resources";
import express from "express";
import multer from "multer";
import { body, matchedData, param, validationResult } from "express-validator";
import { getUsersFromDB, getUser, createUser, updateUser, deleteUser } from "./UserService";
import path from "path";
import fs from 'fs';




export const userRouter = express.Router();

const storage = multer.diskStorage({
    destination(req, file, callback) {
        // Bei einem Positiv Fall keine Callbacks machen, da die immer ausgeführt werden.
        callback(null, "./uploads/")
    },
    filename: function (req, file, callback) {
        callback(null, req.name + "_" + file.originalname.split(".")[0] + "_" + path.extname(file.originalname))
    }
});

const upload = multer({
    storage: storage,
    fileFilter: function (req, file, callback) {
        const filetypes = /pdf|svg/;
        const mimetype = filetypes.test(file.mimetype);
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

        if (mimetype && extname) {
            return (callback(null, true))
        } else {
            callback(new Error("Bitte lade nur PDF oder SVG hoch."))
        }
    }
});

// https://stackoverflow.com/questions/31530200/node-multer-unexpected-field
userRouter.post("/upload", requiresAuthentication, upload.single('uploadedFile'), (req, res) => {
    const errors = validationResult(req);
    // console.log(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
    }

    res.status(200).json({ message: "File uploaded successfully", file: req.file });
});

// Uploade Files in die Kommentarsektion, so dass XSS Code ausgeführt wird.
userRouter.get('/uploaded_files', requiresAuthentication, (req, res) => {
    const directoryPath = path.join(__dirname, '../../uploads');
    fs.readdir(directoryPath, (err, files) => {

        if (err) {
            return res.status(404).json({ error: "Keine Files sind vorhanden" });
        }

        res.status(200).json(files);
    });
});


userRouter.get("/search", requiresAuthentication, async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const query = req.query.query || ''; // Abfrageparameter auslesen
    try {
        const users = await getUsersFromDB(query);
        return res.send(users); // 200 by default
    } catch (err) {
        res.status(400);
        next(err);
    }
});




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
            if (user.id) {
                const deleted = await deleteUser(user.id);
                return res.send(deleted); // 200 by default
            } else {
                return res.status(404)
            }

        } catch (err) {
            res.status(400);
            next(err);
        }
    }
);

export default userRouter;