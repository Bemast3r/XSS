import express from 'express';
import path from 'path';

const app = express();
const port = 3000;

// Statische Dateien aus dem "frontend" Verzeichnis benutzen
app.use(express.static(path.join(__dirname, '../../frontend')));
// Homeseite 
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../../frontend', 'index.html'));
});

app.listen(port, () => {
    console.log(`Server läuft unter http://localhost:${port}`);
});
