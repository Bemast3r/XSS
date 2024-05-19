"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const app = (0, express_1.default)();
const port = 3000;
// Statische Dateien aus dem "frontend" Verzeichnis servieren
app.use(express_1.default.static(path_1.default.join(__dirname, '../../frontend')));
app.get('/', (req, res) => {
    res.sendFile(path_1.default.join(__dirname, '../../frontend', 'index.html'));
});
app.listen(port, () => {
    console.log(`Server läuft unter http://localhost:${port}`);
});
