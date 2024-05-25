import express from 'express';
import path from 'path';
import loginRouter from './Login/LoginRouter';

const app = express();
const port = 3000;

// Middleware für JSON und URL-kodierte Daten
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Statische Dateien aus dem "frontend" Verzeichnis benutzen
app.use(express.static(path.join(__dirname, '../../frontend')));

app.use("/api/login", loginRouter);


app.listen(port, () => {
    console.log(`Website Server is running http://localhost:${port}`);
});
