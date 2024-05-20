"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const body_parser_1 = __importDefault(require("body-parser"));
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
const port = 4000; 
app.use(body_parser_1.default.json());
app.post('/xss-payload', (req, res) => {
    const payload = req.body.payload;
    console.log('Received XSS payload:', payload);
    res.sendStatus(200);
});
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
