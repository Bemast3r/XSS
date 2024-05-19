import bodyParser from 'body-parser';
import express from 'express';
import path from 'path';

const app = express();
const port = 4000; // Wählen Sie einen beliebigen freien Port

// Middleware für das Parsen von JSON-Daten
app.use(bodyParser.json());

// Endpunkt zum Empfangen des bösartigen Payloads
app.post('/xss-payload', (req, res) => {
    const payload = req.body.payload;
    console.log('Received XSS payload:', payload);
    res.sendStatus(200);
});

// Server starten
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

