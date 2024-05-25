import express from "express";
import { body, validationResult } from "express-validator";
import { verifyPasswordAndCreateJWT } from "../Service/JWTService";

const loginRouter = express.Router();

loginRouter.post("/",
    body('name').isString(),
    body('password').isString(),
    async (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            req.body
            return res.status(400).json({ errors: errors.array() });
        }
        try {
            const { name, password } = req.body;
            const jwtString = await verifyPasswordAndCreateJWT(name, password);
            if (!jwtString) {
                return res.status(401).json({ message: "Can't create a JWT." });
            } else {
                const loginRes = { token_type: "Bearer", access_token: jwtString };
                return res.status(201).json(loginRes)
            }
        } catch (error) {
            return res.sendStatus(500);
        }
    }
);




export default loginRouter;