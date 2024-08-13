import { requiresAuthentication } from "../Middleware/auth";
import { UserResource } from "../util/Resources";
import express from "express";
import multer from "multer";
import { body, matchedData, param, validationResult } from "express-validator";
import { getUsersFromDB, getUser, createUser, updateUser, deleteUser } from "./UserService";
import path from "path";
import fs from 'fs';
import * as fspromise from 'fs/promises';




export const userRouter = express.Router();

const storage = multer.diskStorage({
    destination(req, file, callback) {
        // Speichert Dateien im Verzeichnis "./uploads/"
        callback(null, "./uploads/");
    },
    filename(req, file, callback) {
        // Dateinamen: User + Originalname + Dateiendung
        callback(null, req.name + "_" + file.originalname.split(".")[0] + "_" + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    fileFilter(req, file, callback) {
        // Akzeptiert nur Dateien mit den Endungen PDF und SVG
        const filetypes = /pdf|svg/;
        const mimetype = filetypes.test(file.mimetype);
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

        if (mimetype && extname) {
            return callback(null, true);
        } else {
            callback(new Error("Bitte lade nur PDF oder SVG hoch."));
        }
    }
});

// https://stackoverflow.com/questions/31530200/node-multer-unexpected-field
userRouter.post("/upload", requiresAuthentication,
    upload.single('uploadedFile'),
    (req, res) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        if (!req.file) {
            return res.status(400).json({ error: "No file uploaded" });
        }

        res.status(200).json({ message: "File uploaded successfully", file: req.file });
    });

// Bereitstellen der Daten
userRouter.get('/uploaded_files', requiresAuthentication, async (req, res) => {

    const query = req.query.query?.toString() || ''; // Abfrageparameter auslesen
    const directoryPath = path.join(__dirname, '../../uploads'); // Datein aus dem Ordner entnehmen

    try {
        const files = await fspromise.readdir(directoryPath);

        return res.status(200).json(files);
    } catch (err) {
        return res.status(404).json({ error: "Keine Files sind vorhanden" });
    }
});

// Benutzer Suche
userRouter.get("/search", requiresAuthentication, async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    // Abfrageparameter auslesen
    const query = req.query.query || '';
    try {
        const users = await getUsersFromDB(query);
        return res.send(users); // 200 by default
    } catch (err) {
        res.status(400);
        next(err);
    }
});

// Dokumentation Suche
userRouter.get("/search_doc", requiresAuthentication, async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    // Abfrageparameter auslesen
    const query = req.query.query?.toString() || '';
    // Datein aus dem Ordner entnehmen
    const directoryPath = path.join(__dirname, '../../uploads');

    try {
        const files = await fspromise.readdir(directoryPath);
        // Dateien filtern, die mit dem Query beginnen
        const found = files.filter(file => file.startsWith(query));
        if (found.length === 0) {
            return res.status(404).json({ message: `Die Suche nach ${query} ergab keine Ergebnisse.` });
        }
        return res.status(200).json(found);
    } catch (err) {
        return res.status(404).json({ error: "Keine Files sind vorhanden" });
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